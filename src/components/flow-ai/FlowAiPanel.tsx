"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { flowAiShareHandoff } from "@/lib/flowAiShareHandoff";

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

const SPARKLES = (size: number) => (
  <svg width={size} height={size} viewBox="0 0 512 512" fill="currentColor" aria-hidden="true">
    <path d="M259.92 262.91L216.4 149.77a9 9 0 00-16.8 0l-43.52 113.14a9 9 0 01-5.17 5.17L37.77 311.6a9 9 0 000 16.8l113.14 43.52a9 9 0 015.17 5.17l43.52 113.14a9 9 0 0016.8 0l43.52-113.14a9 9 0 015.17-5.17l113.14-43.52a9 9 0 000-16.8l-113.14-43.52a9 9 0 01-5.17-5.17zM108 68L88 16 68 68 16 88l52 20 20 52 20-52 52-20zM426.67 117.33L400 48l-26.67 69.33L304 144l69.33 26.67L400 240l26.67-69.33L496 144z"/>
  </svg>
);

/** Mobildeki FlowAiOrb ile birebir: 138x52 koyu hap, dönen neon (cyan → mor → kırmızı) halka, mavi parlama, beyaz etiket. */
function FlowAiOrb({ label, ariaLabel, onClick }: { label: string; ariaLabel: string; onClick: () => void }) {
  const W = 138, H = 52, RING = 2.5;
  return (
    <button
      type="button"
      data-testid="flow_ai_fab"
      aria-label={ariaLabel}
      onClick={onClick}
      style={{ position: "relative", width: W, height: H, borderRadius: H / 2, padding: 0, border: "none", background: "transparent", cursor: "pointer", boxShadow: "0 0 14px rgba(0,162,255,0.55)", display: "block" }}
    >
      <style>{`@keyframes flowAiOrbSpin{to{transform:rotate(360deg)}}`}</style>
      <span style={{ position: "absolute", inset: 0, borderRadius: H / 2, overflow: "hidden", background: "#00a2ff" }}>
        <span style={{ position: "absolute", left: (W - 260) / 2, top: (H - 260) / 2, width: 260, height: 260, background: "linear-gradient(135deg,#00f3ff,#9D00FF,#FF0055,#00a2ff,#00f3ff)", animation: "flowAiOrbSpin 4.5s linear infinite" }} />
      </span>
      <span style={{ position: "absolute", inset: RING, borderRadius: (H - RING * 2) / 2, background: "#080B10", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        <span style={{ position: "absolute", inset: 0, borderRadius: (H - RING * 2) / 2, background: "linear-gradient(180deg,rgba(0,218,243,0.28),transparent)", opacity: 0.5 }} />
        <span style={{ position: "relative", color: "#fff", fontSize: 15, fontWeight: 700, letterSpacing: 0.4, textShadow: "0 2px 4px rgba(0,0,0,0.8)" }}>{label}</span>
      </span>
    </button>
  );
}

/** "Düşünüyor" animasyonu: üç nokta sırayla yanıp söner ve hafifçe yükselir (mobildeki TypingDots). */
function TypingDots({ color = "#9D5CFF", size = 7 }: { color?: string; size?: number }) {
  return (
    <span role="progressbar" aria-label="..." style={{ display: "inline-flex", alignItems: "center" }}>
      <style>{`@keyframes flowAiDot{0%,100%{opacity:.3;transform:translateY(0)}35%{opacity:1;transform:translateY(-${size * 0.6}px)}}`}</style>
      {[0, 160, 320].map((d) => (
        <span key={d} style={{ width: size, height: size, borderRadius: "50%", background: color, margin: "0 2.5px", animation: `flowAiDot 960ms ease-in-out ${d}ms infinite` }} />
      ))}
    </span>
  );
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
  const drag = useRef<{ sx: number; sy: number; ox: number; oy: number; moved: boolean } | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [shareJobPending, setShareJobPending] = useState<any | null>(null);
  const [attachmentMeta, setAttachmentMeta] = useState<{ kind: "video"; mimeType: string; durationSec: number; width: number; height: number; sizeBytes: number; fileName: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [shareConfirmState, setShareConfirmState] = useState<'IDLE' | 'NOT_READY' | 'STARTED'>('IDLE');

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
    } else if (action?.type === "share_video") {
      const att = flowAiShareHandoff.getFile();
      if (!att) return;
      const isValidString = (s: any) => typeof s === "string" && s.length <= 5000;
      const isValidPlatformList = (arr: any) => Array.isArray(arr) && arr.length <= 10 && arr.every((x) => typeof x === "string");
      const isValidSkippedList = (arr: any) => Array.isArray(arr) && arr.length <= 10 && arr.every((x) => typeof x.platform === "string" && typeof x.reason === "string");
      
      const { caption, platforms, skipped, scheduledLocal, timezone } = action;
      if (!isValidString(caption) || !isValidPlatformList(platforms) || (skipped && !isValidSkippedList(skipped))) {
        return;
      }
      if (scheduledLocal && typeof scheduledLocal !== "string") return;
      if (typeof timezone !== "string") return;
      
      const job = { caption, platforms, skipped: skipped || [], scheduledLocal: scheduledLocal || null, timezone };
      flowAiShareHandoff.setJob(job);
      setShareJobPending(job);
      router.push(SCREEN_ROUTES.ai_uretim);
    }
  }, [router]);

  const send = useCallback(async (override?: string) => {
    const text = (typeof override === "string" ? override : input).trim();
    if (!text || busy) return;
    setInput("");
    push("user", text);
    setBusy(true);
    try {
      const res = await call({ action: "chat", message: text, conversationId: conversationId.current || undefined, attachment: attachmentMeta || undefined });
      conversationId.current = res.conversationId;
      push("assistant", res.reply);
      setPending(res.pendingActions || []);
      (res.clientActions || []).forEach(dispatch);
    } catch (e: any) {
      push("error", e.code === "DAILY_LIMIT" ? t("dailyLimit", { limit: e.limit ?? "" }) : t("error"));
    } finally {
      setBusy(false);
    }
  }, [input, busy, call, dispatch, push, t, attachmentMeta]);

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

  useEffect(() => {
    const onShareResult = (e: any) => {
      const detail = e.detail;
      if (detail?.ok) {
        push("assistant", shareJobPending?.scheduledLocal ? t("share.scheduled") : t("share.done"));
      } else {
        push("error", t("share.failed", { message: detail?.message || "" }));
      }
      setShareJobPending(null);
      setAttachmentMeta(null);
      setShareConfirmState('IDLE');
      flowAiShareHandoff.clear();
      if (fileInputRef.current) fileInputRef.current.value = "";
    };
    window.addEventListener("flowai:share-result", onShareResult);
    return () => window.removeEventListener("flowai:share-result", onShareResult);
  }, [push, shareJobPending, t]);

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const isVideo = file.type.startsWith('video/');
    if (!isVideo) return;
    
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(video.src);
      if (!Number.isFinite(video.duration) || video.duration <= 0) {
        push("error", t("share.unreadable"));
        return;
      }
      const meta = {
        kind: "video" as const,
        mimeType: file.type,
        durationSec: video.duration,
        width: video.videoWidth,
        height: video.videoHeight,
        sizeBytes: file.size,
        fileName: file.name.substring(0, 120)
      };
      setAttachmentMeta(meta);
      flowAiShareHandoff.attach(file);
    };
    video.onerror = () => {
      push("error", t("share.unreadable"));
    };
    video.src = URL.createObjectURL(file);
  };

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
    // Mobildeki gibi sürüklenebilir: kısa dokunuş/tık paneli açar, sürükleme konumu değiştirir.
    return (
      <div
        onPointerDown={(e) => {
          drag.current = { sx: e.clientX, sy: e.clientY, ox: pos.x, oy: pos.y, moved: false };
        }}
        onPointerMove={(e) => {
          const d = drag.current;
          if (!d) return;
          const dx = e.clientX - d.sx, dy = e.clientY - d.sy;
          if (!d.moved && (Math.abs(dx) > 5 || Math.abs(dy) > 5)) {
            d.moved = true;
            (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); // yalnız sürüklemede; dokunuş tıklamasını bozmaz
          }
          if (d.moved) setPos({ x: d.ox + dx, y: d.oy + dy });
        }}
        onPointerUp={() => { if (drag.current && !drag.current.moved) drag.current = null; }}
        onClickCapture={(e) => {
          if (drag.current?.moved) { e.stopPropagation(); e.preventDefault(); }
          drag.current = null;
        }}
        style={{ position: "fixed", right: 24, bottom: 24, zIndex: 60, transform: `translate(${pos.x}px, ${pos.y}px)`, touchAction: "none" }}
      >
        <FlowAiOrb label={t("orbLabel")} ariaLabel={t("open")} onClick={() => setOpen(true)} />
      </div>
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
          {SPARKLES(18)}
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
          <div data-testid="flow_ai_typing" style={{ alignSelf: "flex-start", border: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.04)", borderRadius: 18, borderTopLeftRadius: 6, padding: "12px 16px" }}>
            <TypingDots color="#9D5CFF" size={7} />
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
        {shareJobPending && (
          <div style={{ ...box, padding: 12, borderColor: "rgba(34,181,115,0.4)", marginTop: 8 }}>
            <div style={{ color: "#22B573", fontWeight: 700, fontSize: 13, marginBottom: 8 }}>{t("share.cardTitle")}</div>
            <div style={{ fontSize: 12, color: "#D7DEE7", marginBottom: 8 }}>
              <div style={{ fontWeight: 600, color: "#9FB0C3" }}>{t("share.cardPlatforms")}:</div>
              {shareJobPending.platforms.join(", ")}
            </div>
            {shareJobPending.skipped && shareJobPending.skipped.length > 0 && (
              <div style={{ fontSize: 11, color: "#A79E96", marginBottom: 8, padding: 6, background: "rgba(255,255,255,0.03)", borderRadius: 6 }}>
                <div style={{ fontWeight: 600, color: "#8B949E", marginBottom: 2 }}>{t("share.cardSkipped")}:</div>
                {shareJobPending.skipped.map((s: any, i: number) => (
                  <div key={i}>• {cap(s.platform)}: {s.reason}</div>
                ))}
              </div>
            )}
            <div style={{ fontSize: 12, color: "#D7DEE7", marginBottom: 12 }}>
              <div style={{ fontWeight: 600, color: "#9FB0C3" }}>{t("share.cardWhen")}:</div>
              {shareJobPending.scheduledLocal ? shareJobPending.scheduledLocal : t("share.now")}
            </div>
            
            {shareConfirmState === 'NOT_READY' && (
              <div style={{ fontSize: 11, color: "#FF7A59", marginBottom: 8 }}>{t("share.notReady")}</div>
            )}

            <div style={{ display: "flex", gap: 6 }}>
              <button type="button" disabled={shareConfirmState === 'STARTED'} onClick={async () => {
                const state = await flowAiShareHandoff.confirm();
                setShareConfirmState(state);
              }} style={{ flex: 1, padding: "8px 0", borderRadius: 8, border: "none", background: "#22B573", color: "#000", fontWeight: 700, cursor: shareConfirmState === 'STARTED' ? "not-allowed" : "pointer", opacity: shareConfirmState === 'STARTED' ? 0.6 : 1 }}>
                {shareConfirmState === 'STARTED' ? t("share.sharing") : t("share.confirm")}
              </button>
              <button type="button" disabled={shareConfirmState === 'STARTED'} onClick={() => {
                setShareJobPending(null);
                setShareConfirmState('IDLE');
                flowAiShareHandoff.setJob(null as any);
              }} style={{ padding: "8px 12px", borderRadius: 8, border: "none", background: "rgba(255,255,255,0.1)", color: "#fff", fontWeight: 600, cursor: shareConfirmState === 'STARTED' ? "not-allowed" : "pointer" }}>
                {t("share.cancel")}
              </button>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {attachmentMeta && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: "rgba(34,181,115,0.1)", borderTop: "1px solid rgba(34,181,115,0.2)", fontSize: 12, color: "#22B573" }}>
          <i className="fa-solid fa-video"></i>
          <div style={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {t("share.attachedLabel")}: {attachmentMeta.fileName} ({Math.round(attachmentMeta.durationSec)}s)
          </div>
          <button type="button" onClick={() => { setAttachmentMeta(null); flowAiShareHandoff.clear(); if(fileInputRef.current) fileInputRef.current.value=""; }} style={{ background: "none", border: "none", color: "#22B573", cursor: "pointer", padding: "0 4px" }}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
      )}
      <form
        onSubmit={(e) => { e.preventDefault(); send(); }}
        style={{ display: "flex", gap: 8, padding: 12, borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <input type="file" ref={fileInputRef} accept="video/mp4,video/quicktime,video/webm" hidden onChange={handleVideoSelect} />
        <button type="button" onClick={() => fileInputRef.current?.click()} aria-label={t("share.attach")} style={{ width: 42, height: 42, borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.035)", color: "#8B949E", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <i className="fa-solid fa-paperclip"></i>
        </button>
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
