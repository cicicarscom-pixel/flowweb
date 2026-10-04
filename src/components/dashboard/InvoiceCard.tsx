"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { formatMoney } from "@/lib/money";

// Anasayfa "Son fatura" kartı. Belge görseli özel kovada durur (finance_receipts); önizleme için
// `finance-receipt-url` Edge Function'ından kısa ömürlü imzalı adres alınır (kimlik JWT'den çözülür).

type Invoice = {
  id: string;
  title?: string | null;
  counterparty_name?: string | null;
  amount_minor?: number | null;
  currency_code?: string | null;
  due_date?: string | null;
  created_at?: string | null;
  flow_payment_status?: string | null;
  ledger_official_status?: string | null;
  tax_details?: { invoice_number?: string; rate?: number; kdv_20?: number; kdv_10?: number; kdv_1?: number; total?: number } | null;
  image_url?: string | null;
};

const AMBER = "#F59E0B";

function daysBetween(fromYmd: string, toYmd: string): number {
  const [fy, fm, fd] = fromYmd.split("-").map(Number);
  const [ty, tm, td] = toYmd.split("-").map(Number);
  return Math.round((Date.UTC(ty, tm - 1, td) - Date.UTC(fy, fm - 1, fd)) / 86400000);
}

function Chip({ text, color }: { text: string; color: string }) {
  return (
    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", padding: "4px 9px", borderRadius: 99, color, background: `${color}1f`, border: `1px solid ${color}55` }}>
      {text}
    </span>
  );
}

