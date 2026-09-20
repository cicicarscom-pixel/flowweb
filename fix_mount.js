const fs = require('fs');
const file = 'src/app/(dashboard)/sosyal-medya/page.tsx';
const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
const idx = 81;
const endIdx = 99;

const newBlock = `  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.replace('#', '?'));
    
    const accountId = searchParams.get('accountId') || hashParams.get('accountId');
    const errorParam = searchParams.get('error') || hashParams.get('error');
    const errorMessage = searchParams.get('error_message') || hashParams.get('error_message') || searchParams.get('error_description') || hashParams.get('error_description');

    // Önce Zernio'ya hiç gitmeden, yerelde zaten bilinen hesapları anında göster —
    // aksi halde sayfaya her girişte hesaplar bir anlığına boşalıp Zernio
    // senkronizasyonu bitene kadar "dönüp duruyor" gibi görünüyordu (16.09.2026,
    // kullanıcı bildirdi). fetchAccounts(false) senkron olmayan hızlı bir yerel DB
    // okuması, Zernio'ya istek atmıyor. Ardından aşağıdaki gerçek Zernio
    // senkronizasyonu (fetchAccounts(true)) arka planda tetiklenmeye devam ediyor;
    // liste zaten doluyken bu ikinci çağrı sadece "Senkronize Et" butonundaki
    // ikonu döndürür, kartları boşaltmaz.
    fetchAccounts(false);

    if (errorParam || errorMessage) {
       const displayError = errorMessage ? decodeURIComponent(errorMessage.replace(/\\+/g, ' ')) : errorParam;
       alert(t("sosyalMedyaPage.errors.connectError") + ": " + displayError);
       window.history.replaceState({}, '', window.location.pathname);
    } else if (accountId) {
      fetchAccounts(true);
      window.history.replaceState({}, '', window.location.pathname);
    } else {
      // OAUTH geri dönüşlerinde URL'de parametre olmasa bile yeni eklenen hesabı çekmek için her zaman senkronize et
      fetchAccounts(true);
    }`;

lines.splice(idx, endIdx - idx + 1, newBlock);
fs.writeFileSync(file, lines.join('\n'), 'utf8');
console.log('Update complete via splice');
