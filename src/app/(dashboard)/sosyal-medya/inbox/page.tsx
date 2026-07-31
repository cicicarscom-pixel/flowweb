"use client";

import React, { useState } from "react";
import Link from "next/link";
import AiChatInput from "@/components/chat/AiChatInput";

const MOCK_CONVERSATIONS = [
  {
    id: "1",
    platform: "instagram",
    userName: "Merve Yılmaz",
    userAvatar: "https://i.pravatar.cc/150?u=1",
    lastMessageSnippet: "Merhaba, yazlık elbiselerin fiyatı nedir?",
    timestamp: "10:45",
    unreadCount: 2,
    type: "dm",
  },
  {
    id: "2",
    platform: "facebook",
    userName: "Caner Kılıç",
    userAvatar: "https://i.pravatar.cc/150?u=2",
    lastMessageSnippet: "Kargo ne zaman ulaşır?",
    timestamp: "Dün",
    unreadCount: 0,
    type: "dm",
  },
  {
    id: "3",
    platform: "twitter",
    userName: "Ayşe Kaya",
    userAvatar: "https://i.pravatar.cc/150?u=3",
    lastMessageSnippet: "Harika bir kampanya! (Yorum)",
    timestamp: "Salı",
    unreadCount: 1,
    type: "comment",
  },
];

const MOCK_MESSAGES = {
  "1": [
    { id: "m1", text: "Merhaba, sayfanızı çok beğenerek takip ediyorum.", sender: "user", time: "10:40" },
    { id: "m2", text: "Yazlık elbiselerin fiyatı nedir?", sender: "user", time: "10:45" },
  ],
  "2": [
    { id: "m1", text: "Siparişim kargoya verildi mi?", sender: "user", time: "14:20" },
    { id: "m2", text: "Merhaba Caner Bey, siparişiniz bugün kargoya teslim edilmiştir. Takip numaranız: 123456", sender: "ai", time: "14:25" },
    { id: "m3", text: "Kargo ne zaman ulaşır?", sender: "user", time: "14:30" },
  ],
  "3": [
    { id: "m1", text: "Harika bir kampanya! (Yorum)", sender: "user", time: "09:00" },
  ],
};

