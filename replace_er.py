import sys
content = open('src/app/(dashboard)/analiz/page.tsx', 'r', encoding='utf-8').read()
new_text = '''                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                   {(() => {
                     let videoEr = "0.0";
                     let imageEr = "0.0";
                     if (zernioData.postAnalytics) {
                       let vEng=0, vVws=0, iEng=0, iVws=0;
                       zernioData.postAnalytics.forEach((p:any) => {
                         const m = p.analytics || p.metrics || p || {};
                         const eng = (m.likes||0) + (m.comments||0) + (m.shares||0) + (m.saves||0);
                         const vws = (m.impressions||m.views||0);
                         const isVid = (p.media_urls && p.media_urls.some((u:string) => u.match(/\.(mp4|webm|mov|blob)(\?.*)?$/i) || u.includes('blob')));
                         if(isVid) { vEng+=eng; vVws+=vws; } else { iEng+=eng; iVws+=vws; }
                       });
                       if (vVws>0) videoEr = ((vEng/vVws)*100).toFixed(1);
                       if (iVws>0) imageEr = ((iEng/iVws)*100).toFixed(1);
                     }
                     return (
                       <>
                         <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                           <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                             <div style={{ width: 12, height: 12, borderRadius: "50%", background: '#FF7A59' }} />
                             <span style={{ color: "#F6F1EC", fontSize: 14 }}>Video <span style={{ color: "var(--text-secondary)", fontSize: 11, marginLeft: 4 }}>({videoEr}% ER)</span></span>
                           </div>
                           <span style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>{zernioData.formatBreakdown.video}</span>
                         </div>
                         <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                           <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                             <div style={{ width: 12, height: 12, borderRadius: "50%", background: '#C2478D' }} />
                             <span style={{ color: "#F6F1EC", fontSize: 14 }}>Görsel <span style={{ color: "var(--text-secondary)", fontSize: 11, marginLeft: 4 }}>({imageEr}% ER)</span></span>
                           </div>
                           <span style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>{zernioData.formatBreakdown.image}</span>
                         </div>
                       </>
                     );
                   })()}
                </div>'''

old_text = '''                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                   <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                     <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                       <div style={{ width: 12, height: 12, borderRadius: "50%", background: '#FF7A59' }} />
                       <span style={{ color: "#F6F1EC", fontSize: 14 }}>Video</span>
                     </div>
                     <span style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>{zernioData.formatBreakdown.video}</span>
                   </div>
                   <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                     <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                       <div style={{ width: 12, height: 12, borderRadius: "50%", background: '#C2478D' }} />
                       <span style={{ color: "#F6F1EC", fontSize: 14 }}>Görsel</span>
                     </div>
                     <span style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>{zernioData.formatBreakdown.image}</span>
                   </div>
                </div>'''

if old_text in content:
    content = content.replace(old_text, new_text)
    open('src/app/(dashboard)/analiz/page.tsx', 'w', encoding='utf-8').write(content)
    print('Replaced')
else:
    print('Not found')
