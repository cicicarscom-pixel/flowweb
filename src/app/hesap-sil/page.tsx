import Link from "next/link";
import { getTranslations } from "next-intl/server";
import LegalShell from "@/components/legal/LegalShell";

// Herkese açık "Hesap ve veri silme" sayfası (giriş gerektirmez). Google Play "hesap silme URL'si" olarak kullanılır:
// https://flow.workigom.com/hesap-sil
export const metadata = { title: "Workigom Flow — Hesap ve Veri Silme" };

export default async function DeleteAccountInfoPage() {
  const t = await getTranslations("deleteAccountPage");
  const steps = t.raw("steps") as string[];
  const deleted = t.raw("deleted") as string[];

  return (
    <LegalShell back={t("back")} title={t("title")} subtitle={t("intro")} single>
      <section className="lg-card">
        <h2>{t("stepsTitle")}</h2>
        <ol>
          {steps.map((s, i) => (
            <li key={i}><span className="lg-dot">{i + 1}</span><span>{s}</span></li>
          ))}
        </ol>
      </section>

      <section className="lg-card">
        <h2>{t("deletedTitle")}</h2>
        <ul>
          {deleted.map((s, i) => (
            <li key={i}><span className="lg-x">✕</span><span>{s}</span></li>
          ))}
        </ul>
      </section>

      <section className="lg-card lg-warn">
        <h2>{t("noteTitle")}</h2>
        <p>{t("note")}</p>
      </section>

      <div style={{ display: "flex", gap: 18, flexWrap: "wrap", alignItems: "center", marginTop: 22 }}>
        <Link href="/profil" className="lg-cta">{t("loginCta")}</Link>
        <Link href="/gizlilik" className="lg-link">{t("privacyLink")}</Link>
      </div>
    </LegalShell>
  );
}
