const fs = require('fs');
let content = fs.readFileSync('src/app/(dashboard)/analiz/page.tsx', 'utf8');

// The file has double encoded characters like Ä±, ÅŸ.
// Let's decode them safely.
try {
    let buf = Buffer.from(content, 'latin1');
    let fixed = buf.toString('utf8');
    
    // If it contains , it means the decode failed or wasn't needed everywhere.
    // Wait, the file is purely UTF-8, but the characters inside it are double-encoded.
    // Actually, let's just do a manual replace of all known double-encoded characters to be safe.
    const mappings = {
        'Ä±': 'ý',
        'Ã§': 'ç',
        'Ä°': 'Ý',
        'Ã¶': 'ö',
        'Ã¼': 'ü',
        'ÄŸ': 'ð',
        'ÅŸ': 'þ',
        'Ã‡': 'Ç',
        'Ã–': 'Ö',
        'Ãœ': 'Ü',
        'Äz': 'Ð',
        'Åz': 'Þ',
        'â€”': '—',
        // Also fix the emojis that might have been mangled
        'ðŸ“¥': '??',
        'ðŸ“¤': '??',
        'ðŸ‘\x81ï¸\x8F': '???',
        'â\x8F±ï¸\x8F': '??',
        'ðŸš€': '??',
        'â˜…': '?',
        'â–¼': '¡'
    };

    for (const [bad, good] of Object.entries(mappings)) {
        content = content.split(bad).join(good);
    }
    
    fs.writeFileSync('src/app/(dashboard)/analiz/page.tsx', content, 'utf8');
    console.log('Fixed double encoding via manual mappings');
} catch (e) {
    console.error(e);
}
