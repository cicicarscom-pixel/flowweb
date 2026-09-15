const fs = require('fs');

let content = fs.readFileSync('src/app/(dashboard)/analiz/page.tsx', 'utf8');

// PHASE 1
content = content.replace(
    /const sortedPosts = \[\.\.\.zernioData\.postAnalytics\]\.slice\(0, 10\);/,
    `const sortedPosts = [...zernioData.postAnalytics].sort((a: any, b: any) => {
      const mA = a.analytics || a.metrics || a || {};
      const mB = b.analytics || b.metrics || b || {};
      const totalA = (mA.likes || 0) + (mA.comments || 0) + (mA.shares || 0) + (mA.impressions || mA.views || 0);
      const totalB = (mB.likes || 0) + (mB.comments || 0) + (mB.shares || 0) + (mB.impressions || mB.views || 0);
      return totalB - totalA;
    }).slice(0, 10);`
);

content = content.replace(
    /const metrics = post\.metrics \|\| post \|\| \{\};/g,
    `const metrics = post.analytics || post.metrics || post || {};`
);

// PHASE 2
content = content.replace(
    /<div style=\{\{ height: 300, width: "100%" \}\}>\s*<ResponsiveContainer width="100%" height="100%">\s*<BarChart data=\{zernioData\.platformBreakdown\}>[\s\S]*?<\/BarChart>\s*<\/ResponsiveContainer>\s*<\/div>/,
    `<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "24px", height: 300, width: "100%" }}>
             <div style={{ height: "100%" }}>
               <h4 style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 12, textAlign: "center" }}>Gönderi Sayýsý</h4>
               <ResponsiveContainer width="100%" height="90%">
                  <BarChart data={zernioData.platformBreakdown}>
                     <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                     <XAxis dataKey="platform" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 12 }} tickFormatter={(val: any) => val ? val.charAt(0).toUpperCase() + val.slice(1) : ''} axisLine={false} tickLine={false} />
                     <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                     <Tooltip content={<CustomTooltip />} />
                     <Bar dataKey="postCount" name="Gönderi Sayýsý" fill="#FF7A59" radius={[4,4,0,0]} />
                  </BarChart>
               </ResponsiveContainer>
             </div>
             <div style={{ height: "100%" }}>
               <h4 style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 12, textAlign: "center" }}>Beðeni Sayýsý</h4>
               <ResponsiveContainer width="100%" height="90%">
                  <BarChart data={zernioData.platformBreakdown}>
                     <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                     <XAxis dataKey="platform" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 12 }} tickFormatter={(val: any) => val ? val.charAt(0).toUpperCase() + val.slice(1) : ''} axisLine={false} tickLine={false} />
                     <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                     <Tooltip content={<CustomTooltip />} />
                     <Bar dataKey="likes" name="Beðeni Sayýsý" fill="#C2478D" radius={[4,4,0,0]} />
                  </BarChart>
               </ResponsiveContainer>
             </div>
             <div style={{ height: "100%" }}>
               <h4 style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 12, textAlign: "center" }}>Eriþim</h4>
               <ResponsiveContainer width="100%" height="90%">
                  <BarChart data={zernioData.platformBreakdown}>
                     <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                     <XAxis dataKey="platform" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 12 }} tickFormatter={(val: any) => val ? val.charAt(0).toUpperCase() + val.slice(1) : ''} axisLine={false} tickLine={false} />
                     <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                     <Tooltip content={<CustomTooltip />} />
                     <Bar dataKey="reach" name="Eriþim" fill="#22B573" radius={[4,4,0,0]} />
                  </BarChart>
               </ResponsiveContainer>
             </div>
           </div>`
);

