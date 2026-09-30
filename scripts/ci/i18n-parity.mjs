// i18n-parity.mjs
import fs from 'fs';
import path from 'path';

const localesDir = path.resolve('messages');
if (!fs.existsSync(localesDir)) {
    console.log('No messages dir found, skipping i18n parity check.');
    process.exit(0);
}

const tr = JSON.parse(fs.readFileSync(path.join(localesDir, 'tr.json'), 'utf-8'));
const en = JSON.parse(fs.readFileSync(path.join(localesDir, 'en.json'), 'utf-8'));
const de = JSON.parse(fs.readFileSync(path.join(localesDir, 'de.json'), 'utf-8'));

function getKeys(obj, prefix = '') {
    return Object.keys(obj).reduce((res, el) => {
        if (Array.isArray(obj[el])) {
            return res;
        } else if (typeof obj[el] === 'object' && obj[el] !== null) {
            return [...res, ...getKeys(obj[el], prefix + el + '.')];
        }
        return [...res, prefix + el];
    }, []);
}

const trKeys = new Set(getKeys(tr));
const enKeys = new Set(getKeys(en));
const deKeys = new Set(getKeys(de));

const allowedMissing = new Set(['dashboardAppointments.appointments.status.cancelled']);

let error = false;
for (const key of trKeys) {
    if (allowedMissing.has(key)) continue;
    if (!enKeys.has(key)) { console.error('Missing in EN:', key); error = true; }
    if (!deKeys.has(key)) { console.error('Missing in DE:', key); error = true; }
}
if (error) process.exit(1);
console.log('i18n parity check passed.');
