"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { getReminderSettings, setReminderSettings, setReminderTemplate } from "@/actions/reminderSettings";

// WhatsApp randevu hatırlatma: aç/kapat + işletmenin kendi metni + mesaj dili.
// Doğrulama ve varsayılan metinler veritabanındadır. Hitap (Sayın / Mr. / Herr…) kodda sabit DEĞİLDİR; isteyen metne kendisi yazar.

const LOCALES: [string, string][] = [["tr", "Türkçe"], ["en", "English"], ["de", "Deutsch"], ["fr", "Français"], ["es", "Español"]];
const PLACEHOLDERS = ["name", "first_name", "business", "date", "time", "doctor", "service"] as const;
const SAMPLES: Record<string, Record<string, string>> = {
  tr: { name: "Ayşe Demir", first_name: "Ayşe", business: "İşletmeniz", date: "9 Ekim Cuma", time: "10:30", doctor: "Dr. Mehmet Kaya", service: "Kontrol" },
  en: { name: "Alex Morgan", first_name: "Alex", business: "Your Business", date: "Friday 9 October", time: "10:30", doctor: "Dr. Jane Smith", service: "Check-up" },
  de: { name: "Anna Müller", first_name: "Anna", business: "Ihre Praxis", date: "Freitag, 9. Oktober", time: "10:30", doctor: "Dr. Lena Schmidt", service: "Kontrolle" },
  fr: { name: "Claire Martin", first_name: "Claire", business: "Votre cabinet", date: "vendredi 9 octobre", time: "10:30", doctor: "Dr Marie Dubois", service: "Contrôle" },
  es: { name: "Lucía Pérez", first_name: "Lucía", business: "Su clínica", date: "viernes, 9 de octubre", time: "10:30", doctor: "Dra. Ana Ruiz", service: "Revisión" },
};

function renderPreview(text: string, locale: string): string {
  const s = SAMPLES[locale] || SAMPLES.en;
  return String(text || "").replace(/\{([A-Za-z_]+)\}/g, (m, k: string) => (k in s ? s[k] : m));
}

