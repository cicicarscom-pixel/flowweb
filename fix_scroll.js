const fs = require('fs');
let content = fs.readFileSync('src/app/(dashboard)/ai-asistan/page.tsx', 'utf8');

// 1. Add useRef to imports
content = content.replace(
  'import React, { useState, useEffect } from "react";',
  'import React, { useState, useEffect, useRef } from "react";'
);

// 2. Add chatEndRef inside BotScreen
const hookInsert = `
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);
`;
content = content.replace(
  '  const [isTyping, setIsTyping] = useState(false);',
  hookInsert
);

// 3. Add <div ref={chatEndRef} /> at the end of the chat messages
const chatEndInsert = `
                  {isTyping && (
                    <div style={{ alignSelf: "flex-start", display: "flex", gap: 4, padding: "8px 14px", background: "rgba(255,255,255,0.05)", borderRadius: 99 }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(255,255,255,0.4)" }} />
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(255,255,255,0.6)" }} />
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(255,255,255,0.4)" }} />
                    </div>
                  )}
                  <div ref={chatEndRef} />
`;
content = content.replace(
  /\{\s*isTyping && \(\s*<div style=\{\{ alignSelf: "flex-start"[\s\S]*?<\/div>\s*\)\}\s*/m,
  chatEndInsert
);

fs.writeFileSync('src/app/(dashboard)/ai-asistan/page.tsx', content);
console.log("Done");
