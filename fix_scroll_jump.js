const fs = require('fs');
let content = fs.readFileSync('src/app/(dashboard)/ai-asistan/page.tsx', 'utf8');

// 1. Rename ref and update hook
const oldHook = `  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);`;

const newHook = `  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages, isTyping]);`;

content = content.replace(oldHook, newHook);

// 2. Add ref to the container
const oldContainer = '<div style={{ flex: 1, background: "rgba(0,0,0,0.2)", display: "flex", flexDirection: "column", padding: "20px 16px", overflowY: "auto", gap: 16 }}>';
const newContainer = '<div ref={chatContainerRef} style={{ flex: 1, background: "rgba(0,0,0,0.2)", display: "flex", flexDirection: "column", padding: "20px 16px", overflowY: "auto", gap: 16 }}>';
content = content.replace(oldContainer, newContainer);

// 3. Remove the end ref
content = content.replace('<div ref={chatEndRef} />', '');

fs.writeFileSync('src/app/(dashboard)/ai-asistan/page.tsx', content);
console.log("Done");
