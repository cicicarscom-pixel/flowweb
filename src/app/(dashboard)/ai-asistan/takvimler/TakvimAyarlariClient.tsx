"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Calendar, createCalendar, deleteCalendar, updateCalendar, setCalendarServices } from "@/actions/calendars";

export default function TakvimAyarlariClient({ initialCalendars, services, initialEnabled }: { initialCalendars: Calendar[], services: any[], initialEnabled: boolean }) {
  const [calendars, setCalendars] = useState<Calendar[]>(initialCalendars);
  const [isEnabled, setIsEnabled] = useState(initialEnabled);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    setCalendars(initialCalendars);
  }, [initialCalendars]);

  const toggleMultiCalendar = async () => {
    setLoading(true);
    const newVal = !isEnabled;
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      await supabase.from("organizations").update({ multi_calendar_enabled: newVal }).eq("owner_id", session.user.id);
      setIsEnabled(newVal);
      if (newVal && calendars.length === 0) {
        await createCalendar("Genel Takvim");
        router.refresh();
      }
    }
    setLoading(false);
  };

  const handleCreate = async () => {
    const name = prompt("Takvim/Personel Adı:");
    if (!name) return;
    setLoading(true);
    await createCalendar(name);
    router.refresh();
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu takvimi silmek istediğinize emin misiniz?")) return;
    setLoading(true);
    await deleteCalendar(id);
    router.refresh();
    setLoading(false);
  };

  const toggleService = async (calendarId: string, serviceId: string, currentServices: string[]) => {
    setLoading(true);
    let newServices = [...currentServices];
    if (newServices.includes(serviceId)) {
      newServices = newServices.filter(id => id !== serviceId);
    } else {
      newServices.push(serviceId);
    }
    await setCalendarServices(calendarId, newServices);
    router.refresh();
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-4 bg-[#1e293b] rounded-xl border border-gray-800">
        <div>
          <h2 className="text-xl font-bold text-white">Çoklu Takvim Modu</h2>
          <p className="text-gray-400 text-sm">Bu modu açarak birden fazla personel veya kaynak için ayrı takvimler oluşturabilirsiniz.</p>
        </div>
        <button 
          onClick={toggleMultiCalendar}
          disabled={loading}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${isEnabled ? "bg-emerald-500 text-white" : "bg-gray-700 text-gray-300"}`}
        >
          {isEnabled ? "Açık" : "Kapalı"}
        </button>
      </div>

      {isEnabled && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button 
              onClick={handleCreate}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
            >
              + Yeni Takvim Ekle
            </button>
          </div>

          <div className="grid gap-4">
            {calendars.map(cal => (
              <div key={cal.id} className="p-4 bg-[#1e293b]/50 border border-gray-700 rounded-xl space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-white">{cal.name}</h3>
                  <button onClick={() => handleDelete(cal.id)} className="text-red-400 hover:text-red-300 text-sm">Sil</button>
                </div>
                
                <div className="pt-2 border-t border-gray-800">
                  <p className="text-sm text-gray-400 mb-3">Bu takvimin verebildiği hizmetler:</p>
                  <div className="flex flex-wrap gap-2">
                    {services.map(srv => {
                      const isActive = (cal.services || []).includes(srv.id);
                      return (
                        <button
                          key={srv.id}
                          onClick={() => toggleService(cal.id, srv.id, cal.services || [])}
                          disabled={loading}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                            isActive 
                              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/50" 
                              : "bg-gray-800 text-gray-400 border-gray-700 hover:border-gray-500"
                          }`}
                        >
                          {srv.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
            {calendars.length === 0 && (
              <div className="text-center p-8 text-gray-500">Henüz takvim eklenmemiş.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
