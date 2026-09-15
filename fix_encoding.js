const fs = require('fs');
const filepath = 'src/app/(dashboard)/analiz/page.tsx';
let content = fs.readFileSync(filepath, 'utf8');

const replacements = {
    'Ã„Â±': 'ý',
    'ÃƒÂ¼': 'ü',
    'ÃƒÂ¶': 'ö',
    'Ã…Å¸': 'þ',
    'Ã„Å¸': 'ð',
    'ÃƒÂ§': 'ç',
    'Ã…Å¾': 'Þ',
    'Ã„Â°': 'Ý',
    'ÃƒÂ–': 'Ö',
    'ÃƒÂœ': 'Ü',
    'ÃƒÂ‡': 'Ç',
    'Ã„Å¾': 'Ð',
    'Ã„ÂŸ': 'ð'
};

try {
    let buf = Buffer.from(content, 'latin1');
    let fixed = buf.toString('utf8');
    // Verify if it worked by checking for a known good word, like 'Etkileþim'
    if (fixed.includes('Etkileþim')) {
        content = fixed;
        console.log('Fixed using Buffer conversion!');
    } else {
        throw new Error('Buffer conversion did not produce expected results');
    }
} catch (e) {
    console.log('Fallback to manual replacement');
    for (const [bad, good] of Object.entries(replacements)) {
        content = content.split(bad).join(good);
    }
}

fs.writeFileSync(filepath, content, 'utf8');
console.log('Done');
