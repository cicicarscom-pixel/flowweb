"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";

// Flow AI web paneli (FA-W). Sunucu tarafı mobille AYNI (flow-ai-agent); istemci `client: "web"` gönderir.
// Kimlik JWT'den çözülür, istemci org/kullanıcı kimliği GÖNDERMEZ. Onay gerektiren işlemler sohbette kart olarak çıkar.

type Msg = { id: number; role: "user" | "assistant" | "error"; text: string };
type Pending = { id: string; toolName: string; payloadHash: string; preview?: any };
type Card = { id: string; kind: string; params: Record<string, any>; cta?: { type?: string; screen?: string } };

// Sunucunun gönderebileceği ekran anahtarı → web yolu (izin listesi; bilinmeyen anahtar sessizce yok sayılır).
const SCREEN_ROUTES: Record<string, string> = {
  anasayfa: "/",
  randevu: "/ai-asistan/randevu",
  musteriler: "/musteriler",
  hizmet_ayarlari: "/ai-asistan/isletme-hizmetleri",
  bot_yonetimi: "/ai-asistan",
  sosyal_medya: "/sosyal-medya",
  ai_uretim: "/sosyal-medya/share",
  analiz: "/analiz",
  ai_muhasebe: "/ai-muhasebe",
  muhasebecim: "/ai-muhasebe/muhasebecim",
  odeme_takvimi: "/ai-muhasebe/odeme-takvimi",
  isletmem: "/ai-muhasebe/isletmem",
  mesajlar: "/gelen-kutusu",
  yorumlar: "/gelen-kutusu?tab=yorumlar",
  bildirimler: "/gelen-kutusu?tab=bildirimler",
  profil: "/profil",
};

const PUBLISH_ERRORS: Record<string, string> = {
  PUBLISH_FAILED: "publish.failed",
  DRAFT_CHANGED: "publish.changed",
  PAYLOAD_CHANGED: "publish.changed",
  DRAFT_ALREADY_USED: "publish.used",
  SCHEDULE_IN_PAST: "publish.past",
};

const CHIPS = ["chipAppointments", "chipPost", "chipAccounts"] as const;

const cap = (s: unknown) => (s ? String(s).charAt(0).toUpperCase() + String(s).slice(1) : "");

function weekdayName(dayIndex: number, locale: string) {
  try {
    return new Date(Date.UTC(2023, 0, 1 + Number(dayIndex))).toLocaleDateString(locale, { weekday: "long", timeZone: "UTC" });
  } catch {
    return "";
  }
}

