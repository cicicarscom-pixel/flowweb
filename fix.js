const fs = require('fs');
let content = fs.readFileSync('src/actions/zernio.ts', 'utf8');
content = content.replace(
  'if (accounts.length > 0) {',
  'if (accounts.length > 0) {\n            console.log("ZERNIO_ACC_RAW", JSON.stringify(accounts));'
);
fs.writeFileSync('src/actions/zernio.ts', content);
