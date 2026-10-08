"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { getReminderSettings, setReminderSettings } from "@/actions/reminderSettings";

export default function ReminderToggle() {
  const t = useTranslations("reminderToggle");
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    getReminderSettings().then((s) => {
      if (!active) return;
      if (s) setEnabled(s.enabled);
      setLoading(false);
    });
    return () => { active = false; };
  }, []);

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

  if (loading) return null;

  return (
    <div className="glass" style={{
      borderRadius: 16, padding: "20px 24px", border: "1px solid rgba(255,255,255,0.06)",
      display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, gap: 16,
    }}>
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
  );
}
