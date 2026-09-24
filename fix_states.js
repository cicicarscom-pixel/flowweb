import * as fs from 'fs';

let content = fs.readFileSync('src/app/(dashboard)/ai-asistan/randevu/RandevuClient.tsx', 'utf8');

content = content.replace(
    'const [isManageModalOpen, setIsManageModalOpen] = useState(false);\n    const [promptConfig, setPromptConfig] = useState({ visible: false, title: "", placeholder: "", value: "", onSave: (\nval: string) => {} });\n',
    ''
);
// And also check if there's any other variations like without newline
content = content.replace(/const \[isManageModalOpen, setIsManageModalOpen\] = useState\(false\);\s*const \[promptConfig, setPromptConfig\] = useState\(\{ visible: false, title: "", placeholder: "", value: "", onSave: \(\s*val: string\) => \{\} \}\);\s*/g, '');

// Oh wait, I replaced BOTH states, but I need them IN RandevuClient!
// Let's add them back to RandevuClient!
content = content.replace(
    'const [calendars, setCalendars] = useState(initialCalendars || []);',
    'const [calendars, setCalendars] = useState(initialCalendars || []);\n  const [isManageModalOpen, setIsManageModalOpen] = useState(false);\n  const [promptConfig, setPromptConfig] = useState({ visible: false, title: "", placeholder: "", value: "", onSave: (val: string) => {} });'
);

fs.writeFileSync('src/app/(dashboard)/ai-asistan/randevu/RandevuClient.tsx', content, 'utf8');
console.log("Moved states to RandevuClient");
