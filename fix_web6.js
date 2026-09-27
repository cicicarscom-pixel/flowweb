const fs = require('fs');
let c = fs.readFileSync('C:/Users/roman/flowweb/src/app/(dashboard)/ai-asistan/randevu/RandevuClient.tsx', 'utf8');

c = c.replace(
  `  useEffect(() => {
    const param = searchParams.get("date");
    if (!param || !/^\\d{4}-\\d{2}-\\d{2}$/.test(param)) return;
    setCurrentDate(dateFromYmd(param));
    setSelectedDate(param);
  }, [searchParams]);`,
  `  useEffect(() => {
    const param = searchParams.get("date");
    if (!param || !/^\\d{4}-\\d{2}-\\d{2}$/.test(param)) return;
    setCurrentDate(dateFromYmd(param));
    setSelectedDate(param);
  }, [searchParams]);

  useEffect(() => {
    const d = dateFromYmd(selectedDate);
    if (d.getMonth() !== currentDate.getMonth() || d.getFullYear() !== currentDate.getFullYear()) {
      setCurrentDate(d);
    }
  }, [selectedDate, currentDate]);`
);

fs.writeFileSync('C:/Users/roman/flowweb/src/app/(dashboard)/ai-asistan/randevu/RandevuClient.tsx', c, 'utf8');
