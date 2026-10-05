import Link from "next/link";
import { getTranslations } from "next-intl/server";

// Herkese açık Gizlilik Politikası (giriş gerektirmez). Google Play "Gizlilik Politikası" URL'si olarak kullanılır:
// https://flow.workigom.com/gizlilik
export const metadata = { title: "Workigom Flow — Gizlilik Politikası" };

type Section = { title: string; body: string[] };

export default async function PrivacyPage() {
  const t = await getTranslations("privacyPage");
  const sections = t.raw("sections") as Section[];

  return (
    <main style={{ minHeight: "100vh", background: "#0b0e14", color: "#e2e8f0", padding: "40px 20px" }}>
      <article style={{ maxWidth: 780, margin: "0 auto" }}>
        <Link href="/login" style={{ color: "#9CC2FF", fontSize: 13 }}>← {t("back")}</Link>
        <h1 style={{ fontSize: 32, fontWeight: 800, margin: "18px 0 6px", color: "#fff" }}>{t("title")}</h1>
        <p style={{ color: "#8B949E", fontSize: 13, marginBottom: 28 }}>{t("updated")}</p>
        {sections.map((s) => (
          <section key={s.title} style={{ marginBottom: 26 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 8 }}>{s.title}</h2>
            {s.body.map((p, i) => (
              <p key={i} style={{ fontSize: 15, lineHeight: 1.7, color: "#cbd5e1", marginBottom: 8 }}>{p}</p>
            ))}
          </section>
        ))}
      </article>
    </main>
  );
}
