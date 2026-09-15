const fs = require('fs');

const updateI18n = (file, translations) => {
    let content = JSON.parse(fs.readFileSync(file, 'utf8'));
    content.sosyalMedyaPage = content.sosyalMedyaPage || {};
    content.sosyalMedyaPage.status = content.sosyalMedyaPage.status || {};
    Object.assign(content.sosyalMedyaPage.status, translations.status);
    Object.assign(content.sosyalMedyaPage, translations.page);
    fs.writeFileSync(file, JSON.stringify(content, null, 2));
};

updateI18n('messages/tr.json', {
    status: {
        needsReconnectionTitle: "Yeniden Baðlantý Gerekli",
        needsReconnection: "Baðlantý Koptu",
        connectionLost: "Zernio ile baðlantý koptu veya hesabýn süresi doldu. Lütfen tekrar baðlanýn."
    },
    page: {
        reconnectButton: "Yeniden Baðlan"
    }
});

updateI18n('messages/en.json', {
    status: {
        needsReconnectionTitle: "Reconnection Required",
        needsReconnection: "Connection Lost",
        connectionLost: "Connection to Zernio is lost or account expired. Please reconnect."
    },
    page: {
        reconnectButton: "Reconnect"
    }
});

updateI18n('messages/de.json', {
    status: {
        needsReconnectionTitle: "Wiederverbindung erforderlich",
        needsReconnection: "Verbindung unterbrochen",
        connectionLost: "Die Verbindung zu Zernio wurde unterbrochen oder das Konto ist abgelaufen. Bitte stellen Sie eine neue Verbindung her."
    },
    page: {
        reconnectButton: "Neu verbinden"
    }
});

console.log("Translations updated");
