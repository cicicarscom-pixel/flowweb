# STRUCTURE — flowweb (web) kök dizin haritası

> Kök dizindeki her klasör ve dosya burada açıklanır. **Yeni bir kök öğe eklemek için önce bu tabloya satır ekle**; CI (`scripts/ci/check-root-map.mjs`) haritada olmayan kök öğeyi reddeder.
> **Ajan sütunu:** **Dokunma** = talimat olmadan değiştirilmez · **Talimatla** = yalnız talimattaki iş · **Serbest** = kurallara (AGENTS.md) uyarak çalışılır.

| Öğe | Ne işe yarar | Uygulama buna bağlı mı | Ajan |
|---|---|---|---|
| `src/` | Uygulama kodu (`app/` sayfalar, `actions/` server action'lar, `components/`, `lib/`) | **Evet** | Serbest |
| `messages/` | Çeviriler (`tr`, `en`, `de`; next-intl) | **Evet** | Serbest (üç dile birden) |
| `public/` | Statik dosyalar (görseller, simgeler) | **Evet** | Talimatla |
| `next.config.ts` | Next.js ayarı | **Evet** | Dokunma |
| `tailwind.config.js` | Tailwind ayarı | **Evet** | Talimatla |
| `postcss.config.js` | PostCSS ayarı | **Evet** | Dokunma |
| `tsconfig.json` | TypeScript ayarı | **Evet** | Dokunma |
| `package.json` | Bağımlılıklar ve betikler | **Evet** | Talimatla |
| `package-lock.json` | Bağımlılık kilidi (npm) | **Evet** | Dokunma |
| `.npmrc` | npm ayarı | **Evet** | Dokunma |
| `deno.lock` | Deno kilidi (Next uygulamasında kullanılmıyor gibi; netleştirilecek) | Belirsiz | Dokunma |
| `scripts/` | CI kontrolleri (`scripts/ci/`) | Hayır (CI) | Dokunma |
| `.github/` | GitHub Actions CI | Hayır (CI) | Dokunma |
| `docs/` | Belgeler; `docs/archive/` yalnız tarihsel | Hayır | Serbest |
| `archive/` | Eski SQL dosyaları; migration zinciri DEĞİL | Hayır | Dokunma |
| `AGENTS.md` | **Tek geçerli ajan kuralları** | Hayır | Talimatla |
| `CLAUDE.md` | `AGENTS.md`'ye yönlendirir | Hayır | Dokunma |
| `STRUCTURE.md` | Bu harita | Hayır (CI) | Talimatla |
| `README.md` | Proje belgesi + "Son Güncellemeler" | Hayır | Serbest |
| `eslint.config.mjs` | ESLint ayarı | Hayır | Talimatla |
| `.editorconfig` | Editör ayarı (UTF-8, BOM'suz) | Hayır | Dokunma |
| `.gitignore` | Git dışı dosyalar | Hayır | Talimatla |
