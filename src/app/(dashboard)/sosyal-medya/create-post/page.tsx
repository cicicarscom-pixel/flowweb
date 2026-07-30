import styles from './page.module.css';

export default function CreatePostPage() {
  return (
    <div className="flex-1 flex flex-col h-full bg-[#0e0e10] overflow-hidden">
      {/* Top Header Section (Div instead of header to comply with layout rules) */}
      <div className="h-20 flex items-center justify-between px-8 border-b border-[#2a2a2d] bg-[#0e0e10] flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#a855f7]/10 flex items-center justify-center text-[#a855f7]">
            <i className="fa-solid fa-wand-magic-sparkles text-xl flex items-center justify-center"></i>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white leading-tight">AI Paylaşım</h1>
            <p className="text-sm text-gray-400">AI destekli içerik oluşturun, düzenleyin ve seçtiğiniz platformlarda paylaşın.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#353538] text-gray-300 hover:bg-[#201f21] hover:text-white transition-colors text-sm font-medium">
            <i className="fa-solid fa-clock-rotate-left flex items-center justify-center"></i>
            <span>Geçmiş</span>
          </button>
          <button className="w-10 h-10 rounded-lg border border-[#353538] flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#201f21] transition-colors">
            <i className="fa-solid fa-gear flex items-center justify-center"></i>
          </button>
          <button className="w-10 h-10 rounded-lg border border-[#353538] flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#201f21] transition-colors">
            <i className="fa-regular fa-circle-question flex items-center justify-center"></i>
          </button>
        </div>
      </div>

      {/* Content Scrollable Area */}
      <div className={`flex-1 overflow-y-auto p-8 ${styles.customScrollbar}`}>
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
          
          {/* Left Column: Creation Flow */}
          <div className="space-y-6">
            
            {/* Step 1 */}
            <section className="bg-[#0e0e10] border border-[#2a2a2d] rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-sm font-bold text-white tracking-wide uppercase">1. NE PAYLAŞALIM?</h2>
                <i className="fa-regular fa-circle-question text-gray-500 text-sm"></i>
              </div>
              <textarea 
                className="w-full bg-[#201f21] border border-[#353538] rounded-lg p-4 text-sm text-gray-200 placeholder-gray-500 focus:border-[#a855f7] focus:ring-1 focus:ring-[#a855f7] transition-shadow resize-none" 
                placeholder="Örn: Yeni yaz koleksiyonumuz için enerjik bir post..." 
                rows={3}
              ></textarea>
            </section>

            {/* Step 2 */}
            <section className="bg-[#0e0e10] border border-[#2a2a2d] rounded-xl p-6">
              <h2 className="text-sm font-bold text-white tracking-wide uppercase mb-4">2. GÖRSEL &amp; VİDEO</h2>
              <div className={`relative w-full h-[240px] bg-[#201f21]/50 ${styles.dashedBorderUpload} flex flex-col items-center justify-center cursor-pointer hover:bg-[#201f21]/80 transition-colors group`}>
                <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#353538] flex items-center justify-center text-gray-400 hover:text-white z-10">
                  <i className="fa-solid fa-gear text-sm flex items-center justify-center"></i>
                </div>
                <div className="w-16 h-16 bg-[#14b8a6]/10 text-[#14b8a6] rounded-2xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <i className="fa-regular fa-image text-3xl relative flex items-center justify-center">
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#14b8a6] rounded-full flex items-center justify-center text-[#0e0e10] border-2 border-[#0e0e10]">
                      <i className="fa-solid fa-plus text-[10px]"></i>
                    </div>
                  </i>
                </div>
                <h3 className="text-base font-semibold text-white mb-2">Görsel &amp; video seç ya da sadece görsel üret</h3>
                <p className="text-sm text-gray-400 text-center max-w-sm">Galerinden eklemek için dokunun veya AI'ın benzersiz görsel üretmesini bekleyin.</p>
              </div>
            </section>

            {/* Step 3 */}
            <section className="bg-[#0e0e10] border border-[#2a2a2d] rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-white tracking-wide uppercase">3. İÇERİK METNİ</h2>
                <button className="text-[#c084fc] hover:text-[#d8b4fe] transition-colors">
                  <i className="fa-solid fa-pen flex items-center justify-center"></i>
                </button>
              </div>
              <div className="bg-[#201f21] border border-[#353538] rounded-lg p-4 mb-4 min-h-[120px]">
                <p className="text-sm text-gray-300 leading-relaxed">
                  Yapay zeka tarafından oluşturulan içerik metni burada görünecek. Gelişmiş dil modelleri ile hedef kitlenize uygun, etkileşimi yüksek metinler hazırlanıyor...
                </p>
              </div>
              <div className="relative flex items-center gap-3">
                <input 
                  className="flex-1 bg-[#201f21] border border-[#353538] rounded-full py-3 px-5 text-sm text-gray-200 placeholder-gray-500 focus:border-[#a855f7] focus:ring-1 focus:ring-[#a855f7]" 
                  placeholder="Görselle uyumlu bir metin üret..." 
                  type="text"
                />
                <button className={`w-10 h-10 rounded-full bg-[#9333ea] text-white flex items-center justify-center hover:bg-[#a855f7] transition-colors flex-shrink-0 ${styles.glowPurple}`}>
                  <i className="fa-solid fa-wand-magic-sparkles flex items-center justify-center"></i>
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-4">
                <span className="px-3 py-1.5 rounded-full bg-[#14b8a6]/10 text-[#14b8a6] text-xs font-medium">#yaz</span>
                <span className="px-3 py-1.5 rounded-full bg-[#14b8a6]/10 text-[#14b8a6] text-xs font-medium">#yenisezon</span>
                <button className="px-3 py-1.5 rounded-full border border-dashed border-gray-600 text-gray-400 text-xs font-medium hover:text-white hover:border-gray-400 transition-colors flex items-center gap-1">
                  <i className="fa-solid fa-plus flex items-center justify-center"></i> Etiket ekle
                </button>
              </div>
            </section>

            {/* Step 4 */}
            <section className="bg-[#0e0e10] border border-[#2a2a2d] rounded-xl p-6">
              <h2 className="text-sm font-bold text-white tracking-wide uppercase mb-6">4. GÖNDERİ AYARLARI</h2>
              
              {/* Account Selection */}
              <div className="mb-6">
                <label className="block text-xs font-medium text-gray-400 mb-2">Profil / Hesap</label>
                <div className="relative">
                  <button className="w-full flex items-center justify-between bg-[#201f21] border border-[#353538] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#a855f7]">
                    <div className="flex items-center gap-3">
                      <img alt="Profile" className="w-6 h-6 rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBH_ka25kuypvedDP_EzrGvo567hkykIE61gJdOp7tyYDZNq7J0pcBjgPENXQx3iNASw76nSf_3wGdXAtzTz84C58gg4mUsw4eDr7Pjw11yrCCIxdyQo7N8xZi8RTpN5AJNB7IklEVF0tvXYHG8lPvELV4zjo-thOgJ4_bj9ROt_I2mu_WEBPK6Eb7n1A20lR9N2q5LOXFWs1c7QBTz0imsg0DTu5F7Eecdy03PDyS22MAZ0zlV3rwu"/>
                      <span>AI Esnaf Profil</span>
                    </div>
                    <i className="fa-solid fa-chevron-down text-gray-500"></i>
                  </button>
                </div>
              </div>

              {/* Platform Selection */}
              <div className="mb-6">
                <label className="block text-xs font-medium text-gray-400 mb-2">Seçilen platformlarda paylaş</label>
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex items-center gap-3 bg-[#201f21] border border-[#a855f7]/50 rounded-lg p-3 cursor-pointer">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 flex items-center justify-center text-white">
                      <i className="fa-brands fa-instagram text-lg flex items-center justify-center"></i>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">Instagram</p>
                      <p className="text-[10px] text-gray-500 truncate">@ai.esnaf.profil</p>
                    </div>
                    <div className="w-5 h-5 rounded-full bg-[#14b8a6] flex items-center justify-center text-[#0e0e10] flex-shrink-0">
                      <i className="fa-solid fa-check text-xs flex items-center justify-center"></i>
                    </div>
                  </label>
                  
                  <label className="flex items-center gap-3 bg-[#201f21] border border-[#353538] rounded-lg p-3 cursor-pointer opacity-70 hover:opacity-100 transition-opacity">
                    <div className="w-8 h-8 rounded-lg bg-[#25D366] flex items-center justify-center text-white">
                      <i className="fa-brands fa-whatsapp text-lg flex items-center justify-center"></i>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">Whatsapp</p>
                      <p className="text-[10px] text-gray-500 truncate">+90 555 123 45 67</p>
                    </div>
                    <div className="w-5 h-5 rounded-full border border-gray-600 flex-shrink-0"></div>
                  </label>
                </div>
              </div>

              {/* Platform Specific Options (Instagram) */}
              <div className="border-t border-[#2a2a2d] pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-5 h-5 rounded bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 flex items-center justify-center text-white">
                    <i className="fa-brands fa-instagram text-[10px] flex items-center justify-center"></i>
                  </div>
                  <h3 className="text-sm font-medium text-white">Instagram</h3>
                </div>
                
                {/* Post Types Tabs */}
                <div className="flex p-1 bg-[#1c1b1d] rounded-lg mb-4">
                  <button className="flex-1 py-1.5 text-xs font-medium text-white bg-[#353538] rounded-md shadow-sm">Feed</button>
                  <button className="flex-1 py-1.5 text-xs font-medium text-gray-400 hover:text-white">Story</button>
                  <button className="flex-1 py-1.5 text-xs font-medium text-gray-400 hover:text-white">Reel</button>
                  <button className="flex-1 py-1.5 text-xs font-medium text-gray-400 hover:text-white">Carousel</button>
                </div>
                <p className="text-[11px] text-gray-500 mb-6">İçerik 24 saat sonra kaybolur. Sınırlandırma detayı.</p>
                
                {/* AI Label Toggle */}
                <div className="flex items-start gap-3 mb-6">
                  <input className="mt-1 w-4 h-4 rounded border-gray-600 bg-[#201f21] text-[#a855f7] focus:ring-[#a855f7] focus:ring-offset-[#0e0e10]" id="ai-label" type="checkbox"/>
                  <div>
                    <label className="text-sm font-medium text-white cursor-pointer" htmlFor="ai-label">AI ile üretildi olarak işaretle</label>
                    <p className="text-xs text-gray-400 mt-1">Instagram'ın AI içerik etiketleme ilkelerine uygun olarak bu içeriğin AI ile oluşturulduğunu belirtir.</p>
                  </div>
                </div>

                {/* First Comment */}
                <div className="mb-4">
                  <label className="block text-xs font-medium text-gray-400 mb-2">İlk yorum (isteğe bağlı)</label>
                  <div className="relative">
                    <textarea 
                      className="w-full bg-[#201f21] border border-[#353538] rounded-lg p-3 text-sm text-gray-200 placeholder-gray-600 focus:border-[#a855f7] focus:ring-1 focus:ring-[#a855f7] resize-none" 
                      placeholder="Örn: Yazın enerjisini birlikte yaşayalım! ☀️" 
                      rows={2}
                    ></textarea>
                    <span className="absolute bottom-2 right-3 text-[10px] text-gray-500">0/2200</span>
                  </div>
                </div>

                {/* Caption */}
                <div className="mb-4">
                  <label className="block text-xs font-medium text-gray-400 mb-2">Alt yazı (caption)</label>
                  <div className="relative">
                    <textarea 
                      className="w-full bg-[#201f21] border border-[#353538] rounded-lg p-3 text-sm text-gray-200 placeholder-gray-600 focus:border-[#a855f7] focus:ring-1 focus:ring-[#a855f7] resize-none" 
                      placeholder="İsteğe bağlı... (Leave blank to use main content)" 
                      rows={3}
                    ></textarea>
                    <span className="absolute bottom-2 right-3 text-[10px] text-gray-500">0/2200</span>
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">Konum ekle (isteğe bağlı)</label>
                  <div className="relative">
                    <input 
                      className="w-full bg-[#201f21] border border-[#353538] rounded-lg pl-3 pr-10 py-2.5 text-sm text-gray-200 placeholder-gray-600 focus:border-[#a855f7] focus:ring-1 focus:ring-[#a855f7]" 
                      placeholder="Konum seçin..." 
                      type="text"
                    />
                    <i className="fa-solid fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs"></i>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Preview & Publish */}
          <div className="space-y-6">
            
            {/* Step 5: Preview Panel */}
            <section className="bg-[#0e0e10] border border-[#2a2a2d] rounded-xl p-6">
              <h2 className="text-sm font-bold text-white tracking-wide uppercase mb-4">5. ÖNİZLEME</h2>
              
              <div className="flex p-1 bg-[#201f21] rounded-lg mb-6">
                <button className="flex-1 py-1.5 text-xs font-medium text-white bg-[#9333ea] rounded-md shadow-sm">Feed</button>
                <button className="flex-1 py-1.5 text-xs font-medium text-gray-400 hover:text-white">Story</button>
                <button className="flex-1 py-1.5 text-xs font-medium text-gray-400 hover:text-white">Reel</button>
                <button className="flex-1 py-1.5 text-xs font-medium text-gray-400 hover:text-white">Carousel</button>
              </div>

              {/* Fake Instagram Post */}
              <div className="bg-black border border-[#2a2a2d] rounded-xl overflow-hidden max-w-[320px] mx-auto">
                {/* Post Header */}
                <div className="flex items-center justify-between p-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 p-[2px]">
                      <img alt="Profile" className="w-full h-full rounded-full border border-black" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBfeEfU0YIy0WSnYgBqMbEDUbotJ0-CZypClnAWUIYnip2sDVCAwtDK-GiasJT_4tgjpJYP1QXWZS5i8L8Yx06by6Rvq1jx3FZXKTz7M4ppxTY_87hjvonXom97T0DEA156G9zZwem20CRj4zE1wWoSB_MGo2IVG86G5BFrxJkNYJi4GT8HrpqKLznY07Zd_WywS_h28rKVhNnMkfy-urQNSbOo65GrQG4-t3yU15R22ynojwAft2Xd"/>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white leading-tight">ai.esnaf.profil</p>
                      <p className="text-[10px] text-gray-400">İstanbul, Türkiye</p>
                    </div>
                  </div>
                  <i className="fa-solid fa-ellipsis-vertical text-white"></i>
                </div>
                {/* Post Image */}
                <div className="aspect-square bg-[#201f21]">
                  <img alt="Post Preview" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDhHj0ckuQIh-Q-YI12q4MkcvOPILIRGads_W7V-IpqiDQ_0OvVH_i8TN-ctSU5gbha17MEg44eNWUsUuJVT3ut_thWpu3bw31FePIyGAGgKk4O4CMwZeXZq46yaVOqS8H2LT_0AUUkxJvT2LL6V48Kli6yaf6r5XlHHh7GMl7Mg9hC9PKCSNkob0BoD5tCpJbdHDGvQkqjFgKr9vdC4JvrAe0uVkzSrmHcMbiV7gNIMvx3KMCvnN6z"/>
                </div>
                {/* Post Actions */}
                <div className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-4">
                      <i className="fa-solid fa-heart text-red-500 text-xl"></i>
                      <i className="fa-regular fa-comment text-white text-xl"></i>
                      <i className="fa-regular fa-paper-plane text-white text-xl"></i>
                    </div>
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-600"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-600"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-600"></div>
                    </div>
                    <i className="fa-regular fa-bookmark text-white text-xl"></i>
                  </div>
                  {/* Post Caption */}
                  <div className="text-sm">
                    <p className="text-white"><span className="font-bold mr-1">ai.esnaf.profil</span>☀️ Yaz koleksiyonumuz ile enerjinizi yansıtın! ☀️</p>
                    <p className="text-white mt-1">Renkli, rahat ve şık parçalar sizi bekliyor. Bu yaz stilinizle fark yaratın.</p>
                    <p className="text-blue-400 mt-2 text-xs">#yaz #yenisezon #koleksiyon #stil</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Step 6: Publishing */}
            <section className="bg-[#0e0e10] border border-[#2a2a2d] rounded-xl p-6">
              <h2 className="text-sm font-bold text-white tracking-wide uppercase mb-6">6. YAYINCILIK</h2>
              
              {/* Publish Type Toggle */}
              <div className="flex p-1 bg-[#201f21] rounded-lg mb-6">
                <button className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium text-white border border-[#a855f7] bg-[#581c87]/20 rounded-md">
                  <i className="fa-regular fa-clock text-[#c084fc] flex items-center justify-center"></i> Planlı
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium text-gray-400 hover:text-white">
                  <i className="fa-solid fa-bolt flex items-center justify-center"></i> Şimdi
                </button>
              </div>

              {/* Date/Time Inputs */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Tarih</label>
                  <div className="relative">
                    <input className="w-full bg-[#201f21] border border-[#353538] rounded-lg pl-4 pr-10 py-2.5 text-sm text-white focus:border-[#a855f7] focus:ring-1 focus:ring-[#a855f7] cursor-pointer" readOnly type="text" value="22 Mayıs 2024"/>
                    <i className="fa-regular fa-calendar absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Saat</label>
                  <div className="relative">
                    <input className="w-full bg-[#201f21] border border-[#353538] rounded-lg pl-4 pr-10 py-2.5 text-sm text-white focus:border-[#a855f7] focus:ring-1 focus:ring-[#a855f7] cursor-pointer" readOnly type="text" value="14:30"/>
                    <i className="fa-regular fa-clock absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Zaman dilimi</label>
                  <div className="relative">
                    <select className="w-full bg-[#201f21] border border-[#353538] rounded-lg pl-4 pr-10 py-2.5 text-sm text-white focus:border-[#a855f7] focus:ring-1 focus:ring-[#a855f7] appearance-none">
                      <option>Europe/Istanbul (GMT +03:00)</option>
                    </select>
                    <i className="fa-solid fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none"></i>
                  </div>
                </div>
              </div>

              {/* Info Notice */}
              <div className="flex gap-3 bg-[#14b8a6]/10 border border-[#14b8a6]/20 rounded-lg p-4 mb-6">
                <i className="fa-solid fa-circle-info text-[#14b8a6] mt-0.5"></i>
                <p className="text-xs text-gray-300 leading-relaxed">Gönderi, seçilen tüm platformlarda planlanan tarihte yayınlanacaktır.</p>
              </div>

              {/* Main Action Button */}
              <button className="w-full py-3 rounded-lg bg-gradient-to-r from-cyan-400 via-blue-500 to-[#a855f7] text-white font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                <i className="fa-solid fa-paper-plane flex items-center justify-center"></i> Seçili Platformlarda Paylaş
              </button>

              {/* Summary Section */}
              <div className="mt-8">
                <h3 className="text-sm font-bold text-white mb-4">Gönderi Özeti</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Platformlar</span>
                    <span className="text-white font-medium">2 platform</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Format</span>
                    <span className="text-white font-medium">Feed</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Planlanma</span>
                    <span className="text-white font-medium">22 May 2024 14:30</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Tahmini Erişim</span>
                    <span className="text-white font-medium">1.2K - 2.4K</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Tahmini Etkileşim</span>
                    <span className="text-white font-medium">120 - 250</span>
                  </div>
                </div>
              </div>
            </section>

            {/* AI Suggestion Box */}
            <div className="bg-[#581c87]/20 border border-[#a855f7]/30 rounded-xl p-5 relative overflow-hidden">
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#a855f7]/20 blur-xl rounded-full"></div>
              <div className="relative z-10 flex items-start gap-3">
                <i className="fa-solid fa-wand-magic-sparkles text-[#c084fc] mt-1 flex items-center justify-center"></i>
                <div>
                  <h4 className="text-sm font-bold text-[#f3e8ff] mb-1">AI Önerisi</h4>
                  <p className="text-xs text-[#e9d5ff]/80 leading-relaxed">
                    Gönderiniz için en iyi etkileşim zamanı Cuma günü 18:00 - 20:00 arasıdır.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
