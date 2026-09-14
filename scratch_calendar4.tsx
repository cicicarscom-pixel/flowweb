commit 494618bf36293a4bb7e7a6f1030384b8c85f6ccb
Author: Workigom AI <ai@workigom.com>
Date:   Wed Aug 12 01:05:51 2026 +0300

    Update odeme takvimi UI to match new calendar design

diff --git a/src/app/(dashboard)/ai-muhasebe/odeme-takvimi/page.tsx b/src/app/(dashboard)/ai-muhasebe/odeme-takvimi/page.tsx
index 6cfb818..8be6ca2 100644
--- a/src/app/(dashboard)/ai-muhasebe/odeme-takvimi/page.tsx
+++ b/src/app/(dashboard)/ai-muhasebe/odeme-takvimi/page.tsx
@@ -44,134 +44,46 @@ export default function OdemeTakvimiPage() {
           .calendar-cell-scroll::-webkit-scrollbar-thumb { background-color: #39393b; border-radius: 4px; }
         `}</style>
 
-        {/* Calendar Headers (Gelir / Gider Legend) */}
-        <div className="grid grid-cols-2 bg-surface-bright border border-surface-bright rounded-t overflow-hidden shrink-0" style={{ minWidth: '2362px' }}>
-          <div className="bg-[#1a1a1c] p-2 text-[10px] font-bold text-income uppercase tracking-widest text-center border-r border-surface-bright">
-            GELİR (ALACAK)
-          </div>
-          <div className="bg-[#1a1a1c] p-2 text-[10px] font-bold text-expense uppercase tracking-widest text-center">
-            GİDER (BORÇ)
-          </div>
-        </div>
-
         {/* Calendar Grid */}
-        <div className="flex-1 border border-t-0 border-surface-bright rounded-b overflow-x-auto" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px', backgroundColor: '#39393b', minWidth: '2362px', gridAutoRows: 'minmax(120px, auto)' }}>
+        <div className="flex-1 border border-t-0 border-surface-bright rounded-b overflow-x-auto" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px', backgroundColor: '#39393b', minWidth: '1200px', gridAutoRows: 'minmax(120px, auto)' }}>
           {/* Day 1 */}
-          <div className="bg-[#1a1a1c] grid grid-cols-2 min-h-0 relative">
-            <div className="absolute top-1 left-2 z-10 text-[10px] font-bold text-on-surface">1</div>
-            {/* Income Column */}
-            <div className="p-2 pt-6 border-r border-surface-bright overflow-y-auto calendar-cell-scroll space-y-1">
-              <div className="flex justify-between text-income"><span className="truncate pr-1 text-[9px]">ABC Ltd. Şti.</span><span className="shrink-0">+1.250</span></div>
-              <div className="flex justify-between text-income"><span className="truncate pr-1 text-[9px]">XYZ A.Ş.</span><span className="shrink-0">+850</span></div>
-              <div className="flex justify-between text-income"><span className="truncate pr-1 text-[9px]">Demo Ticaret</span><span className="shrink-0">+1.000</span></div>
-              <div className="flex justify-between text-income"><span className="truncate pr-1 text-[9px]">Techno Yazılım</span><span className="shrink-0">+2.400</span></div>
-            </div>
-            {/* Expense Column */}
-            <div className="p-2 pt-6 overflow-y-auto calendar-cell-scroll space-y-1">
-              <div className="flex justify-between text-expense"><span className="truncate pr-1 text-[9px]">Ofis Kırtasiye</span><span className="shrink-0">-320</span></div>
-              <div className="flex justify-between text-expense"><span className="truncate pr-1 text-[9px]">Enerji A.Ş.</span><span className="shrink-0">-1.150</span></div>
-              <div className="flex justify-between text-expense"><span className="truncate pr-1 text-[9px]">İnternet Sağlayıcı</span><span className="shrink-0">-150</span></div>
-              <div className="flex justify-between text-expense"><span className="truncate pr-1 text-[9px]">Akaryakıt Ltd.</span><span className="shrink-0">-780</span></div>
-            </div>
+          <div className="bg-[#1a1a1c] min-h-[120px] relative p-2 pt-8 overflow-y-auto calendar-cell-scroll space-y-1.5 flex flex-col">
+            <div className="absolute top-2 right-3 z-10 text-xs font-bold text-gray-300">1</div>
           </div>
           
           {/* Day 2 */}
-          <div className="bg-[#1a1a1c] grid grid-cols-2 min-h-0 relative">
-            <div className="absolute top-1 left-2 z-10 text-[10px] font-bold text-on-surface">2</div>
-            <div className="p-2 pt-6 border-r border-surface-bright overflow-y-auto calendar-cell-scroll space-y-1">
-              <div className="flex justify-between text-income"><span className="truncate pr-1 text-[9px]">Global Danışmanlık</span><span className="shrink-0">+3.500</span></div>
-              <div className="flex justify-between text-income"><span className="truncate pr-1 text-[9px]">Mavi Tekstil</span><span className="shrink-0">+1.200</span></div>
-              <div className="flex justify-between text-income"><span className="truncate pr-1 text-[9px]">Yıldız Gıda</span><span className="shrink-0">+900</span></div>
-              <div className="flex justify-between text-income"><span className="truncate pr-1 text-[9px]">Beta Yazılım</span><span className="shrink-0">+2.100</span></div>
-            </div>
-            <div className="p-2 pt-6 overflow-y-auto calendar-cell-scroll space-y-1">
-              <div className="flex justify-between text-expense"><span className="truncate pr-1 text-[9px]">Kargo Firması</span><span className="shrink-0">-450</span></div>
-              <div className="flex justify-between text-expense"><span className="truncate pr-1 text-[9px]">Ofis Kırtasiye</span><span className="shrink-0">-210</span></div>
-              <div className="flex justify-between text-expense"><span className="truncate pr-1 text-[9px]">Personel Yemek</span><span className="shrink-0">-600</span></div>
-              <div className="flex justify-between text-expense"><span className="truncate pr-1 text-[9px]">Akaryakıt Ltd.</span><span className="shrink-0">-950</span></div>
+          <div className="bg-[#1a1a1c] min-h-[120px] relative p-2 pt-8 overflow-y-auto calendar-cell-scroll space-y-1.5 flex flex-col">
+            <div className="absolute top-2 right-3 z-10 text-xs font-bold text-gray-300">2</div>
+            <div className="flex justify-between items-center rounded border border-[#003B15]/60 bg-[#00260e]/50 px-1.5 py-1">
+              <span className="truncate pr-2 text-[10px] text-white font-medium">Delta E...</span>
+              <span className="shrink-0 text-[10px] text-green-500 font-bold">+2,500</span>
             </div>
           </div>
 
           {/* Day 3 */}
-          <div className="bg-[#1a1a1c] grid grid-cols-2 min-h-0 relative">
-            <div className="absolute top-1 left-2 z-10 text-[10px] font-bold text-on-surface">3</div>
-            <div className="p-2 pt-6 border-r border-surface-bright overflow-y-auto calendar-cell-scroll space-y-1">
-              <div className="flex justify-between text-income"><span className="truncate pr-1 text-[9px]">Delta Enerji</span><span className="shrink-0">+2.000</span></div>
-              <div className="flex justify-between text-income"><span className="truncate pr-1 text-[9px]">Omega İnşaat</span><span className="shrink-0">+4.750</span></div>
-              <div className="flex justify-between text-income"><span className="truncate pr-1 text-[9px]">Smart Medya</span><span className="shrink-0">+950</span></div>
-              <div className="flex justify-between text-income"><span className="truncate pr-1 text-[9px]">Lider Otomotiv</span><span className="shrink-0">+1.300</span></div>
-            </div>
-            <div className="p-2 pt-6 overflow-y-auto calendar-cell-scroll space-y-1">
-              <div className="flex justify-between text-expense"><span className="truncate pr-1 text-[9px]">Enerji A.Ş.</span><span className="shrink-0">-1.200</span></div>
-              <div className="flex justify-between text-expense"><span className="truncate pr-1 text-[9px]">Kargo Firması</span><span className="shrink-0">-380</span></div>
-              <div className="flex justify-between text-expense"><span className="truncate pr-1 text-[9px]">Ofis Kırtasiye</span><span className="shrink-0">-160</span></div>
-              <div className="flex justify-between text-expense"><span className="truncate pr-1 text-[9px]">Yazılım Lisansı</span><span className="shrink-0">-920</span></div>
-            </div>
+          <div className="bg-[#1a1a1c] min-h-[120px] relative p-2 pt-8 overflow-y-auto calendar-cell-scroll space-y-1.5 flex flex-col">
+            <div className="absolute top-2 right-3 z-10 text-xs font-bold text-gray-300">3</div>
           </div>
 
           {/* Day 4 */}
-          <div className="bg-[#1a1a1c] grid grid-cols-2 min-h-0 relative">
-            <div className="absolute top-1 left-2 z-10 text-[10px] font-bold text-on-surface">4</div>
-            <div className="p-2 pt-6 border-r border-surface-bright overflow-y-auto calendar-cell-scroll space-y-1">
-              <div className="flex justify-between text-income"><span className="truncate pr-1 text-[9px]">ABC Ltd. Şti.</span><span className="shrink-0">+1.100</span></div>
-              <div className="flex justify-between text-income"><span className="truncate pr-1 text-[9px]">Epsilon Tarım</span><span className="shrink-0">+800</span></div>
-              <div className="flex justify-between text-income"><span className="truncate pr-1 text-[9px]">Data Sistem</span><span className="shrink-0">+1.450</span></div>
-              <div className="flex justify-between text-income"><span className="truncate pr-1 text-[9px]">Netsoft</span><span className="shrink-0">+950</span></div>
-            </div>
-            <div className="p-2 pt-6 overflow-y-auto calendar-cell-scroll space-y-1">
-              <div className="flex justify-between text-expense"><span className="truncate pr-1 text-[9px]">Personel Maaş</span><span className="shrink-0">-25.000</span></div>
-              <div className="flex justify-between text-expense"><span className="truncate pr-1 text-[9px]">SGK Ödemesi</span><span className="shrink-0">-4.500</span></div>
-              <div className="flex justify-between text-expense"><span className="truncate pr-1 text-[9px]">Vergi Dairesi</span><span className="shrink-0">-3.200</span></div>
-              <div className="flex justify-between text-expense"><span className="truncate pr-1 text-[9px]">Kira Ödemesi</span><span className="shrink-0">-6.000</span></div>
-            </div>
-          </div>
-
-          {/* Day 5 */}
-          <div className="bg-[#1a1a1c] grid grid-cols-2 min-h-0 relative">
-            <div className="absolute top-1 left-2 z-10 text-[10px] font-bold text-on-surface">5</div>
-            <div className="p-2 pt-6 border-r border-surface-bright overflow-y-auto calendar-cell-scroll space-y-1">
-              <div className="flex justify-between text-income"><span className="truncate pr-1 text-[9px]">Mavi Tekstil</span><span className="shrink-0">+1.600</span></div>
-              <div className="flex justify-between text-income"><span className="truncate pr-1 text-[9px]">Global Danışmanlık</span><span className="shrink-0">+2.500</span></div>
-            </div>
-            <div className="p-2 pt-6 overflow-y-auto calendar-cell-scroll space-y-1">
-              <div className="flex justify-between text-expense"><span className="truncate pr-1 text-[9px]">Akaryakıt Ltd.</span><span className="shrink-0">-1.100</span></div>
-            </div>
-          </div>
-
-          {/* Day 6 */}
-          <div className="bg-[#1a1a1c] grid grid-cols-2 min-h-0 relative">
-            <div className="absolute top-1 left-2 z-10 text-[10px] font-bold text-on-surface">6</div>
-            <div className="p-2 pt-6 border-r border-surface-bright overflow-y-auto calendar-cell-scroll space-y-1">
-              <div className="flex justify-between text-income"><span className="truncate pr-1 text-[9px]">Omega İnşaat</span><span className="shrink-0">+3.250</span></div>
-            </div>
-            <div className="p-2 pt-6 overflow-y-auto calendar-cell-scroll space-y-1">
-              <div className="flex justify-between text-expense"><span className="truncate pr-1 text-[9px]">Enerji A.Ş.</span><span className="shrink-0">-1.300</span></div>
-            </div>
-          </div>
-
-          {/* Day 7 */}
-          <div className="bg-[#1a1a1c] grid grid-cols-2 min-h-0 relative">
-            <div className="absolute top-1 left-2 z-10 text-[10px] font-bold text-on-surface">7</div>
-            <div className="p-2 pt-6 border-r border-surface-bright overflow-y-auto calendar-cell-scroll space-y-1">
-              <div className="flex justify-between text-income"><span className="truncate pr-1 text-[9px]">XYZ A.Ş.</span><span className="shrink-0">+1.900</span></div>
-            </div>
-            <div className="p-2 pt-6 overflow-y-auto calendar-cell-scroll space-y-1">
-              <div className="flex justify-between text-expense"><span className="truncate pr-1 text-[9px]">Ofis Kırtasiye</span><span className="shrink-0">-260</span></div>
+          <div className="bg-[#1a1a1c] min-h-[120px] relative p-2 pt-8 overflow-y-auto calendar-cell-scroll space-y-1.5 flex flex-col">
+            <div className="absolute top-2 right-3 z-10 text-xs font-bold text-gray-300">4</div>
+            <div className="flex justify-between items-center rounded border border-rose-900/60 bg-rose-950/40 px-1.5 py-1">
+              <span className="truncate pr-2 text-[10px] text-white font-medium">Office ...</span>
+              <span className="shrink-0 text-[10px] text-[#FFB4AB] font-bold">-5,000</span>
             </div>
           </div>
 
-          {/* Repeated Structure for Rows 2-5 */}
-          {Array.from({ length: 23 }, (_, i) => i + 8).map(day => (
-            <div key={day} className="bg-[#1a1a1c] grid grid-cols-2 min-h-0 relative">
-              <div className="absolute top-1 left-2 z-10 text-[10px] font-bold text-on-surface">{day}</div>
-              <div className="border-r border-surface-bright"></div>
-              <div></div>
+          {/* Fill the rest of the days to show the layout */}
+          {Array.from({ length: 26 }, (_, i) => i + 5).map(day => (
+            <div key={day} className="bg-[#1a1a1c] min-h-[120px] relative p-2 pt-8 overflow-y-auto calendar-cell-scroll space-y-1.5 flex flex-col">
+              <div className="absolute top-2 right-3 z-10 text-xs font-bold text-gray-300">{day}</div>
             </div>
           ))}
 
           {/* Fillers for empty grid slots */}
           {Array.from({ length: 5 }).map((_, i) => (
-            <div key={`empty-${i}`} className="bg-[#1a1a1c] opacity-30 pointer-events-none"></div>
+            <div key={`empty-${i}`} className="bg-[#1a1a1c] opacity-30 pointer-events-none min-h-[120px]"></div>
           ))}
         </div>
       </div>