export default function ReminderToggle() {
  const t = useTranslations("reminderToggle");
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const [defaults, setDefaults] = useState<Record<string, string>>({});
  const [locale, setLocale] = useState("en");
  const [text, setText] = useState("");
  const [savedKey, setSavedKey] = useState<string | null>(null);
  const [justSaved, setJustSaved] = useState(false);
  const [savingTpl, setSavingTpl] = useState(false);
  const [tplError, setTplError] = useState<string | null>(null);
  const areaRef = useRef<HTMLTextAreaElement>(null);

  const formKey = JSON.stringify([locale, text]);
  const isDirty = savedKey !== null && formKey !== savedKey;

  useEffect(() => {
    let active = true;
    getReminderSettings().then((s) => {
      if (!active) return;
      if (s) {
        setEnabled(s.enabled);
        setDefaults(s.defaults);
        setLocale(s.locale);
        const initial = s.template || s.defaults[s.locale] || "";
        setText(initial);
        setSavedKey(JSON.stringify([s.locale, initial]));
      }
      setLoading(false);
    });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (isDirty) setJustSaved(false);
  }, [isDirty]);

  const handleToggle = async () => {
    if (saving) return;
    const next = !enabled;
    setEnabled(next); // iyimser
    setSaving(true);
    setMessage(null);
    const res = await setReminderSettings(next);
    setSaving(false);
    if (!res.ok) {
      setEnabled(!next); // geri al
      setMessage(res.reason === "forbidden" ? t("ownerOnly") : t("saveFailed"));
    }
  };

  const changeLocale = (next: string) => {
    if (next === locale) return;
    // Metin hâlâ eski dilin varsayılanıysa yeni dilin varsayılanına geç; özel metin korunur.
    if (text.trim() === String(defaults[locale] || "").trim() && defaults[next]) setText(defaults[next]);
    setLocale(next);
  };

  const insertPlaceholder = (key: string) => {
    const token = `{${key}}`;
    const el = areaRef.current;
    const start = el?.selectionStart ?? text.length;
    const end = el?.selectionEnd ?? text.length;
    setText(text.slice(0, start) + token + text.slice(end));
    requestAnimationFrame(() => {
      if (!el) return;
      el.focus();
      const pos = start + token.length;
      el.setSelectionRange(pos, pos);
    });
  };

  const handleSaveTemplate = async () => {
    if (!isDirty || savingTpl) return;
    const keyAtSave = formKey;
    setSavingTpl(true);
    setTplError(null);
    const isDefault = text.trim() === String(defaults[locale] || "").trim();
    const res = await setReminderTemplate(isDefault ? null : text, locale);
    setSavingTpl(false);
    if (res.ok) {
      setSavedKey(keyAtSave);
      setJustSaved(true);
    } else if (res.reason === "forbidden") {
      setTplError(t("ownerOnly"));
    } else if (res.reason === "unknown_placeholder") {
      setTplError(t("unknownPlaceholder", { list: (res.unknown || []).map((k) => `{${k}}`).join(", ") }));
    } else if (res.reason === "too_long") {
      setTplError(t("tooLong"));
    } else {
      setTplError(t("saveFailed"));
    }
  };

  if (loading) return null;

  return (
    <div className="glass" style={{
      borderRadius: 16, padding: "20px 24px", border: "1px solid rgba(255,255,255,0.06)",
      marginBottom: 16,
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
            <span style={{ fontSize: 20 }}>💬</span>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#fff" }}>{t("title")}</h3>
          </div>
          <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.6)" }}>{t("desc")}</p>
          {message && <p role="alert" style={{ margin: "8px 0 0", fontSize: 12, color: "#FF7A59" }}>{message}</p>}
        </div>
        <div
          role="switch"
          aria-checked={enabled}
          aria-label={t("title")}
          tabIndex={0}
          onClick={handleToggle}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleToggle(); } }}
          style={{
            width: 44, height: 24, borderRadius: 99, flexShrink: 0,
            background: enabled ? "#22B573" : "rgba(255,255,255,0.1)",
            display: "flex", alignItems: "center", cursor: saving ? "wait" : "pointer",
            padding: 3, transition: "background 0.3s", opacity: saving ? 0.7 : 1,
          }}
        >
          <div style={{
            width: 18, height: 18, borderRadius: "50%", background: "#fff",
            transform: enabled ? "translateX(20px)" : "translateX(0)", transition: "transform 0.3s",
          }} />
        </div>
      </div>

      {enabled && savedKey !== null && (
        <div style={{ marginTop: 20, paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 8 }}>{t("languageLabel")}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
            {LOCALES.map(([code, label]) => (
              <button
                key={code}
                type="button"
                onClick={() => changeLocale(code)}
                style={{
                  padding: "6px 14px", borderRadius: 10, fontSize: 13, cursor: "pointer", color: "#fff",
                  border: `1px solid ${locale === code ? "#22B573" : "rgba(255,255,255,0.12)"}`,
                  background: locale === code ? "rgba(34,181,115,0.2)" : "rgba(255,255,255,0.05)",
                  fontWeight: locale === code ? 700 : 400,
                }}
              >
                {label}
              </button>
            ))}
          </div>

          <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 8 }}>{t("messageLabel")}</div>
          <textarea
            ref={areaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={700}
            rows={7}
            className="glass-input"
            style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.2)", color: "#fff", resize: "vertical", fontFamily: "inherit", fontSize: 13 }}
          />
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", margin: "4px 0 12px" }}>{text.length}/700</div>

          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", marginBottom: 8 }}>{t("placeholdersHint")}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
            {PLACEHOLDERS.map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => insertPlaceholder(k)}
                style={{ padding: "4px 10px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.05)", cursor: "pointer", textAlign: "left" }}
              >
                <div style={{ color: "#00DAF3", fontSize: 12 }}>{`{${k}}`}</div>
                <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 10 }}>{t(`ph.${k}`)}</div>
              </button>
            ))}
          </div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", marginBottom: 16 }}>{t("honorificHint")}</div>

          <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 8 }}>{t("previewLabel")}</div>
          <div style={{ background: "#1F2C34", borderRadius: 12, padding: 12, marginBottom: 16, color: "#e9edef", fontSize: 13, lineHeight: 1.5, whiteSpace: "pre-wrap" }}>
            {renderPreview(text, locale)}
          </div>

          {tplError && <p role="alert" style={{ margin: "0 0 12px", fontSize: 12, color: "#FF7A59" }}>{tplError}</p>}

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button
              type="button"
              onClick={handleSaveTemplate}
              disabled={!isDirty || savingTpl}
              className="pill-btn"
              style={{ padding: "10px 28px", borderRadius: 12, background: "var(--accent-primary, #22B573)", color: "#000", fontWeight: 600, border: "none", cursor: !isDirty || savingTpl ? "not-allowed" : "pointer", opacity: savingTpl ? 0.7 : (!isDirty ? 0.5 : 1) }}
            >
              {savingTpl ? t("saving") : (justSaved && !isDirty ? t("saved") : t("save"))}
            </button>
            <button
              type="button"
              onClick={() => { if (defaults[locale]) setText(defaults[locale]); }}
              style={{ background: "none", border: "none", color: "rgba(255,255,255,0.6)", fontSize: 13, cursor: "pointer", textDecoration: "underline" }}
            >
              {t("resetDefault")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
