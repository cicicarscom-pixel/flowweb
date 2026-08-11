const fs = require('fs');

const data = {
  1: { income: [["ABC Ltd. Şti.", "+1.250"], ["XYZ A.Ş.", "+850"], ["Demo Ticaret", "+1.000"], ["Techno Yazılım", "+2.400"]], expense: [["Ofis Kırtasiye", "-320"], ["Enerji A.Ş.", "-1.150"], ["İnternet Sağlayıcı", "-150"], ["Akaryakıt Ltd.", "-780"]] },
  2: { income: [["Global Danışmanlık", "+3.500"], ["Mavi Tekstil", "+1.200"], ["Yıldız Gıda", "+900"], ["Beta Yazılım", "+2.100"]], expense: [["Kargo Firması", "-450"], ["Ofis Kırtasiye", "-210"], ["Personel Yemek", "-600"], ["Akaryakıt Ltd.", "-950"]] },
  3: { income: [["Delta Enerji", "+2.000"], ["Omega İnşaat", "+4.750"], ["Smart Medya", "+950"], ["Lider Otomotiv", "+1.300"]], expense: [["Enerji A.Ş.", "-1.200"], ["Kargo Firması", "-380"], ["Ofis Kırtasiye", "-160"], ["Yazılım Lisansı", "-920"]] },
  4: { income: [["ABC Ltd. Şti.", "+1.100"], ["Epsilon Tarım", "+800"], ["Data Sistem", "+1.450"], ["Netsoft", "+950"]], expense: [["Personel Maaş", "-25.000"], ["SGK Ödemesi", "-4.500"], ["Vergi Dairesi", "-3.200"], ["Kira Ödemesi", "-6.000"]] },
  5: { income: [["Mavi Tekstil", "+1.600"], ["Global Danışmanlık", "+2.500"]], expense: [["Akaryakıt Ltd.", "-1.100"]] },
  6: { income: [["Omega İnşaat", "+3.250"]], expense: [["Enerji A.Ş.", "-1.300"]] },
  7: { income: [["XYZ A.Ş.", "+1.900"]], expense: [["Ofis Kırtasiye", "-260"]] }
};

let content = '        {/* Calendar Grid */}\\n';
content += '        <div className="flex-1 border border-t-0 border-surface-bright rounded-b overflow-x-auto" style={{ display: \\'grid\\', gridTemplateColumns: \\'repeat(7, 1fr)\\', gap: \\'1px\\', backgroundColor: \\'#39393b\\', minWidth: \\'1200px\\', gridAutoRows: \\'minmax(120px, auto)\\' }}>\\n';

for (let i = 1; i <= 30; i++) {
  content += '          {/* Day ' + i + ' */}\\n';
  content += '          <div className="bg-[#1a1a1c] min-h-[120px] relative p-2 pt-8 overflow-y-auto calendar-cell-scroll space-y-1.5 flex flex-col">\\n';
  content += '            <div className="absolute top-2 right-3 z-10 text-xs font-bold text-gray-300">' + i + '</div>\\n';
  
  if (data[i]) {
    for (const [name, amount] of data[i].income) {
      content += '            <div className="flex justify-between items-center rounded border border-green-900/60 bg-green-950/20 px-1.5 py-1">\\n';
      content += '              <span className="truncate pr-2 text-[10px] text-white font-medium">' + name + '</span>\\n';
      content += '              <span className="shrink-0 text-[10px] text-green-500 font-bold">' + amount + '</span>\\n';
      content += '            </div>\\n';
    }
    for (const [name, amount] of data[i].expense) {
      content += '            <div className="flex justify-between items-center rounded border border-rose-900/60 bg-rose-950/20 px-1.5 py-1">\\n';
      content += '              <span className="truncate pr-2 text-[10px] text-white font-medium">' + name + '</span>\\n';
      content += '              <span className="shrink-0 text-[10px] text-rose-300 font-bold">' + amount + '</span>\\n';
      content += '            </div>\\n';
    }
  }
  content += '          </div>\\n';
}

content += '          {/* Fillers for empty grid slots */}\\n';
content += '          {Array.from({ length: 5 }).map((_, i) => (\\n';
content += '            <div key={`empty-${i}`} className="bg-[#1a1a1c] opacity-30 pointer-events-none"></div>\\n';
content += '          ))}\\n';
content += '        </div>\\n';

const targetFile = 'c:\\\\Users\\\\roman\\\\flowweb\\\\src\\\\app\\\\(dashboard)\\\\ai-muhasebe\\\\odeme-takvimi\\\\page.tsx';
let fileContent = fs.readFileSync(targetFile, 'utf8');

const startIdx = fileContent.indexOf('        {/* Calendar Headers (Gelir / Gider Legend) */}');
const endIdx = fileContent.indexOf('        </div>\\r\\n      </div>\\r\\n    </div>');

if (startIdx !== -1 && endIdx !== -1) {
    const newFileContent = fileContent.substring(0, startIdx) + content.trimStart() + fileContent.substring(endIdx);
    fs.writeFileSync(targetFile, newFileContent, 'utf8');
    console.log("Updated odeme-takvimi successfully.");
} else {
    console.log("Could not find start or end index.");
}
