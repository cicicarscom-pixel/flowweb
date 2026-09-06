import { getTranslations } from "next-intl/server";
import { getCustomers } from '@/actions/customers';
import MusterilerClient from './MusterilerClient';

export default async function MusterilerPage() {
  const t = await getTranslations();
  const customers = await getCustomers();

  return (
    <div style={{
      maxWidth: 1000,
      margin: "0 auto",
      display: "flex",
      flexDirection: "column",
      gap: 32,
      padding: "20px 0"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 500, color: "var(--text-100)", letterSpacing: "-0.01em", margin: "0 0 6px 0" }}>
            {t("musteriler.title")}
          </h1>
          <p style={{ color: "var(--text-300)", fontSize: 14, margin: 0 }}>
            {t("musteriler.subtitle")}
          </p>
        </div>
      </div>

      <MusterilerClient initialCustomers={customers} />
    </div>
  );
}