function dateLabel(ymd: string, locale: string) {
  try {
    const [y, m, d] = String(ymd).split("-").map(Number);
    return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString(locale, { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" });
  } catch {
    return String(ymd);
  }
}

function suggestionVars(card: Card, locale: string): Record<string, string | number> {
  const p = card.params || {};
  switch (card.kind) {
    case "free_slots": return { day: dateLabel(p.date, locale), free: p.free };
    case "best_time": return { day: weekdayName(p.dayIndex, locale), hour: p.hour, postCount: p.postCount };
    case "growth": return { platform: cap(p.platform), change: `${p.change > 0 ? "+" : ""}${p.change}`, days: p.days };
    default: return {};
  }
}

function formatWhen(preview: any) {
  try {
    return new Date(preview.scheduledFor).toLocaleString(undefined, { timeZone: preview.timezone, dateStyle: "medium", timeStyle: "short" });
  } catch {
    return String(preview?.scheduledFor || "");
  }
}

export default function FlowAiPanel() {
  const t = useTranslations("flowAi");
  const locale = useLocale();
  const router = useRouter();
  const supabase = createClient();

  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [pending, setPending] = useState<Pending[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const conversationId = useRef<string | null>(null);
  const cardsAt = useRef(0);
  const seq = useRef(0);
  const endRef = useRef<HTMLDivElement>(null);

  const push = useCallback((role: Msg["role"], text: string) => {
    setMessages((m) => [...m, { id: ++seq.current, role, text }]);
  }, []);

  const call = useCallback(async (body: Record<string, unknown>) => {
    const { data, error } = await supabase.functions.invoke("flow-ai-agent", { body: { ...body, client: "web" } });
    if (error) {
      let detail: any = null;
      try { detail = await (error as any).context?.json?.(); } catch { /* gövde okunamadı */ }
      const e: any = new Error(detail?.error || "NETWORK_ERROR");
      e.code = detail?.error || "NETWORK_ERROR";
      e.limit = detail?.limit;
      throw e;
    }
    return data;
  }, [supabase]);

  const dispatch = useCallback((action: any) => {
    if (action?.type === "navigate" && Object.prototype.hasOwnProperty.call(SCREEN_ROUTES, action.screen)) {
      router.push(SCREEN_ROUTES[action.screen]);
    }
  }, [router]);

  const send = useCallback(async (override?: string) => {
    const text = (typeof override === "string" ? override : input).trim();
    if (!text || busy) return;
    setInput("");
    push("user", text);
    setBusy(true);
    try {
      const res = await call({ action: "chat", message: text, conversationId: conversationId.current || undefined });
      conversationId.current = res.conversationId;
      push("assistant", res.reply);
      setPending(res.pendingActions || []);
      (res.clientActions || []).forEach(dispatch);
    } catch (e: any) {
      push("error", e.code === "DAILY_LIMIT" ? t("dailyLimit", { limit: e.limit ?? "" }) : t("error"));
    } finally {
      setBusy(false);
    }
  }, [input, busy, call, dispatch, push, t]);

  const decide = useCallback(async (action: Pending, approve: boolean) => {
    setBusy(true);
    try {
      const res = await call(approve
        ? { action: "approve", actionId: action.id, payloadHash: action.payloadHash }
        : { action: "reject", actionId: action.id });
      setPending((p) => p.filter((x) => x.id !== action.id));
      if (approve && res.status === "EXECUTED" && action.toolName === "publish_post") {
        push("assistant", t(res.result?.data?.scheduled ? "publish.scheduled" : "publish.published"));
      } else if (approve && res.status !== "EXECUTED") {
        const code = res.result?.status || res.status;
        push("error", t((PUBLISH_ERRORS[code] || "notApplied") as any));
      } else {
        const ok = res.status === "EXECUTED" || res.status === "REJECTED";
        push(ok ? "assistant" : "error", t(ok ? (approve ? "approved" : "rejected") : "notApplied"));
      }
    } catch {
      push("error", t("error"));
    } finally {
      setBusy(false);
    }
  }, [call, push, t]);

  // Öneri kartları: panel açılınca (en fazla dakikada bir) yüklenir; kendiliğinden hiçbir şey yapmaz.
  useEffect(() => {
    if (!open || Date.now() - cardsAt.current < 60000) return;
    cardsAt.current = Date.now();
    let alive = true;
    call({ action: "suggestions" })
      .then((r) => { if (alive) setCards(Array.isArray(r?.cards) ? r.cards : []); })
      .catch(() => { cardsAt.current = 0; });
    return () => { alive = false; };
  }, [open, call]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, busy, pending]);

  const dismissCard = (id: string) => setCards((c) => c.filter((x) => x.id !== id));
  const cardAction = (c: Card) => {
    dismissCard(c.id);
    if (c.cta?.type === "navigate" && c.cta.screen) {
      dispatch({ type: "navigate", screen: c.cta.screen });
      setOpen(false);
    } else {
      send(t(`suggest.${c.kind}.prompt` as any, suggestionVars(c, locale)));
    }
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t("open")}
        style={{ position: "fixed", right: 24, bottom: 24, zIndex: 60, display: "flex", alignItems: "center", gap: 8, padding: "12px 18px", borderRadius: 99, border: "1px solid rgba(157,92,255,0.5)", background: "linear-gradient(135deg,#3B82F6,#9D5CFF)", color: "#fff", fontWeight: 700, cursor: "pointer", boxShadow: "0 8px 30px rgba(157,92,255,0.35)" }}
      >
        <i className="fa-solid fa-wand-magic-sparkles"></i> {t("orbLabel")}
      </button>
    );
  }

  const box: React.CSSProperties = { borderRadius: 14, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)" };

  return (
    <div
      role="dialog"
      aria-label={t("title")}
      style={{ position: "fixed", right: 24, bottom: 24, zIndex: 60, width: "min(400px, calc(100vw - 32px))", height: "min(620px, calc(100vh - 48px))", display: "flex", flexDirection: "column", background: "rgba(18,21,28,0.98)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 18, boxShadow: "0 24px 60px rgba(0,0,0,0.55)", overflow: "hidden" }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg,#3B82F6,#9D5CFF)", color: "#fff" }}>
          <i className="fa-solid fa-wand-magic-sparkles"></i>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>{t("title")}</div>
          <div style={{ color: "#3FB950", fontSize: 12 }}>{t("online")}</div>
        </div>
        <button type="button" onClick={() => setOpen(false)} aria-label={t("close")} style={{ background: "none", border: "none", color: "#8B949E", cursor: "pointer", fontSize: 16, padding: 6 }}>
          <i className="fa-solid fa-xmark"></i>
        </button>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "10px 12px", display: "flex", flexDirection: "column", gap: 8 }}>
        {messages.length === 0 && (
          <div>
            <p style={{ color: "#8B949E", textAlign: "center", margin: "14px 0", fontSize: 13 }}>{t("empty")}</p>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 6 }}>
              {CHIPS.map((k) => (
                <button key={k} type="button" onClick={() => send(t(k))} style={{ ...box, padding: "7px 12px", color: "#8B949E", fontSize: 12, cursor: "pointer", borderRadius: 16 }}>
                  {t(k)}
                </button>
              ))}
            </div>
            {cards.length > 0 && pending.length === 0 && (
              <div style={{ marginTop: 14 }}>
                <div style={{ color: "#9FB0C3", fontSize: 12, fontWeight: 600, marginBottom: 6 }}>{t("suggest.header")}</div>
                {cards.map((c) => {
                  const vars = suggestionVars(c, locale);
                  const base = `suggest.${c.kind}`;
                  return (
                    <div key={c.id} style={{ ...box, padding: 12, marginBottom: 8, borderColor: "rgba(157,92,255,0.25)" }}>
                      <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                        <div style={{ color: "#fff", fontWeight: 700, fontSize: 14, flex: 1 }}>{t(`${base}.title` as any, vars)}</div>
                        <button type="button" onClick={() => dismissCard(c.id)} aria-label={t("suggest.dismiss")} style={{ background: "none", border: "none", color: "#65707D", cursor: "pointer" }}>
                          <i className="fa-solid fa-xmark"></i>
                        </button>
                      </div>
                      <div style={{ color: "#B8C4D2", fontSize: 12, marginTop: 6 }}>{t(`${base}.body` as any, vars)}</div>
                      <button type="button" onClick={() => cardAction(c)} style={{ marginTop: 10, padding: "7px 12px", borderRadius: 10, background: "rgba(59,130,246,0.18)", border: "1px solid rgba(59,130,246,0.45)", color: "#9CC2FF", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
                        {t(`${base}.cta` as any)}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {messages.map((m) => (
          <div
            key={m.id}
            style={m.role === "user"
              ? { alignSelf: "flex-end", maxWidth: "85%", padding: 11, borderRadius: 18, borderTopRightRadius: 6, background: "linear-gradient(90deg,#3B82F6,#9D5CFF)", color: "#fff", fontSize: 14, whiteSpace: "pre-wrap" }
              : { alignSelf: "flex-start", maxWidth: "85%", padding: 11, borderRadius: 18, borderTopLeftRadius: 6, border: `1px solid ${m.role === "error" ? "rgba(248,81,73,0.35)" : "rgba(255,255,255,0.05)"}`, background: m.role === "error" ? "rgba(248,81,73,0.10)" : "rgba(255,255,255,0.04)", color: "#D7DEE7", fontSize: 14, whiteSpace: "pre-wrap" }}
          >
            {m.text}
          </div>
        ))}

        {busy && messages.length > 0 && (
          <div style={{ alignSelf: "flex-start", ...box, padding: "10px 14px", color: "#9D5CFF", letterSpacing: 3 }} aria-hidden="true">
            <span className="animate-pulse">●●●</span>
          </div>
        )}

        {pending.map((p) => {
          const isPublish = p.toolName === "publish_post" && p.preview?.text;
          return (
            <div key={p.id} style={{ ...box, padding: 10, borderColor: "rgba(0,218,243,0.2)" }}>
              <div style={{ color: "#00DAF3", fontWeight: 600, fontSize: 12 }}>{t(isPublish ? "publish.title" : "pendingTitle")}</div>
              {isPublish ? (
                <>
                  <div style={{ color: "#9FB0C3", marginTop: 4, fontSize: 12 }}>
                    {(p.preview.platforms || []).join(", ")} · {p.preview.mode === "schedule" ? t("publish.at", { when: formatWhen(p.preview) }) : t("publish.now")}
                  </div>
                  <div style={{ color: "#D7DEE7", marginTop: 6, fontSize: 13, whiteSpace: "pre-wrap" }}>{p.preview.text}</div>
                </>
              ) : (
                <div style={{ color: "#D7DEE7", marginTop: 2, fontSize: 13 }}>{p.preview?.description || p.toolName}</div>
              )}
              <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                <button type="button" disabled={busy} onClick={() => decide(p, true)} style={{ flex: 1, padding: "10px 0", borderRadius: 12, border: "none", background: "#238636", color: "#fff", fontWeight: 700, cursor: busy ? "not-allowed" : "pointer", opacity: busy ? 0.6 : 1 }}>
                  {t(isPublish ? (p.preview.mode === "schedule" ? "publish.approveSchedule" : "publish.approveNow") : "approve")}
                </button>
                <button type="button" disabled={busy} onClick={() => decide(p, false)} style={{ flex: 1, padding: "10px 0", borderRadius: 12, border: "none", background: "rgba(255,255,255,0.08)", color: "#fff", fontWeight: 700, cursor: busy ? "not-allowed" : "pointer", opacity: busy ? 0.6 : 1 }}>
                  {t(isPublish ? "publish.cancel" : "reject")}
                </button>
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); send(); }}
        style={{ display: "flex", gap: 8, padding: 12, borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={busy}
          maxLength={4000}
          placeholder={t("placeholder")}
          style={{ flex: 1, color: "#fff", background: "rgba(255,255,255,0.035)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "10px 12px", outline: "none" }}
        />
        <button type="submit" disabled={busy || !input.trim()} aria-label={t("title")} style={{ width: 42, height: 42, borderRadius: 12, border: "none", background: "linear-gradient(135deg,#3B82F6,#9D5CFF)", color: "#fff", cursor: "pointer", opacity: busy || !input.trim() ? 0.5 : 1 }}>
          <i className="fa-solid fa-paper-plane"></i>
        </button>
      </form>
    </div>
  );
}
