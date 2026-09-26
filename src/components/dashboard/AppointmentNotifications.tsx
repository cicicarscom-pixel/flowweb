"use client";

/**
 * Randevu Bildirimleri (Anasayfa) + zil ikonu için okunmamış sayacı.
 *
 * VERİ KAYNAĞI: yalnızca `notifications` tablosu, type = 'appointment_created'.
 * Bu satırları veritabanındaki `tr_notify_new_appointment` trigger'ı üretir
 * (WhatsApp'tan gelen her yeni randevu için bir satır). RLS, kullanıcıya
 * yalnızca kendi işletmesinin bildirimlerini gösterir; bu yüzden sorgulara
 * ek bir ID filtresi KONMAZ.
 *
 * ai_communication_logs bu dosyada hiçbir şekilde kullanılmaz.
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Locale = "tr" | "en" | "de";

type NotificationMetadata = {
  appointment_id: string;
  customer_name: string | null;
  starts_at: string; // UTC ISO
  timezone: string; // IANA, ör. Europe/Istanbul
  calendar_name: string | null;
  customer_request_raw: string | null;
  source: string;
};

type AppointmentNotification = {
  id: string;
  created_at: string;
  is_read: boolean;
  metadata: NotificationMetadata | null;
};

const NOTIFICATION_TYPE = "appointment_created";
const REFRESH_MS = 30_000;

const STRINGS: Record<Locale, {
  title: string;
  colTime: string;
  colNotification: string;
  colAction: string;
  view: string;
  empty: string;
  error: string;
  retry: string;
  unknownCustomer: string;
  sentence: (name: string, when: string) => string;
}> = {
  tr: {
    title: "Randevu Bildirimleri",
    colTime: "Bildirim zamanı",
    colNotification: "Bildirim",
    colAction: "İşlem",
    view: "Görüntüle",
    empty: "Henüz randevu bildirimi yok. WhatsApp asistanı yeni bir randevu oluşturduğunda burada görünecek.",
    error: "Bildirimler yüklenemedi.",
    retry: "Tekrar dene",
    unknownCustomer: "Bir müşteri",
    sentence: (name, when) => `${name} için ${when} tarihine randevu oluşturuldu`,
  },
  en: {
    title: "Appointment notifications",
    colTime: "Received",
    colNotification: "Notification",
    colAction: "Action",
    view: "View",
    empty: "No appointment notifications yet. New bookings from the WhatsApp assistant will appear here.",
    error: "Couldn't load notifications.",
    retry: "Try again",
    unknownCustomer: "A customer",
    sentence: (name, when) => `Appointment booked for ${name} on ${when}`,
  },
  de: {
    title: "Terminbenachrichtigungen",
    colTime: "Eingegangen",
    colNotification: "Benachrichtigung",
    colAction: "Aktion",
    view: "Ansehen",
    empty: "Noch keine Terminbenachrichtigungen. Neue Buchungen über den WhatsApp-Assistenten erscheinen hier.",
    error: "Benachrichtigungen konnten nicht geladen werden.",
    retry: "Erneut versuchen",
    unknownCustomer: "Ein Kunde",
    sentence: (name, when) => `Termin für ${name} am ${when} erstellt`,
  },
};

const INTL_LOCALE: Record<Locale, string> = { tr: "tr-TR", en: "en-GB", de: "de-DE" };

/** Randevu saati, randevunun kendi saat diliminde: "30 Eylül Çarşamba 10:00" */
function formatAppointmentTime(meta: NotificationMetadata, locale: Locale): string {
  try {
    return new Date(meta.starts_at).toLocaleString(INTL_LOCALE[locale], {
      timeZone: meta.timezone,
      weekday: "long",
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (e) {
    return "";
  }
}

/** Randevu sayfası için yerel tarih: "2026-09-30" */
function localDateParam(meta: NotificationMetadata): string {
  try {
    return new Date(meta.starts_at).toLocaleDateString("en-CA", { timeZone: meta.timezone });
  } catch(e) {
    return "";
  }
}

function formatCreatedAt(iso: string, locale: Locale): string {
  return new Date(iso).toLocaleString(INTL_LOCALE[locale], {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/* ------------------------------------------------------------------ */
/* Hooks                                                               */
/* ------------------------------------------------------------------ */

export function useAppointmentNotifications(limit = 10) {
  const supabase = useMemo(() => createClient(), []);
  const [items, setItems] = useState<AppointmentNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const { data, error } = await supabase
      .from("notifications")
      .select("id, created_at, is_read, metadata")
      .eq("type", NOTIFICATION_TYPE)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("[AppointmentNotifications] fetch failed:", error);
      setError(error.message);
    } else {
      setError(null);
      setItems((data ?? []) as AppointmentNotification[]);
    }
    setLoading(false);
  }, [supabase, limit]);

  const markRead = useCallback(async (id: string) => {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
    const { error } = await supabase.from("notifications").update({ is_read: true }).eq("id", id);
    if (error) console.error("[AppointmentNotifications] markRead failed:", error);
  }, [supabase]);

  useEffect(() => {
    refresh();
    const timer = setInterval(refresh, REFRESH_MS);
    const onFocus = () => refresh();
    window.addEventListener("focus", onFocus);
    return () => {
      clearInterval(timer);
      window.removeEventListener("focus", onFocus);
    };
  }, [refresh]);

  return { items, loading, error, refresh, markRead };
}

/** Zil ikonu için: okunmamış randevu bildirimi sayısı. */
export function useUnreadAppointmentCount() {
  const supabase = useMemo(() => createClient(), []);
  const [count, setCount] = useState(0);

  const refresh = useCallback(async () => {
    const { count, error } = await supabase
      .from("notifications")
      .select("id", { count: "exact", head: true })
      .eq("type", NOTIFICATION_TYPE)
      .eq("is_read", false);

    if (error) {
      console.error("[useUnreadAppointmentCount] failed:", error);
      return;
    }
    setCount(count ?? 0);
  }, [supabase]);

  useEffect(() => {
    refresh();
    const timer = setInterval(refresh, REFRESH_MS);
    const onFocus = () => refresh();
    window.addEventListener("focus", onFocus);
    return () => {
      clearInterval(timer);
      window.removeEventListener("focus", onFocus);
    };
  }, [refresh]);

  return count;
}

/* ------------------------------------------------------------------ */
/* Bileşen                                                             */
/* ------------------------------------------------------------------ */

export default function AppointmentNotifications({ locale = "tr", limit = 10 }: { locale?: Locale; limit?: number }) {
  const s = STRINGS[locale];
  const router = useRouter();
  const { items, loading, error, refresh, markRead } = useAppointmentNotifications(limit);

  const open = async (n: AppointmentNotification) => {
    if (!n.is_read) await markRead(n.id);
    const date = n.metadata ? localDateParam(n.metadata) : null;
    router.push(date ? \`/ai-asistan/randevu?date=\${date}\` : "/ai-asistan/randevu");
  };

  return (
    <section aria-labelledby="appointment-notifications-title">
      <style>{CSS}</style>
      <h3 id="appointment-notifications-title" className="an-title">{s.title}</h3>

      <div className="an-panel">
        <div className="an-head" aria-hidden="true">
          <span>{s.colTime}</span>
          <span>{s.colNotification}</span>
          <span className="an-right">{s.colAction}</span>
        </div>

        {loading && <div className="an-state">…</div>}

        {!loading && error && (
          <div className="an-state">
            {s.error}{" "}
            <button type="button" className="an-link" onClick={refresh}>{s.retry}</button>
          </div>
        )}

        {!loading && !error && items.length === 0 && <div className="an-state">{s.empty}</div>}

        {!loading && !error && items.map((n) => {
          const m = n.metadata;
          const name = m?.customer_name?.trim() || s.unknownCustomer;
          const when = m ? formatAppointmentTime(m, locale) : "";
          return (
            <button
              key={n.id}
              type="button"
              className={\`an-row\${n.is_read ? "" : " an-unread"}\`}
              onClick={() => open(n)}
            >
              <span className="an-time">{formatCreatedAt(n.created_at, locale)}</span>
              <span className="an-body">
                <span className="an-sentence">
                  {!n.is_read && <span className="an-dot" aria-label="okunmadı" />}
                  {m ? s.sentence(name, when) : s.sentence(name, "—")}
                </span>
                {(m?.calendar_name || m?.customer_request_raw) && (
                  <span className="an-meta">
                    {m?.calendar_name && <span className="an-doctor">{m.calendar_name}</span>}
                    {m?.customer_request_raw && <span className="an-note">📝 {m.customer_request_raw}</span>}
                  </span>
                )}
              </span>
              <span className="an-right an-action">{s.view}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

const CSS = \`
.an-title { font-size: 16px; font-weight: 700; color: #fff; margin: 0 0 14px; }
.an-panel {
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 20px;
  overflow: hidden;
  background: rgba(255,255,255,0.02);
}
.an-head, .an-row {
  display: grid;
  grid-template-columns: minmax(150px, 1fr) 3fr minmax(90px, auto);
  gap: 16px;
  align-items: center;
  padding: 16px 20px;
}
.an-head {
  font-size: 13px; font-weight: 600;
  color: var(--text-secondary, rgba(255,255,255,0.55));
  border-bottom: 1px solid rgba(255,255,255,0.06);
}
.an-row {
  width: 100%; text-align: left; font: inherit; color: inherit;
  background: transparent; border: 0; cursor: pointer;
  border-left: 3px solid transparent;
  border-bottom: 1px solid rgba(255,255,255,0.04);
}
.an-row:last-child { border-bottom: 0; }
.an-row:hover { background: rgba(255,255,255,0.03); }
.an-row:focus-visible { outline: 2px solid #22B573; outline-offset: -2px; }
.an-unread { background: rgba(34,181,115,0.06); border-left-color: #22B573; }
.an-time { font-size: 13px; color: var(--text-secondary, rgba(255,255,255,0.55)); }
.an-body { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
.an-sentence { font-size: 14px; color: #fff; line-height: 1.4; }
.an-unread .an-sentence { font-weight: 700; }
.an-dot {
  display: inline-block; width: 8px; height: 8px; border-radius: 50%;
  background: #22B573; margin-right: 8px; vertical-align: middle;
}
.an-meta { display: flex; flex-wrap: wrap; gap: 8px; font-size: 12px; }
.an-doctor { color: #22B573; background: rgba(34,181,115,0.1); padding: 2px 8px; border-radius: 99px; }
.an-note {
  color: var(--text-secondary, rgba(255,255,255,0.55));
  background: rgba(255,255,255,0.05); padding: 2px 8px; border-radius: 99px;
  overflow-wrap: anywhere;
}
.an-right { text-align: right; }
.an-action { font-size: 13px; font-weight: 600; color: #FF7A59; }
.an-state { padding: 24px 20px; font-size: 14px; color: var(--text-secondary, rgba(255,255,255,0.55)); }
.an-link { background: none; border: 0; padding: 0; color: #22B573; font: inherit; cursor: pointer; text-decoration: underline; }
@media (max-width: 640px) {
  .an-head { display: none; }
  .an-row { grid-template-columns: 1fr; gap: 6px; }
  .an-right { text-align: left; }
}
\`;