// PHASE 3
const renderPostingAnalyticsRegex = /const renderPostingAnalytics = \(\) => \([\s\S]*?<div style=\{\{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24 \}\}>[\s\S]*?<\/div>\s*<\/div>/;
const newStatsRibbon = `const renderPostingAnalytics = () => {
    let avgEngagementRate = "0.00";
    let bestPost: any = null;

    if (zernioData.postAnalytics && zernioData.postAnalytics.length > 0) {
      let totalEng = 0;
      let totalVws = 0;
      const sortedPosts = [...zernioData.postAnalytics].sort((a: any, b: any) => {
        const mA = a.analytics || a.metrics || a || {};
        const mB = b.analytics || b.metrics || b || {};
        const totalA = (mA.likes || 0) + (mA.comments || 0) + (mA.shares || 0) + (mA.impressions || mA.views || 0);
        const totalB = (mB.likes || 0) + (mB.comments || 0) + (mB.shares || 0) + (mB.impressions || mB.views || 0);
        return totalB - totalA;
      });

      sortedPosts.forEach((post: any) => {
         const m = post.analytics || post.metrics || post || {};
         totalEng += (m.likes || 0) + (m.comments || 0) + (m.shares || 0) + (m.saves || 0);
         totalVws += (m.impressions || m.views || 0);
      });
      
      if (totalVws > 0) {
         avgEngagementRate = ((totalEng / totalVws) * 100).toFixed(2);
      }
      
      bestPost = sortedPosts[0];
    }

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 24, paddingBottom: 60 }}>
        {/* Key Metrics Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          
          <div style={{ position: "relative", padding: 2, borderRadius: 18, background: "linear-gradient(135deg, rgba(255,122,89,0.1), rgba(255,122,89,0.5))" }}>
            <div style={{ background: "#17151A", borderRadius: 16, padding: "20px" }}>
              <p style={{ color: "var(--text-secondary)", fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", marginBottom: 8 }}>{t("analizPage.posting.totalPosts")}</p>
              <p style={{ fontSize: 32, fontWeight: 700, color: "#FF7A59", fontFamily: "Outfit, sans-serif" }}>{zernioData.totalPosts || stats.totalPosts || 0}</p>
            </div>
          </div>

          <div style={{ position: "relative", padding: 2, borderRadius: 18, background: "linear-gradient(135deg, rgba(194,71,141,0.1), rgba(194,71,141,0.5))" }}>
            <div style={{ background: "#17151A", borderRadius: 16, padding: "20px" }}>
              <p style={{ color: "var(--text-secondary)", fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", marginBottom: 8 }}>{t("analizPage.posting.totalComments")}</p>
              <p style={{ fontSize: 32, fontWeight: 700, color: "#E8A8CD", fontFamily: "Outfit, sans-serif" }}>{zernioData.totalComments || stats.totalComments || 0}</p>
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 24 }}>
          <div className="glass" style={{ borderRadius: 16, padding: "20px", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 16, opacity: 0.6 }}>??</span>
              <p style={{ color: "var(--text-secondary)", fontSize: 12, fontWeight: 600, letterSpacing: "0.06em" }}>{t("analizPage.posting.totalFollowers")}</p>
            </div>
            <p style={{ fontSize: 24, fontWeight: 700, color: "#F6F1EC" }}>{zernioData.totalFollowers}</p>
          </div>

          <div className="glass" style={{ borderRadius: 16, padding: "20px", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 16, opacity: 0.6 }}>?</span>
              <p style={{ color: "var(--text-secondary)", fontSize: 12, fontWeight: 600, letterSpacing: "0.06em" }}>{t("analizPage.posting.totalReviews")}</p>
            </div>
            <p style={{ fontSize: 24, fontWeight: 700, color: "#F6F1EC" }}>{stats.totalReviews}</p>
          </div>

          <div className="glass" style={{ borderRadius: 16, padding: "20px", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 16, opacity: 0.6 }}>??</span>
              <p style={{ color: "var(--text-secondary)", fontSize: 12, fontWeight: 600, letterSpacing: "0.06em" }}>Toplam Eriþim</p>
            </div>
            <p style={{ fontSize: 24, fontWeight: 700, color: "#F6F1EC" }}>{zernioData.totalReach}</p>
          </div>
          
          <div className="glass" style={{ borderRadius: 16, padding: "20px", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 16, opacity: 0.6 }}>??</span>
              <p style={{ color: "var(--text-secondary)", fontSize: 12, fontWeight: 600, letterSpacing: "0.06em" }}>Engagement Rate</p>
            </div>
            <p style={{ fontSize: 24, fontWeight: 700, color: "#F6F1EC" }}>{avgEngagementRate}%</p>
          </div>

          <div className="glass" style={{ borderRadius: 16, padding: "20px", border: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 16, opacity: 0.6 }}>??</span>
              <p style={{ color: "var(--text-secondary)", fontSize: 12, fontWeight: 600, letterSpacing: "0.06em" }}>En Ýyi Gönderi</p>
            </div>
            {bestPost ? (
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                {bestPost.media_urls && bestPost.media_urls.length > 0 ? (
                  <div className="w-10 h-10 rounded-md overflow-hidden shrink-0 relative bg-white/5">
                    {bestPost.media_urls[0].match(/\.(mp4|webm|ogg|mov|blob)(\?.*)?$/i) || bestPost.media_urls[0].includes('blob') ? (
                      <video src={bestPost.media_urls[0]} className="w-full h-full object-cover" muted playsInline />
                    ) : (
                      <img src={bestPost.media_urls[0]} alt="Best post" className="w-full h-full object-cover" />
                    )}
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-md shrink-0 flex items-center justify-center bg-white/5">
                     <i className="fa-solid fa-align-left text-gray-500 text-xs"></i>
                  </div>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, color: "#F6F1EC", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {bestPost.content || bestPost.title || "Post"}
                  </p>
                  <a href={bestPost.platform_url || bestPost.url || "#"} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: "#FF7A59", textDecoration: "none" }}>Görüntüle ?</a>
                </div>
              </div>
            ) : (
              <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>Veri yok</p>
            )}
          </div>
        </div>`
content = content.replace(renderPostingAnalyticsRegex, newStatsRibbon);

content = content.replace(
    /    \);\s+const renderInboxAnalytics = \(\) => \(/,
    `    );
  };

  const renderInboxAnalytics = () => (`
);

content = content.replace(
    /\{zernioData\.followerStats\.length > 0 && \([\s\S]*?<linearGradient id="colorFollowers" x1="0" y1="0" x2="0" y2="1">[\s\S]*?<\/AreaChart>\s*<\/ResponsiveContainer>\s*<\/div>\s*<\/div>\s*\)\}/,
    `{zernioData.postTimeline && zernioData.postTimeline.timeline && zernioData.postTimeline.timeline.length > 0 && (
        <div className="glass" style={{ borderRadius: 20, padding: "24px", border: "1px solid rgba(34,181,115,0.3)", marginTop: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <span style={{ color: "#22B573", fontSize: 20 }}>??</span>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#F6F1EC" }}>Platform Bazýnda Takipçi Artýþý</h3>
          </div>
          <p style={{ color: "var(--text-secondary)", fontSize: 12, marginBottom: 24 }}>Zaman içinde kazanýlan takipçi (Follows) sayýlarý</p>

          <div style={{ height: 250, width: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
               {(() => {
                 const platforms = new Set();
                 const dateMap = zernioData.postTimeline.timeline.reduce((acc: any, curr: any) => {
                   if (!curr.date) return acc;
                   if (!acc[curr.date]) acc[curr.date] = { date: curr.date };
                   const plat = curr.platform || 'instagram'; // Fallback to instagram if not provided
                   platforms.add(plat);
                   acc[curr.date][plat] = (acc[curr.date][plat] || 0) + (curr.follows || 0);
                   return acc;
                 }, {});
                 const evolutionData = Object.values(dateMap).sort((a: any, b: any) => String(a.date).localeCompare(String(b.date)));
                 
                 return (
                   <LineChart data={evolutionData as any}>
                     <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                     <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                     <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                     <Tooltip content={<CustomTooltip />} />
                     <Legend iconType="circle" />
                     {Array.from(platforms).map((plat: any, i: number) => {
                       const platId = plat.toLowerCase() === 'google' ? 'googlebusiness' : plat.toLowerCase();
                       const platDef = PLATFORMS.find(p => p.id === platId);
                       const color = platDef ? platDef.color : ['#FF7A59', '#C2478D', '#E8A8CD', '#22B573', '#0077b5'][i % 5];
                       return (
                         <Line key={plat} type="monotone" dataKey={plat} name={platDef ? platDef.name : (plat.charAt(0).toUpperCase() + plat.slice(1))} stroke={color} strokeWidth={3} dot={{ r: 4, strokeWidth: 0, fill: color }} activeDot={{ r: 6 }} />
                       );
                     })}
                   </LineChart>
                 );
               })()}
            </ResponsiveContainer>
          </div>
        </div>
      )}`
);

content = content.replace(
    /                          \/>\s*\)\s*\}\)\}\s*<\/div>\s*\)\);\s*\}\)\(\)\}\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*\)\}/,
    `                          />
                        )
                      })}
                    </div>
                  ));
                  })()}
                </div>
              </div>
            </div>
            
            {(() => {
              const sorted = [...zernioData.bestTimes].sort((a: any, b: any) => (b.avg_engagement || 0) - (a.avg_engagement || 0));
              const topSlots = sorted.slice(0, 3);
              const dayNames = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
              if (topSlots.length > 0) {
                return (
                  <div style={{ marginTop: 24, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 16 }}>?</span>
                    <p style={{ color: "#F6F1EC", fontSize: 13, fontWeight: 500 }}>
                      <span style={{ color: "var(--text-secondary)", marginRight: 8 }}>En iyi zamanlar:</span>
                      {topSlots.map((s: any) => \`\${dayNames[s.day_of_week]} \${s.hour.toString().padStart(2, '0')}:00\`).join(', ')}
                    </p>
                  </div>
                );
              }
              return null;
            })()}
            
          </div>
        )}`
);

content = content.replace(
    /<div style=\{\{ display: "flex", flexDirection: "column", gap: 16 \}\}>\s*<div style=\{\{ display: "flex", alignItems: "center", justifyContent: "space-between" \}\}>[\s\S]*?\{zernioData\.formatBreakdown\.image\}<\/span>\s*<\/div>\s*<\/div>/,
    `<div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                   {(() => {
                     let videoEr = "0.0";
                     let imageEr = "0.0";
                     if (zernioData.postAnalytics) {
                       let vEng=0, vVws=0, iEng=0, iVws=0;
                       zernioData.postAnalytics.forEach((p: any) => {
                         const m = p.analytics || p.metrics || p || {};
                         const eng = (m.likes||0) + (m.comments||0) + (m.shares||0) + (m.saves||0);
                         const vws = (m.impressions||m.views||0);
                         const isVid = (p.media_urls && p.media_urls.some((u: any) => u.match(/\\.(mp4|webm|mov|blob)(\\?.*)?$/i) || u.includes('blob')));
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
                </div>`
);

fs.writeFileSync('src/app/(dashboard)/analiz/page.tsx', content, 'utf8');
console.log('Script ran!');
