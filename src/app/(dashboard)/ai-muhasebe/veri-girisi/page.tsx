"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import AiChatInput from "@/components/chat/AiChatInput";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  isImage?: boolean;
}

function ChatScreen() {
  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type");
  const transactionType = typeParam === "gelir" ? "gelir" : "gider";

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: `Merhaba! Bir ${transactionType} belgesi yükleyerek veya yazarak işlemi kaydedebilirsiniz.`,
      sender: "ai",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const addMessage = (text: string, sender: "user" | "ai", isImage = false) => {
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString() + Math.random(), text, sender, isImage },
    ]);
  };

  const processTextWithAI = (textPrompt: string) => {
    setLoading(true);
    // Simulate AI response delay
    setTimeout(() => {
      addMessage("İşleminiz taslak olarak kaydedildi.", "ai");
      setLoading(false);
    }, 1500);
  };

  const processFileWithAI = (file: File) => {
    setLoading(true);
    const isImage = file.type.startsWith("image/");
    const fileUrl = URL.createObjectURL(file);

    if (isImage) {
      addMessage(fileUrl, "user", true);
    } else {
      addMessage(`Belge Yüklendi: ${file.name}`, "user");
    }

    // Simulate AI response delay
    setTimeout(() => {
      addMessage("Belge başarıyla analiz edildi ve kaydedildi.", "ai");
      setLoading(false);
    }, 2000);
  };

  const handleSendText = (text: string, file: File | null) => {
    if (file) {
      processFileWithAI(file);
    }
    
    if (text.trim()) {
      addMessage(text, "user");
      processTextWithAI(text);
    }
    setInputText("");
  };

  return (
    <div className="flex-1 flex flex-col h-full w-full bg-[#0A0A0B] relative">
      {/* Background image overlay */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{
          backgroundImage:
            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDUpjAKmMNnHDAuGn7KDAmiX4BVuWBLEG-5a7fHFVu_x7Jxrfh8UzY6rM-oy3AiqN0b1h6_K5iobCNsv2B4iHnz_lPjQ6QXfGvJ4UZmCcQLcr6H8o6m3I1JVFmgqk7UubXZx96-wpkV8-ScZZBzzkpl4-_WMzeHLyFljEKugxDZQXZgdkjst86sxa7hU95rBimeOBSnqHbdwH9bj_yj1tbla3T_HPG2xI6XkgTpyJRiDhmg9Po0q7NWy9DKn3JnR0b5tcpUj4Vcxr3w')",
        }}
      ></div>
      <div className="absolute inset-0 z-0 bg-[#0A0A0B]/80"></div>

      {/* Header */}
      <div className="relative z-10 flex items-center h-16 px-6 border-b border-white/10 shrink-0 bg-[#0A0A0B]/50 backdrop-blur-md">
        <Link
          href="/ai-muhasebe"
          className="text-white hover:text-[#00f0ff] transition-colors mr-4 flex items-center"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </Link>
        <h1 className="text-white font-semibold text-lg tracking-wide flex-1">
          AI Veri Girişi{" "}
          <span className="text-[#00f0ff]/50 text-sm font-normal ml-2">
            ({transactionType})
          </span>
        </h1>
      </div>

      {/* Chat Area */}
      <div
        className="relative z-10 flex-1 overflow-y-auto px-4 pt-6 pb-20"
        ref={scrollRef}
      >
        <div className="flex flex-col space-y-4 w-full max-w-3xl mx-auto">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`max-w-[80%] rounded-2xl p-3 ${
                msg.sender === "user"
                  ? "bg-[#00f0ff]/20 self-end text-white border border-[#00f0ff]/30"
                  : "bg-[#1c1c1e] self-start border border-white/5 text-[#e5e2e3]"
              }`}
            >
              {msg.isImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={msg.text}
                  alt="Yüklenen görsel"
                  className="w-48 h-48 object-cover rounded-lg"
                />
              ) : (
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {msg.text}
                </p>
              )}
            </div>
          ))}
          {loading && (
            <div className="self-start bg-[#1c1c1e] p-4 rounded-2xl mb-4 border border-white/5">
              <div className="flex space-x-2 items-center">
                <div
                  className="w-2 h-2 bg-[#00f0ff] rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-[#00f0ff] rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-[#00f0ff] rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="relative z-20 shrink-0 pb-4 max-w-3xl w-full mx-auto">
        <AiChatInput
          inputText={inputText}
          setInputText={setInputText}
          handleSend={handleSendText}
          placeholder="Gemini'ye mesaj gönderin..."
        />
      </div>
    </div>
  );
}

export default function AiVeriGirisiPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 bg-[#0A0A0B] flex items-center justify-center">
          <div className="text-[#00f0ff]">Yükleniyor...</div>
        </div>
      }
    >
      <ChatScreen />
    </Suspense>
  );
}
