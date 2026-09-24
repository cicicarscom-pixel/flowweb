import * as fs from 'fs';

let content = fs.readFileSync('src/app/(dashboard)/ai-asistan/randevu/RandevuClient.tsx', 'utf8');

const regex = /<button\s*onClick=\{async \(\) => \{\s*const name = prompt\("Yeni Takvim Adı[^"]*"\);[\s\S]*?<\/button>/;

const newButtons = `<button
                onClick={() => setIsManageModalOpen(true)}
                style={{
                  padding: "8px 16px", borderRadius: 99, fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.2s",
                  background: "rgba(239, 68, 68, 0.15)", color: "#EF4444", border: "1px dashed #EF4444"
                }}
              >
                Düzenle
              </button>
              <button
                onClick={() => {
                  setPromptConfig({
                    visible: true,
                    title: "Yeni Takvim",
                    placeholder: "Yeni takvim/personel adını girin",
                    value: "",
                    onSave: async (name: string) => {
                      if (name && name.trim()) {
                        const { createCalendar, getCalendars } = await import("@/actions/calendars");
                        await createCalendar(name.trim());
                        const updated = await getCalendars();
                        setCalendars(updated);
                      }
                    }
                  });
                }}
                style={{
                  padding: "8px 16px", borderRadius: 99, fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.2s",
                  background: "transparent", color: "#00c6ff", border: "1px dashed #00c6ff"
                }}
              >
                + Yeni Ekle
              </button>`;

if (regex.test(content)) {
    content = content.replace(regex, newButtons);
    fs.writeFileSync('src/app/(dashboard)/ai-asistan/randevu/RandevuClient.tsx', content, 'utf8');
    console.log("Replaced button successfully!");
} else {
    console.log("Could not match regex");
}
