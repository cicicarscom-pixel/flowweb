export default function CreatePostPage() {
  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto flex flex-col h-full animate-fade-in pb-10">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-headline-lg font-bold text-primary text-glow">Gönderi Oluştur</h1>
          <p className="font-body-md text-sm text-on-surface-variant mt-1">AI ile saniyeler içinde etkileyici görsel ve metinler hazırlayın.</p>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 h-full min-h-[600px]">
        
        {/* Left Col: Setup & Format */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-outline-variant/30 flex flex-col gap-6">
            <div>
              <label className="text-xs font-label-sm text-on-surface-variant mb-2 block uppercase tracking-widest">Platform</label>
              <select className="w-full bg-surface-container border border-outline-variant/50 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-colors">
                <option>Instagram</option>
                <option>Facebook</option>
                <option>LinkedIn</option>
                <option>X (Twitter)</option>
              </select>
            </div>
            
            <div>
              <label className="text-xs font-label-sm text-on-surface-variant mb-3 block uppercase tracking-widest">Görsel Boyutu</label>
              <div className="grid grid-cols-2 gap-3">
                <button className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl border border-primary bg-primary/10 text-primary transition-colors">
                  <div className="w-8 h-8 border-2 border-current rounded-sm"></div>
                  <span className="text-[10px] font-bold">Kare (1:1)</span>
                </button>
                <button className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl border border-outline-variant/50 text-on-surface-variant hover:border-primary/50 hover:text-primary transition-colors">
                  <div className="w-6 h-8 border-2 border-current rounded-sm"></div>
                  <span className="text-[10px] font-bold">Dikey (4:5)</span>
                </button>
                <button className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl border border-outline-variant/50 text-on-surface-variant hover:border-primary/50 hover:text-primary transition-colors">
                  <div className="w-6 h-10 border-2 border-current rounded-sm"></div>
                  <span className="text-[10px] font-bold">Story (9:16)</span>
                </button>
                <button className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl border border-outline-variant/50 text-on-surface-variant hover:border-primary/50 hover:text-primary transition-colors">
                  <div className="w-10 h-6 border-2 border-current rounded-sm"></div>
                  <span className="text-[10px] font-bold">Yatay (16:9)</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: AI Chat Interface for Post Generation */}
        <div className="lg:col-span-3 flex flex-col glass-panel rounded-2xl border border-primary/30 neon-border-purple overflow-hidden">
          <div className="p-4 border-b border-outline-variant/30 bg-surface-container/50 backdrop-blur-md flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                <span className="material-symbols-outlined text-primary">auto_awesome</span>
              </div>
              <div>
                <h3 className="font-headline-md font-bold text-on-surface">AI Üretim Asistanı</h3>
                <span className="text-[10px] text-tertiary-fixed-dim bg-tertiary-fixed-dim/10 px-2 py-0.5 rounded-full font-bold">HAZIR</span>
              </div>
            </div>
            <button className="px-3 py-1.5 bg-surface-container-highest border border-outline-variant/50 rounded-lg text-xs font-bold text-on-surface hover:text-primary transition-colors">
              Temizle
            </button>
          </div>
          
          <div className="flex-1 p-6 overflow-y-auto custom-scrollbar flex flex-col gap-6 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent">
            {/* AI Welcome Message */}
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-1">
                <span className="material-symbols-outlined text-primary text-sm">smart_toy</span>
              </div>
              <div className="bg-surface-container-highest p-4 rounded-2xl rounded-tl-none border border-outline-variant/20 shadow-sm text-sm text-on-surface w-fit max-w-[80%]">
                <p>Merhaba! Yeni bir gönderi oluşturmak için bana ne istediğinizi söyleyin. Örneğin:</p>
                <ul className="mt-2 space-y-1 text-on-surface-variant list-disc pl-4">
                  <li>"Yaz indirimleri için dikkat çekici bir Instagram gönderisi hazırla"</li>
                  <li>"Yeni kahve çeşidimizi tanıtan, kahverengi tonlarında bir görsel üret"</li>
                </ul>
              </div>
            </div>

            {/* Example User Prompt */}
            <div className="flex gap-4 flex-row-reverse">
              <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center shrink-0 mt-1">
                <span className="material-symbols-outlined text-secondary text-sm">person</span>
              </div>
              <div className="bg-secondary/10 p-4 rounded-2xl rounded-tr-none border border-secondary/20 shadow-sm text-sm text-on-surface w-fit max-w-[80%]">
                <p>Yaz kampanyamız için ferah bir görsel ve etkileyici bir metin oluştur. Hedef kitle: Gençler.</p>
              </div>
            </div>

            {/* Example AI Response (Image + Text) */}
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-1">
                <span className="material-symbols-outlined text-primary text-sm">smart_toy</span>
              </div>
              <div className="flex flex-col gap-3 max-w-[80%]">
                <div className="bg-surface-container-highest p-4 rounded-2xl rounded-tl-none border border-primary/30 shadow-[0_0_15px_rgba(168,85,247,0.15)] text-sm text-on-surface w-full">
                  <p className="font-bold text-primary mb-2">Metin Önerisi:</p>
                  <p>Yaz sıcaklarına ferah bir mola! ☀️ Yeni soğuk kahvelerimizle serinlemeye hazır mısın? Arkadaşını etiketle, 2. kahven bizden olsun! 🧊🥤 #YazGeldi #SoğukKahve #Ferahlık</p>
                  <div className="mt-3 flex gap-2">
                    <button className="text-xs bg-surface-container px-3 py-1 rounded-md hover:text-primary transition-colors border border-outline-variant/30 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">content_copy</span> Kopyala
                    </button>
                    <button className="text-xs bg-surface-container px-3 py-1 rounded-md hover:text-secondary transition-colors border border-outline-variant/30 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">refresh</span> Yeniden Yaz
                    </button>
                  </div>
                </div>
                
                <div className="bg-surface-container-highest p-4 rounded-2xl border border-primary/30 shadow-[0_0_15px_rgba(168,85,247,0.15)] w-full">
                  <p className="font-bold text-primary mb-2 flex justify-between items-center">
                    <span>Görsel Önerisi:</span>
                    <button className="text-xs flex items-center gap-1 text-on-surface-variant hover:text-secondary transition-colors">
                      <span className="material-symbols-outlined text-[14px]">download</span> İndir
                    </button>
                  </p>
                  <div className="w-full aspect-square bg-surface-container rounded-xl border border-outline-variant/50 flex items-center justify-center overflow-hidden relative group">
                    {/* Placeholder for generated image */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#FF9A9E] to-[#FECFEF] opacity-50 mix-blend-overlay"></div>
                    <span className="material-symbols-outlined text-4xl text-on-surface-variant/50">image</span>
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-sm">
                      <button className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center hover:scale-110 transition-transform shadow-[0_0_15px_rgba(168,85,247,0.6)]">
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                      <button className="w-10 h-10 rounded-full bg-surface-container text-white flex items-center justify-center hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-[18px]">open_in_full</span>
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end mt-2">
                  <button className="px-6 py-2 bg-primary text-on-primary-container font-bold rounded-xl shadow-[0_0_15px_rgba(168,85,247,0.4)] hover:scale-105 transition-transform">
                    Paylaşım Merkezine Aktar
                  </button>
                </div>
              </div>
            </div>
            
          </div>
          
          <div className="p-4 border-t border-outline-variant/30 bg-surface-container/80 backdrop-blur-md">
            <div className="relative flex items-end gap-2 bg-surface-container border border-outline-variant/50 rounded-2xl p-2 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/50 transition-all shadow-inner">
              <button className="w-10 h-10 rounded-full text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[22px]">add_photo_alternate</span>
              </button>
              <textarea 
                rows={2}
                placeholder="Ne üretmek istiyorsun? Detayları yaz..." 
                className="w-full bg-transparent border-none text-sm text-on-surface focus:outline-none resize-none custom-scrollbar py-2"
              />
              <button className="w-10 h-10 rounded-full bg-primary text-on-primary-container flex items-center justify-center shrink-0 hover:scale-105 transition-transform shadow-[0_0_10px_rgba(168,85,247,0.4)] mb-1 mr-1">
                <span className="material-symbols-outlined text-[20px]">send</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
