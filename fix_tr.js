const fs = require('fs');
const file_path = 'messages/tr.json';
let content = JSON.parse(fs.readFileSync(file_path, 'utf8'));

content.sosyalMedyaPage.status.needsReconnectionTitle = "Yeniden Baðlantý Gerekli";
content.sosyalMedyaPage.status.needsReconnection = "Baðlantý Koptu";
content.sosyalMedyaPage.status.connectionLost = "Zernio ile baðlantý koptu veya hesabýn süresi doldu. Lütfen tekrar baðlanýn.";
content.sosyalMedyaPage.reconnectButton = "Yeniden Baðlan";

fs.writeFileSync(file_path, JSON.stringify(content, null, 2), 'utf8');
console.log("Done");
