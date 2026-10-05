"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";

// Hesabı kalıcı silme (Google Play zorunluluğu). Sunucuda `delete-account` Edge Function'ı çalışır; kimlik JWT'den çözülür.
// Kullanıcı yanlışlıkla silmesin diye kendi e-posta adresini yazarak onaylar.
const CONFIRM_TOKEN = "DELETE_MY_ACCOUNT";

export default function AccountDeletePanel({ email }: { email: string }) {
  const t = useTranslations("accountDelete");
  const supabase = createClient();
  const [typed, setTyped] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const matches = !!email && typed.trim().toLowerCase() === email.trim().toLowerCase();

  const remove = async () => {
    if (!matches || busy) return;
    setBusy(true);
    setError(null);
    const { data, error: invokeError } = await supabase.functions.invoke("delete-account", { body: { confirm: CONFIRM_TOKEN } });
    if (invokeError || !data?.success) {
      let code: string | undefined = data?.error;
      try { code = code ?? (await (invokeError as any)?.context?.json?.())?.error; } catch { /* gövde okunamadı */ }
      setError(code === "ADMIN_ACCOUNT" ? t("adminBlocked") : t("error"));
      setBusy(false);
      return;
    }
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <section className="glass" style={{ borderRadius: 18, padding: "22px 24px", marginTop: 24, border: "1px solid rgba(239,68,68,0.35)" }}>
      <h3 style={{ color: "#EF4444", fontWeight: 800, fontSize: 16, marginBottom: 8 }}>{t("title")}</h3>
      <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, lineHeight: 1.6, marginBottom: 14 }}>{t("warning")}</p>
      <label style={{ display: "block", fontSize: 13, marginBottom: 6, color: "#e2e8f0" }}>
        {t("confirmLabel")} <b>{email}</b>
      </label>
      <input
        value={typed}
        onChange={(e) => setTyped(e.target.value)}
        autoComplete="off"
        style={{ width: "100%", padding: 10, borderRadius: 10, marginBottom: 12, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff" }}
      />
      {error && <p style={{ color: "#EF4444", fontSize: 13, marginBottom: 10 }}>{error}</p>}
      <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
        <button
          type="button"
          onClick={remove}
          disabled={!matches || busy}
          style={{ padding: "10px 18px", borderRadius: 10, border: "none", background: "#EF4444", color: "#fff", fontWeight: 800, cursor: matches && !busy ? "pointer" : "not-allowed", opacity: matches && !busy ? 1 : 0.5 }}
        >
          {busy ? t("deleting") : t("button")}
        </button>
        <Link href="/gizlilik" style={{ color: "#9CC2FF", fontSize: 13 }}>{t("privacy")}</Link>
      </div>
    </section>
  );
}