export default function GelenKutusuPage() {
  const [activeTab, setActiveTab] = useState<"mesajlar" | "yorumlar">("mesajlar");
  const [selectedConvId, setSelectedConvId] = useState<string>("1");
  const [inputText, setInputText] = useState("");

  const filteredConversations = MOCK_CONVERSATIONS.filter((conv) => {
    if (activeTab === "mesajlar") return conv.type === "dm";
    if (activeTab === "yorumlar") return conv.type === "comment";
    return true;
  });

  const selectedConv = MOCK_CONVERSATIONS.find((c) => c.id === selectedConvId);
  const activeMessages = selectedConvId ? MOCK_MESSAGES[selectedConvId as keyof typeof MOCK_MESSAGES] : [];

  const handleSendMessage = (text: string, file: File | null) => {
    // Statik olarak mesaj gönderme simülasyonu
    console.log("Mesaj gönderildi:", text, file);
    setInputText("");
  };

  return (
    <div className="flex-1 flex h-full w-full bg-transparent relative">
      {/* Background image overlay */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{
          backgroundImage:
            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDUpjAKmMNnHDAuGn7KDAmiX4BVuWBLEG-5a7fHFVu_x7Jxrfh8UzY6rM-oy3AiqN0b1h6_K5iobCNsv2B4iHnz_lPjQ6QXfGvJ4UZmCcQLcr6H8o6m3I1JVFmgqk7UubXZx96-wpkV8-ScZZBzzkpl4-_WMzeHLyFljEKugxDZQXZgdkjst86sxa7hU95rBimeOBSnqHbdwH9bj_yj1tbla3T_HPG2xI6XkgTpyJRiDhmg9Po0q7NWy9DKn3JnR0b5tcpUj4Vcxr3w')",
        }}
      ></div>
      <div className="absolute inset-0 z-0 bg-transparent/80"></div>

      {/* Main Container */}
      <div className="relative z-10 flex w-full h-full">
        {/* Sidebar (List) */}
        <div className="w-[350px] shrink-0 border-r border-white/10 flex flex-col bg-[#0b0c10]/80 backdrop-blur-md">
          {/* Header */}
          <div className="h-16 px-6 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/sosyal-medya" className="text-white hover:text-[#00f0ff] transition-colors flex items-center">
                <span className="material-symbols-outlined text-[20px]">arrow_back</span>
              </Link>
              <h1 className="text-white font-semibold text-lg tracking-wide">Gelen Kutusu</h1>
            </div>
            <button className="text-[#849495] hover:text-white transition-colors">
              <span className="material-symbols-outlined text-[20px]">filter_list</span>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex px-4 py-3 gap-2 border-b border-white/10 shrink-0">
            <button
              onClick={() => setActiveTab("mesajlar")}
              className={`flex-1 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "mesajlar" ? "bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/30" : "text-[#849495] hover:bg-white/5 border border-transparent"
              }`}
            >
              Mesajlar
            </button>
            <button
              onClick={() => setActiveTab("yorumlar")}
              className={`flex-1 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "yorumlar" ? "bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/30" : "text-[#849495] hover:bg-white/5 border border-transparent"
              }`}
            >
              Yorumlar
            </button>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            {filteredConversations.length > 0 ? (
              filteredConversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => setSelectedConvId(conv.id)}
                  className={`flex items-center gap-3 px-4 py-4 cursor-pointer border-b border-white/5 transition-colors ${
                    selectedConvId === conv.id ? "bg-white/10" : "hover:bg-white/5"
                  }`}
                >
                  {/* Avatar & Platform Icon */}
                  <div className="relative shrink-0">
                    <img src={conv.userAvatar} alt={conv.userName} className="w-12 h-12 rounded-full object-cover" />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#1c1c1e] flex items-center justify-center border border-white/10">
                      <i className={`fa-brands fa-${conv.platform} text-[10px] text-white`}></i>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="text-white text-sm font-medium truncate pr-2">{conv.userName}</h4>
                      <span className="text-[#849495] text-xs shrink-0">{conv.timestamp}</span>
                    </div>
                    <p className={`text-xs truncate ${conv.unreadCount > 0 ? "text-[#00f0ff] font-medium" : "text-[#849495]"}`}>
                      {conv.lastMessageSnippet}
                    </p>
                  </div>

                  {/* Unread Badge */}
                  {conv.unreadCount > 0 && (
                    <div className="w-5 h-5 shrink-0 rounded-full bg-[#00f0ff] flex items-center justify-center">
                      <span className="text-black text-[10px] font-bold">{conv.unreadCount}</span>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-[#849495] text-sm">
                Bu sekmede mesaj bulunmuyor.
              </div>
            )}
          </div>
        </div>

        {/* Chat Area (Right Column) */}
        {selectedConvId && selectedConv ? (
          <div className="flex-1 flex flex-col bg-transparent relative">
            {/* Chat Header */}
            <div className="h-16 px-6 border-b border-white/10 flex items-center justify-between bg-[#131315]/80 backdrop-blur-md shrink-0">
              <div className="flex items-center gap-3">
                <img src={selectedConv.userAvatar} alt={selectedConv.userName} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <h3 className="text-white text-sm font-semibold">{selectedConv.userName}</h3>
                  <div className="flex items-center gap-1 mt-0.5">
                    <i className={`fa-brands fa-${selectedConv.platform} text-[10px] text-[#00f0ff]`}></i>
                    <span className="text-[#849495] text-xs capitalize">{selectedConv.platform}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-[#849495] hover:text-white hover:bg-white/10 transition-colors">
                  <span className="material-symbols-outlined text-[18px]">search</span>
                </button>
                <button className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-[#849495] hover:text-white hover:bg-white/10 transition-colors">
                  <span className="material-symbols-outlined text-[18px]">more_vert</span>
                </button>
              </div>
            </div>

            {/* Chat History */}
            <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-4">
              <div className="text-center my-2">
                <span className="text-xs bg-white/5 text-[#849495] px-3 py-1 rounded-full border border-white/10">Bugün</span>
              </div>
              
              {activeMessages.map((msg) => (
                <div key={msg.id} className={`flex max-w-[70%] ${msg.sender === "ai" ? "self-end" : "self-start"}`}>
                  <div className={`p-3 rounded-2xl ${
                    msg.sender === "ai" 
                      ? "bg-[#00f0ff]/20 border border-[#00f0ff]/30 text-white rounded-br-none" 
                      : "bg-[#1c1c1e] border border-white/5 text-[#e5e2e3] rounded-bl-none"
                  }`}>
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                    <div className={`text-[10px] mt-1 text-right ${msg.sender === "ai" ? "text-[#00f0ff]/70" : "text-[#849495]"}`}>
                      {msg.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="shrink-0 p-4 border-t border-white/10 bg-[#131315]/80 backdrop-blur-md">
              <div className="max-w-4xl mx-auto">
                <AiChatInput 
                  inputText={inputText}
                  setInputText={setInputText}
                  handleSend={handleSendMessage}
                  placeholder="Mesaj yazın..."
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-[#849495]">
            <span className="material-symbols-outlined text-6xl mb-4 opacity-30">chat</span>
            <p>Görüntülemek için bir sohbet seçin.</p>
          </div>
        )}
      </div>
    </div>
  );
}

