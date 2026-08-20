import Link from 'next/link';

export default function PolicyPage() {
  return (
    <div className="min-h-screen bg-[#141319] text-white p-8 md:p-16 selection:bg-[#00A2FF]/30 selection:text-white">
      <div className="max-w-4xl mx-auto bg-[#0A0D14]/50 backdrop-blur-md border border-white/5 rounded-2xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#00A2FF]/10 blur-[120px] rounded-full pointer-events-none z-0"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[50%] bg-[#B600F8]/10 blur-[120px] rounded-full pointer-events-none z-0"></div>
        
        <div className="relative z-10">
          <Link href="/login" className="inline-flex items-center gap-2 text-[#8E95B3] hover:text-white transition-colors mb-8">
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <span>Geri D&ouml;n</span>
          </Link>
          
          <h1 className="text-3xl md:text-4xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-[#00A2FF] to-[#B600F8]">
            Gizlilik Politikas&yacute; ve Kullan&yacute;m Ko&thorn;ullar&yacute;
          </h1>
          
          <div className="space-y-6 text-[#8E95B3] leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-white mb-3">1. Giri&thorn;</h2>
              <p>Workigom Flow olarak gizlili&eth;inize &ouml;nem veriyoruz. Bu metin, platformumuzu kullan&yacute;rken verilerinizin nas&yacute;l i&thorn;lendi&eth;ini a&ccedil;&yacute;klamaktad&yacute;r.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-bold text-white mb-3">2. Veri Toplama ve Kullan&yacute;m</h2>
              <p>Hizmetlerimizi sunabilmek amac&yacute;yla hesap bilgileriniz, i&thorn; ak&yacute;&thorn;lar&yacute;n&yacute;z ve entegrasyon verileriniz g&uuml;venli bir &thorn;ekilde saklan&yacute;r ve yaln&yacute;zca size hizmet vermek amac&yacute;yla kullan&yacute;l&yacute;r.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">3. &Uuml;&ccedil;&uuml;nc&uuml; Taraf Ba&eth;lant&yacute;lar&yacute; (Google vb.)</h2>
              <p>Google gibi &uuml;&ccedil;&uuml;nc&uuml; taraf hizmetlerle yapt&yacute;&eth;&yacute;n&yacute;z entegrasyonlarda, yaln&yacute;zca onay verdi&eth;iniz kapsamdak&yacute; verilere eri&thorn;ilir ve bu veriler kesinlikle sat&yacute;lmaz veya izinsiz payla&thorn;&yacute;lmaz.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-bold text-white mb-3">4. &Yacute;leti&thorn;im</h2>
              <p>Sorular&yacute;n&yacute;z i&ccedil;in bizimle ileti&thorn;ime ge&ccedil;ebilirsiniz.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
