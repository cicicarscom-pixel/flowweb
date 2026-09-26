let c = Deno.readTextFileSync('C:/Users/roman/flowweb/src/app/(dashboard)/ai-asistan/randevu/RandevuClient.tsx');

c = c.replace(
  "import { getAppointmentsByDate, getAvailableSlots, createAppointment } from '@/actions/appointments';",
  "import { getAppointmentsByDate, getAvailableSlots, createAppointment } from '@/actions/appointments';\nimport { dateFromYmd } from '@/lib/dates';"
);

c = c.replace(
  "const [currentDate, setCurrentDate] = useState(() => new Date(initialDateFromParam()));",
  "const [currentDate, setCurrentDate] = useState(() => dateFromYmd(initialDateFromParam()));"
);

c = c.replace(
  "setCurrentDate(new Date(param));",
  "setCurrentDate(dateFromYmd(param));"
);

Deno.writeTextFileSync('C:/Users/roman/flowweb/src/app/(dashboard)/ai-asistan/randevu/RandevuClient.tsx', c);
console.log("Updated RandevuClient.tsx");
