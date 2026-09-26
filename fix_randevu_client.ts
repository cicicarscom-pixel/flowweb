let c = Deno.readTextFileSync('C:/Users/roman/flowweb/src/app/(dashboard)/ai-asistan/randevu/RandevuClient.tsx');

// The faulty code has:
//       const initialDateFromParam = () => {
//       const p = searchParams.get("date");
// ...
//     const searchParams = useSearchParams();

const oldCode = `    const t = useTranslations();
    const supabase = createClient();
      const initialDateFromParam = () => {
      const p = searchParams.get("date");
      if (p && /^\\d{4}-\\d{2}-\\d{2}$/.test(p)) {
        return p;
      }
      return today;
    };
    
    const [selectedDate, setSelectedDate] = useState(initialDateFromParam);
    const [currentDate, setCurrentDate] = useState(() => new Date(initialDateFromParam()));
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [appointments, setAppointments] = useState(initialAppointments);
      const [availableSlots, setAvailableSlots] = useState<string[]>([]);
    const searchParams = useSearchParams();`;

const newCode = `    const t = useTranslations();
    const supabase = createClient();
    const searchParams = useSearchParams();
    
    const initialDateFromParam = () => {
      const p = searchParams.get("date");
      if (p && /^\\d{4}-\\d{2}-\\d{2}$/.test(p)) {
        return p;
      }
      return today;
    };
    
    const [selectedDate, setSelectedDate] = useState(initialDateFromParam);
    const [currentDate, setCurrentDate] = useState(() => new Date(initialDateFromParam()));
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [appointments, setAppointments] = useState(initialAppointments);
    const [availableSlots, setAvailableSlots] = useState<string[]>([]);`;

c = c.replace(oldCode, newCode);

Deno.writeTextFileSync('C:/Users/roman/flowweb/src/app/(dashboard)/ai-asistan/randevu/RandevuClient.tsx', c);
console.log("Updated RandevuClient.tsx");
