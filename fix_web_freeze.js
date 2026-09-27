const fs = require('fs');
let c = fs.readFileSync('C:/Users/roman/flowweb/src/app/(dashboard)/ai-asistan/randevu/RandevuClient.tsx', 'utf8');

c = c.replace(
  `  useEffect(() => {
    const d = dateFromYmd(selectedDate);
    if (d.getMonth() !== currentDate.getMonth() || d.getFullYear() !== currentDate.getFullYear()) {
      setCurrentDate(d);
    }
  }, [selectedDate, currentDate]);`,
  `  useEffect(() => {
    const d = dateFromYmd(selectedDate);
    setCurrentDate(prev => {
      if (d.getMonth() !== prev.getMonth() || d.getFullYear() !== prev.getFullYear()) {
        return d;
      }
      return prev;
    });
  }, [selectedDate]);`
);

fs.writeFileSync('C:/Users/roman/flowweb/src/app/(dashboard)/ai-asistan/randevu/RandevuClient.tsx', c, 'utf8');
