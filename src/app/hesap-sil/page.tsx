import Link from "next/link";
import { getTranslations } from "next-intl/server";

// Herkese açık "Hesap ve veri silme" sayfası (giriş gerektirmez). Google Play "hesap silme URL'si" olarak kullanılır:
// https://flow.workigom.com/hesap-sil
export const metadata = { title: "Workigom Flow — Hesap ve Veri Silme" };

export default async function DeleteAccountInfoPage() {
  const t = await getTranslations("deleteAccountPage");
  const steps = t.raw("steps") as string[];
  const deleted = t.raw("deleted") as string[];
  const box: React.CSSProperties = { borderRadius: 16, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)", padding: "18px 20px", marginBottom: 18 };

  return (
    <main style={{ minHeight: "100vh", background: "#0b0e14", color: "#e2e8f0", padding: "40px 20px" }}>
      <article style={{ maxWidth: 720, margin: "0 auto" }}>
        <Link href="/login" style={{ color: "#9CC2FF", fontSize: 13 }}>← {t("back")}</Link>
        <h1 style={{ fontSize: 30, fontWeight: 800, margin: "18px 0 10px", color: "#fff" }}>{t("title")}</h1>
        <p style={{ fontSize: 15, lineHeight: 1.7, color: "#cbd5e1", marginBottom: 22 }}>{t("intro")}</p>

        <section style={box}>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: "#fff", marginBottom: 10 }}>{t("stepsTitle")}</h2>
          <ol style={{ paddingLeft: 20, lineHeight: 1.8, color: "#cbd5e1", fontSize: 15 }}>
            {steps.map((s, i) => <li key={i}>{s}</li>)}
          </ol>
        </section>

        <section style={box}>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: "#fff", marginBottom: 10 }}>{t("deletedTitle")}</h2>
          <ul style={{ paddingLeft: 20, lineHeight: 1.8, color: "#cbd5e1", fontSize: 15 }}>
            {deleted.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </section>

        <section style={{ ...box, borderColor: "rgba(245,158,11,0.35)", background: "rgba(245,158,11,0.06)" }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: "#FBBF24", marginBottom: 6 }}>{t("noteTitle")}</h2>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: "#e2e8f0" }}>{t("note")}</p>
        </section>

        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center", marginTop: 22 }}>
          <Link href="/profil" style={{ padding: "12px 20px", borderRadius: 12, background: "linear-gradient(135deg,#EF4444,#F59E0B)", color: "#fff", fontWeight: 800 }}>{t("loginCta")}</Link>
          <Link href="/gizlilik" style={{ color: "#9CC2FF", fontSize: 14 }}>{t("privacyLink")}</Link>
        </div>
      </article>
    </main>
  );
}
