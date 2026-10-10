import React from 'react';
import { appointmentSentence } from '@/lib/appointmentSentence';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useTranslations } from 'next-intl';

type NotificationsTabProps = {
  activeTab: "mesajlar" | "yorumlar" | "degerlendirmeler" | "bildirimler";
  isLoading: boolean;
  locale: string;
  notifications: any[];
  router: ReturnType<typeof useRouter>;
  setNotifications: React.Dispatch<React.SetStateAction<any[]>>;
  supabase: ReturnType<typeof createClient>;
  t: ReturnType<typeof useTranslations>;
};

export function NotificationsTab({ activeTab, isLoading, locale, notifications, router, setNotifications, supabase, t }: NotificationsTabProps) {
  return (
    !isLoading && activeTab === 'bildirimler' && notifications.length === 0 ? (
      <div className="flex flex-col items-center justify-center p-20 opacity-60">
        <i className="fa-regular fa-bell text-4xl mb-4 text-[#A79E96]"></i>
        <p className="text-[#A79E96] text-sm">{t("gelenKutusuPage.notifications.empty")}</p>
      </div>
    ) : !isLoading && activeTab === 'bildirimler' && notifications.length > 0 && (
      <div className="flex flex-col gap-4">
        {notifications.map(notification => {
          const isAppt = notification.type === 'appointment_created';
          let title = notification.title;
          let subtext = notification.message;
          let targetDate = null;
          let docLabel = null;
          let reqNote = null;
          
          if (isAppt && notification.metadata) {
             const m = notification.metadata;
             const when = new Date(m.starts_at).toLocaleString(locale === 'en' ? 'en-US' : (locale === 'de' ? 'de-DE' : 'tr-TR'), { timeZone: m.timezone, weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });
             if (locale === 'en') {
               title = m.calendar_name ? `${m.customer_name} booked an appointment with ${m.calendar_name} on ${when}` : `${m.customer_name} booked an appointment on ${when}`;
             } else if (locale === 'de') {
               title = m.calendar_name ? `${m.customer_name} hat einen Termin bei ${m.calendar_name} am ${when} gebucht` : `${m.customer_name} hat einen Termin am ${when} gebucht`;
             } else {
               title = appointmentSentence(m.customer_name || t("gelenKutusuPage.alerts.customerFallback"), when, m.calendar_name);
             }
             subtext = '';
             targetDate = m.starts_at ? new Intl.DateTimeFormat('en-CA', { timeZone: m.timezone || 'Europe/Istanbul' }).format(new Date(m.starts_at)) : null;
             docLabel = m.calendar_name;
             reqNote = m.customer_request_raw;
          }
    
          return (
          <div 
            key={notification.id}
            onClick={async () => {
               if (!notification.is_read) {
                 if (notification.is_broadcast) {
                   const { data: { session } } = await supabase.auth.getSession();
                   if (session?.user?.id) await supabase.from('broadcast_reads').upsert({ user_id: session.user.id, broadcast_id: notification.id }, { onConflict: 'user_id, broadcast_id' });
                 } else {
                   const { error } = await supabase.from('notifications').update({ is_read: true }).eq('id', notification.id);
                   if (error) console.error('Okundu işaretleme hatası:', error);
                 }
                 setNotifications(prev => prev.map(n => n.id === notification.id ? { ...n, is_read: true } : n));
                 window.dispatchEvent(new Event('appointment-notifications-changed'));
               }
               if (targetDate) router.push(`/ai-asistan/randevu?date=${targetDate}`);
            }}
            className={`glass flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer ${
              !notification.is_read ? 'border-[#FF7A59] bg-[#FF7A59]/5' : 'border-dark-border bg-dark-card'
            }`}
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 border border-white/10 shrink-0">
              <i className={`fa-solid fa-bell text-lg ${!notification.is_read ? 'text-[#FF7A59]' : 'text-[#A79E96]'}`}></i>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <h4 className={`text-sm leading-relaxed ${!notification.is_read ? 'font-bold text-white' : 'font-medium text-dark-muted'}`}>
                  {title}
                </h4>
                <span className="text-xs text-dark-muted shrink-0 ml-4 mt-1">
                  {new Date(notification.created_at).toLocaleDateString(locale, { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              {subtext ? <p className="text-sm text-dark-muted leading-relaxed mt-1">{subtext}</p> : null}
              {docLabel && <p className="text-xs text-[#00F2FE] mt-2 font-medium"><i className="fa-solid fa-user-doctor mr-1"></i> {docLabel}</p>}
              {reqNote && <p className="text-xs text-dark-muted mt-1 italic">📝 {reqNote}</p>}
            </div>
          </div>
        )})}
      </div>
    )
  );
}