export default function InvoiceCard({ invoice, locale, todayYmd, onScan }: { invoice: Invoice | null; locale: string; todayYmd: string; onScan: () => void }) {
  const t = useTranslations("dashboardHome.invoiceScanner");
  const c = useTranslations("dashboardHome.invoiceScanner.card");
  const supabase = createClient();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imgFailed, setImgFailed] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setPreviewUrl(null);
    setImgFailed(false);
    if (!invoice?.id || !invoice.image_url) return;
    let alive = true;
    supabase.functions.invoke("finance-receipt-url", { body: { documentId: invoice.id } })
      .then(({ data }) => { if (alive && data?.url) setPreviewUrl(data.url as string); })
      .catch(() => { /* önizleme yoksa simge gösterilir */ });
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoice?.id, invoice?.image_url]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const shell: React.CSSProperties = { display: "flex", flexDirection: "column", borderRadius: 20, padding: "20px 22px", height: "100%", position: "relative", overflow: "hidden" };

  const header = (right?: React.ReactNode) => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, color: AMBER, fontSize: 11, fontWeight: 700, letterSpacing: "0.12em" }}>
        <i className="fa-solid fa-file-invoice-dollar"></i> {c("latest")}
      </div>
      <div style={{ display: "flex", gap: 6 }}>{right}</div>
    </div>
  );

  const cta = (
    <button
      type="button"
      onClick={onScan}
      style={{ marginTop: "auto", width: "100%", padding: "12px 16px", borderRadius: 14, border: `1px solid ${AMBER}55`, background: "linear-gradient(135deg, rgba(245,158,11,0.28), rgba(239,68,68,0.16))", color: "#FFD58A", fontWeight: 700, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
    >
      <i className="fa-solid fa-camera-viewfinder"></i> {t("newInvoiceButton")}
    </button>
  );

  if (!invoice) {
    return (
      <div className="glass neon-orange" style={shell}>
        {header()}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, padding: "16px 0 20px", color: "var(--text-secondary)" }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(245,158,11,0.1)", border: `1px dashed ${AMBER}66`, color: AMBER, fontSize: 22 }}>
            <i className="fa-solid fa-file-invoice"></i>
          </div>
          <p style={{ fontSize: 13 }}>Henüz fatura taranmadı</p>
        </div>
        {cta}
      </div>
    );
  }

  const supplier = invoice.title || invoice.counterparty_name || "-";
  const amount = Number(invoice.amount_minor ?? 0) / 100;
  const currency = invoice.currency_code || "TRY";
  const dateText = (ymd?: string | null) => {
    if (!ymd) return "-";
    const [y, m, d] = ymd.slice(0, 10).split("-").map(Number);
    return new Intl.DateTimeFormat(locale, { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(Date.UTC(y, m - 1, d)));
  };
  // Fatura tarihi: okunan belgedeki "gg.aa.yyyy" varsa o, yoksa kayıt tarihi
  const rawDate = (invoice.tax_details as any)?.date as string | undefined;
  const m = rawDate ? /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/.exec(rawDate.trim()) : null;
  const issueYmd = m ? `${m[3]}-${m[2].padStart(2, "0")}-${m[1].padStart(2, "0")}` : (invoice.created_at ?? null);
  const kdvAmount = invoice.tax_details?.kdv_20 ?? invoice.tax_details?.kdv_10 ?? invoice.tax_details?.kdv_1 ?? null;
  const paid = invoice.flow_payment_status === "paid";
  const draft = invoice.ledger_official_status === "taslak";

  let dueNote: { text: string; color: string } | null = null;
  if (invoice.due_date && !paid) {
    const diff = daysBetween(todayYmd, invoice.due_date.slice(0, 10));
    dueNote = diff < 0 ? { text: c("overdue", { n: Math.abs(diff) }), color: "#EF4444" }
      : diff === 0 ? { text: c("dueToday"), color: AMBER }
      : { text: c("dueIn", { n: diff }), color: diff <= 7 ? AMBER : "#22B573" };
  }

  const showImage = !!previewUrl && !imgFailed;

  return (
    <div className="glass neon-orange" style={shell}>
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "radial-gradient(120% 80% at 100% 0%, rgba(245,158,11,0.10), transparent 60%)", pointerEvents: "none" }} />
      {header(
        <>
          {draft && <Chip text={c("draft")} color="#9CA3AF" />}
          <Chip text={paid ? c("paid") : c("unpaid")} color={paid ? "#22B573" : AMBER} />
        </>
      )}

      <div style={{ display: "flex", gap: 16, position: "relative" }}>
        <button
          type="button"
          onClick={() => showImage && setOpen(true)}
          aria-label={c("viewReceipt")}
          disabled={!showImage}
          style={{ width: 96, height: 124, borderRadius: 14, overflow: "hidden", flexShrink: 0, padding: 0, cursor: showImage ? "zoom-in" : "default", border: `1px solid ${AMBER}40`, background: "linear-gradient(160deg, rgba(245,158,11,0.14), rgba(255,255,255,0.03))", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", boxShadow: "0 10px 30px rgba(0,0,0,0.35)" }}
        >
          {showImage ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={previewUrl as string} alt={t("imageAlt")} onError={() => setImgFailed(true)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <span style={{ position: "absolute", right: 6, bottom: 6, width: 24, height: 24, borderRadius: 8, background: "rgba(0,0,0,0.55)", color: "#fff", fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <i className="fa-solid fa-magnifying-glass-plus"></i>
              </span>
            </>
          ) : (
            <span style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, color: AMBER, opacity: 0.8 }}>
              <i className="fa-solid fa-file-invoice" style={{ fontSize: 26 }}></i>
              <span style={{ fontSize: 10 }}>{c("noPreview")}</span>
            </span>
          )}
        </button>

        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 4 }}>
          <div title={supplier} style={{ color: "var(--text-primary)", fontSize: 14, fontWeight: 700, lineHeight: 1.3, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{supplier}</div>
          <div style={{ fontFamily: "Outfit, sans-serif", fontSize: 32, fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.1, background: "linear-gradient(90deg,#FFD58A,#F59E0B 55%,#EF4444)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
            {formatMoney(amount, locale, currency)}
          </div>
          <div style={{ color: "var(--text-secondary)", fontSize: 11, marginTop: 2, display: "flex", flexWrap: "wrap", gap: "2px 12px" }}>
            {kdvAmount != null && <span>{c("vatAmount")}: <b style={{ color: "var(--text-primary)" }}>{formatMoney(Number(kdvAmount), locale, currency)}</b></span>}
            {invoice.tax_details?.invoice_number && <span>{c("invoiceNo")}: <b style={{ color: "var(--text-primary)", fontFamily: "JetBrains Mono, monospace" }}>{invoice.tax_details.invoice_number}</b></span>}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, margin: "16px 0", position: "relative" }}>
        <div style={{ borderRadius: 12, padding: "10px 12px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ color: "var(--text-secondary)", fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase" }}>{t("fields.date")}</div>
          <div style={{ color: "var(--text-primary)", fontSize: 13, fontWeight: 700, marginTop: 2 }}>{dateText(issueYmd)}</div>
        </div>
        <div style={{ borderRadius: 12, padding: "10px 12px", background: "rgba(255,255,255,0.04)", border: `1px solid ${dueNote ? dueNote.color + "44" : "rgba(255,255,255,0.06)"}` }}>
          <div style={{ color: "var(--text-secondary)", fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase" }}>{c("dueDate")}</div>
          <div style={{ color: "var(--text-primary)", fontSize: 13, fontWeight: 700, marginTop: 2 }}>{dateText(invoice.due_date)}</div>
          {dueNote && <div style={{ color: dueNote.color, fontSize: 11, fontWeight: 600, marginTop: 2 }}>{dueNote.text}</div>}
        </div>
      </div>

      {cta}

      {open && previewUrl && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setOpen(false)}
          style={{ position: "fixed", inset: 0, zIndex: 80, background: "rgba(5,7,12,0.82)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, cursor: "zoom-out" }}
        >
          <button type="button" aria-label={c("close")} onClick={() => setOpen(false)} style={{ position: "absolute", top: 20, right: 24, width: 40, height: 40, borderRadius: 12, border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.08)", color: "#fff", cursor: "pointer" }}>
            <i className="fa-solid fa-xmark"></i>
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={previewUrl} alt={t("imageAlt")} onClick={(e) => e.stopPropagation()} style={{ maxWidth: "min(900px, 100%)", maxHeight: "100%", borderRadius: 16, boxShadow: "0 30px 80px rgba(0,0,0,0.6)", cursor: "default" }} />
        </div>
      )}
    </div>
  );
}
