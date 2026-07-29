export default function AiAsistanPage() {
  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto animate-fade-in">
      <div className="flex flex-col gap-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-headline-lg font-bold text-primary text-glow">AI Asistan Manager</h1>
            <p className="text-on-surface-variant mt-2 font-body-md">Yapay zeka asistanınızın kişiliğini, talimatlarını ve entegrasyonlarını yönetin.</p>
          </div>
          <div className="flex items-center gap-4 bg-surface-container-highest p-3 rounded-xl border border-outline-variant/30">
            <span className="font-label-sm text-sm font-bold text-on-surface">Asistan Aktif</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer toggle-checkbox" defaultChecked />
              <div className="w-11 h-6 bg-surface-variant rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all toggle-label shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]"></div>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Settings Column */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* Persona & Role */}
            <section className="glass-panel p-6 rounded-2xl neon-border-purple">
              <h2 className="text-xl font-headline-md font-bold text-on-surface mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">psychology</span>
                AI Kişiliği & Rolü
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-xs font-label-sm text-on-surface-variant mb-2">İŞLETME ROLÜ</label>
                  <select className="w-full bg-surface-container border border-outline-variant/50 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-colors">
                    <option>Güzellik Salonu Asistanı</option>
                    <option>E-Ticaret Müşteri Temsilcisi</option>
                    <option>Emlak Danışmanı</option>
                    <option>Genel AI Asistan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-label-sm text-on-surface-variant mb-2">KARAKTER & ÜSLUP</label>
                  <select className="w-full bg-surface-container border border-outline-variant/50 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-colors">
                    <option>Profesyonel ve Kibar</option>
                    <option>Samimi ve Eğlenceli</option>
                    <option>Kısa ve Net</option>
                    <option>İkna Edici (Satış Odaklı)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-label-sm text-on-surface-variant mb-2 flex justify-between">
                  <span>SİSTEM TALİMATI (PROMPT)</span>
                  <span className="text-primary/70 cursor-pointer hover:text-primary transition-colors">Otomatik Oluştur</span>
                </label>
                <textarea 
                  rows={6}
                  className="w-full bg-surface-container border border-outline-variant/50 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-colors custom-scrollbar resize-none"
                  defaultValue={"Sen, 'Güzellik Salonu' için özel olarak tasarlanmış bir müşteri asistanısın. Müşterilere randevu alma, hizmet fiyatları ve çalışma saatleri konusunda yardımcı olmalısın. Her zaman nazik ol ve müşterinin sorularına en kısa sürede, net yanıtlar ver. Fiyat bilgisi verirken her zaman güncel fiyat listesini referans al."}
                />
              </div>
            </section>

            {/* Knowledge Base & Integrations */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Connected Services */}
              <div className="glass-panel p-6 rounded-2xl border border-outline-variant/30">
                <h3 className="text-lg font-headline-md font-bold text-on-surface mb-4">Bağlı Servisler</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-high border border-outline-variant/20 hover:border-secondary/30 transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#25D366]/20 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[#25D366] text-sm">chat</span>
                      </div>
                      <span className="text-sm font-bold text-on-surface">WhatsApp</span>
                    </div>
                    <span className="text-[10px] bg-secondary/10 text-secondary px-2 py-1 rounded-md font-bold">BAĞLI</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container border border-dashed border-outline-variant/50 hover:border-primary/50 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors text-sm">add_to_drive</span>
                      </div>
                      <span className="text-sm font-bold text-on-surface-variant group-hover:text-on-surface transition-colors">Google Drive Bağla</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Advanced Settings */}
              <div className="glass-panel p-6 rounded-2xl border border-outline-variant/30">
                <h3 className="text-lg font-headline-md font-bold text-on-surface mb-4">İleri Seviye</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-label-sm text-on-surface-variant">Yaratıcılık (Temperature)</label>
                      <span className="text-xs text-primary">0.7</span>
                    </div>
                    <input type="range" min="0" max="1" step="0.1" defaultValue="0.7" className="w-full accent-primary" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-on-surface">Uzun Yanıtlar</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer toggle-checkbox" />
                      <div className="w-9 h-5 bg-surface-variant rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all toggle-label shadow-[inset_0_1px_2px_rgba(0,0,0,0.4)]"></div>
                    </label>
                  </div>
                </div>
              </div>
            </section>
            
            <div className="flex justify-end mt-2">
              <button className="px-6 py-3 bg-primary-container text-on-primary-container font-bold rounded-xl shadow-[0_0_15px_rgba(168,85,247,0.4)] hover:bg-primary transition-colors">
                Ayarları Kaydet
              </button>
            </div>
          </div>

          {/* Right Column: Live Simulator */}
          <div className="lg:col-span-1">
            <div className="glass-panel rounded-2xl border border-secondary/30 neon-border-cyan h-[600px] flex flex-col overflow-hidden">
              <div className="p-4 border-b border-outline-variant/30 bg-surface-container/50 backdrop-blur-md flex items-center gap-3">
                <span className="material-symbols-outlined text-secondary">forum</span>
                <h3 className="font-headline-md font-bold text-on-surface">Canlı Simülasyon</h3>
              </div>
              
              <div className="flex-1 p-4 overflow-y-auto custom-scrollbar flex flex-col gap-4">
                {/* AI Message */}
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 border border-primary/30">
                    <span className="material-symbols-outlined text-primary text-sm">smart_toy</span>
                  </div>
                  <div className="bg-surface-container-highest p-3 rounded-2xl rounded-tl-none border border-outline-variant/20 max-w-[85%] shadow-sm">
                    <p className="text-sm text-on-surface">Merhaba! Ayarlarımı yeni kaydettiniz. Bana test amaçlı sorular sorabilirsiniz.</p>
                  </div>
                </div>
                
                {/* User Message */}
                <div className="flex gap-3 flex-row-reverse">
                  <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center shrink-0 border border-secondary/30">
                    <span className="material-symbols-outlined text-secondary text-sm">person</span>
                  </div>
                  <div className="bg-secondary/10 p-3 rounded-2xl rounded-tr-none border border-secondary/20 max-w-[85%] shadow-sm">
                    <p className="text-sm text-on-surface">Fiyat listeniz nerede?</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border-t border-outline-variant/30 bg-surface-container/30">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Test mesajı gönder..." 
                    className="w-full bg-surface-container border border-outline-variant/50 rounded-full pl-4 pr-12 py-3 text-sm text-on-surface focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/50 transition-colors"
                  />
                  <button className="absolute right-1 top-1 w-10 h-10 rounded-full bg-secondary text-[#003731] flex items-center justify-center hover:scale-105 transition-transform shadow-[0_0_10px_rgba(68,226,205,0.3)]">
                    <span className="material-symbols-outlined text-sm">send</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
