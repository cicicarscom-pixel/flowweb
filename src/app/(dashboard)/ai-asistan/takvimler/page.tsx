import { getCalendars } from "@/actions/calendars";
import TakvimAyarlariClient from "./TakvimAyarlariClient";
import { createClient } from "@/lib/supabase/server";
import { getBusinessServices } from "@/actions/businessServices";

export const dynamic = "force-dynamic";

export default async function TakvimlerPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) return <div>Unauthorized</div>;

  const { data: org } = await supabase
    .from("organizations")
    .select("multi_calendar_enabled")
    .eq("owner_id", session.user.id)
    .single();

  const isEnabled = org?.multi_calendar_enabled || false;

  const calendars = await getCalendars();
  const servicesResponse = await getBusinessServices(session.user.id);
  const services = servicesResponse || [];

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] -z-10" />
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 drop-shadow-md">
          Takvimler ve Personeller
        </h1>
        <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-2xl">
          İşletmenizdeki birden fazla personelin veya kaynağın çalışma saatlerini ve verdikleri hizmetleri buradan bağımsız takvimler halinde yönetebilirsiniz.
        </p>

        <TakvimAyarlariClient 
          initialCalendars={calendars} 
          services={services} 
          initialEnabled={isEnabled} 
        />
      </div>
    </div>
  );
}
