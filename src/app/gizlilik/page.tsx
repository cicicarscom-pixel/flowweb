import { getTranslations } from "next-intl/server";
import LegalShell from "@/components/legal/LegalShell";

// Herkese açık Gizlilik Politikası (giriş gerektirmez). Google Play "Gizlilik Politikası" URL'si olarak kullanılır:
// https://flow.workigom.com/gizlilik
export const metadata = { title: "Workigom Flow — Gizlilik Politikası" };

type Section = { title: string; body: string[] };

export default async function PrivacyPage() {
  const t = await getTranslations("privacyPage");
  const sections = t.raw("sections") as Section[];

  return (
    <LegalShell
      back={t("back")}
      title={t("title")}
      badge={t("updated")}
      toc={sections.map((s, i) => ({ id: `s${i + 1}`, label: s.title }))}
      tocTitle={t("title")}
    >
      {sections.map((s, i) => (
        <section key={s.title} id={`s${i + 1}`} className="lg-card">
          <h2>{s.title}</h2>
          {s.body.map((p, j) => <p key={j}>{p}</p>)}
        </section>
      ))}
    </LegalShell>
  );
}
