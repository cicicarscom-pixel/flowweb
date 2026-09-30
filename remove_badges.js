const fs = require('fs');

function removeBadges(path) {
  if (!fs.existsSync(path)) return;
  let content = fs.readFileSync(path, 'utf8');
  content = content.replace(
    /badge\s*=\s*`\$\{slots\.filter\(s => s\.status === 'free'\)\.length\}\/\$\{slots\.length\}`;/g,
    ""
  );
  fs.writeFileSync(path, content, 'utf8');
  console.log('Removed from', path);
}

removeBadges('src/app/(dashboard)/ai-asistan/randevu/RandevuClient.tsx');
removeBadges('../flow/src/modules/randevu/presentation/screens/RandevuScreen.js');
