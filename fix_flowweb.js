const fs = require("fs"); 
let c = fs.readFileSync("src/actions/appointments.ts", "utf8"); 
c = c.replace(/const LOCAL_RE = \/\^[\s\S]*?revalidatePath\(\x27\/ai-asistan\/randevu\x27\);\n  return \{ data, error: null \};\n\}/, `export async function createAppointment(input: {
  customerName?: string
  customerPhone: string
  serviceId?: string | null
  calendarId?: string | null
  date: string // format: YYYY-MM-DDTHH:mm
  note?: string 
}) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return { data: null, error: "Unauthorized" };

  const { data, error } = await supabase.rpc("create_manual_appointment", {
    p_local_start: input.date.substring(0, 16),
    p_customer_name: input.customerName || null,
    p_customer_phone: input.customerPhone,
    p_calendar_id: input.calendarId || null,
    p_service_id: input.serviceId || null,
    p_request_raw: input.note || null,
    p_source: "web"
  });

  if (error) {
    return { data: null, error: error.message };
  }

  switch (data.status) {
    case "SUCCESS":
      revalidatePath("/ai-asistan/randevu");
      return { data, error: null };
    case "SLOT_TAKEN": return { data: null, error: "Bu saat dolu" };
    case "CUSTOMER_TIME_CONFLICT": return { data: null, error: "Bu müşterinin bu saatte başka randevusu var" };
    case "CALENDAR_REQUIRED": return { data: null, error: "Lütfen bir doktor/takvim seçin" };
    case "INVALID_LOCAL_TIME": return { data: null, error: "Bu saat, saat değişikliği nedeniyle mevcut değil" };
    case "CUSTOMER_REQUIRED": return { data: null, error: "Müşteri adı ve telefonu zorunlu" };
    default: return { data: null, error: "Randevu oluşturulamadı (" + data.status + ")" };
  }
}`);
fs.writeFileSync("src/actions/appointments.ts", c, "utf8"); 
console.log("OK");
