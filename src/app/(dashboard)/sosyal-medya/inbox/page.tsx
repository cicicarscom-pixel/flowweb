"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import AiChatInput from "@/components/chat/AiChatInput";
import { createClient } from "@/lib/supabase/client";

type Conversation = {
  id: string;
  zernio_conversation_id: string;
  participant_name: string;
  platform: string;
  updated_at: string;
  unread_count: number;
  lastMessageSnippet?: string;
  messages?: any[];
};

type Comment = {
  id: string;
  content: string;
  username: string;
  platform: string;
  created_at: string;
  zernio_post_id: string;
  _pictureUrl?: string;
};

export default function GelenKutusuPage() {
  const [activeTab, setActiveTab] = useState<"mesajlar" | "yorumlar">("mesajlar");
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [inputText, setInputText] = useState("");
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [activeMessages, setActiveMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    fetchConversations();
    fetchComments();

    const convChannel = supabase
      .channel("realtime_conversations")
      .on("postgres_changes", { event: "*", schema: "public", table: "conversations" }, () => {
        fetchConversations();
      })
      .subscribe();

    const commentsChannel = supabase
      .channel("realtime_comments")
      .on("postgres_changes", { event: "*", schema: "public", table: "comments" }, () => {
        fetchComments();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(convChannel);
      supabase.removeChannel(commentsChannel);
    };
  }, []);

  const fetchConversations = async () => {
    const { data, error } = await supabase
      .from("conversations")
      .select(`
        *,
        messages (
          content,
          created_at
        )
      `)
      .order("updated_at", { ascending: false });

    if (!error && data) {
      const enhancedData = data.map((conv: any) => {
        let lastMessageSnippet = "Son mesajı görmek için dokunun";
        if (conv.messages && conv.messages.length > 0) {
          const sortedMessages = [...conv.messages].sort(
            (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
          lastMessageSnippet = sortedMessages[0].content;
        }
        return { ...conv, lastMessageSnippet };
      });
      setConversations(enhancedData);
    }
    setIsLoading(false);
  };

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setComments(data);
    }
  };

  const fetchMessagesForConversation = async (zernioConvId: string) => {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", zernioConvId)
      .order("created_at", { ascending: true });

    if (!error && data) {
      setActiveMessages(data);
    }
  };

  useEffect(() => {
    if (selectedConvId && activeTab === "mesajlar") {
      const conv = conversations.find((c) => c.id === selectedConvId);
      if (conv) {
        fetchMessagesForConversation(conv.zernio_conversation_id);
      }
    }
  }, [selectedConvId, activeTab]);

  const handleSendMessage = (text: string, file: File | null) => {
    // API logic for sending message goes here
    console.log("Mesaj gönderildi:", text, file);
    setInputText("");
  };

  const selectedConv = conversations.find((c) => c.id === selectedConvId);

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
        <div className="w-[350px] shrink-0 border-r border-white/10 flex flex-col bg-surface/80 backdrop-blur-md">
          {/* Header */}
          <div className="h-16 px-6 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/sosyal-medya" className="text-on-surface hover:text-secondary transition-colors flex items-center">
                <span className="material-symbols-outlined text-[20px]">arrow_back</span>
              </Link>
              <h1 className="text-on-surface font-semibold text-lg tracking-wide">Gelen Kutusu</h1>
            </div>
            <button className="text-on-surface-variant hover:text-on-surface transition-colors">
              <span className="material-symbols-outlined text-[20px]">filter_list</span>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex px-4 py-3 gap-2 border-b border-white/10 shrink-0">
            <button
              onClick={() => { setActiveTab("mesajlar"); setSelectedConvId(null); }}
              className={`flex-1 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "mesajlar" ? "bg-secondary/20 text-secondary border border-secondary/30" : "text-on-surface-variant hover:bg-white/5 border border-transparent"
              }`}
            >
              Mesajlar
            </button>
            <button
              onClick={() => { setActiveTab("yorumlar"); setSelectedConvId(null); }}
              className={`flex-1 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "yorumlar" ? "bg-secondary/20 text-secondary border border-secondary/30" : "text-on-surface-variant hover:bg-white/5 border border-transparent"
              }`}
            >
              Yorumlar
            </button>
          </div>

          {/* List Content */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            {isLoading ? (
              <div className="p-8 text-center text-secondary">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary mx-auto"></div>
              </div>
            ) : activeTab === "mesajlar" ? (
              conversations.length > 0 ? (
                conversations.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => setSelectedConvId(conv.id)}
                    className={`flex items-center gap-3 px-4 py-4 cursor-pointer border-b border-white/5 transition-colors ${
                      selectedConvId === conv.id ? "bg-white/10" : "hover:bg-white/5"
                    }`}
                  >
                    <div className="relative shrink-0">
                      <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-xl text-on-surface">
                        {conv.participant_name ? conv.participant_name.charAt(0).toUpperCase() : "?"}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-surface-container flex items-center justify-center border border-white/10">
                        <i className={`fa-brands fa-${conv.platform} text-[10px] ${conv.platform === 'instagram' ? 'text-[#ebb2ff]' : 'text-[#00f0ff]'}`}></i>
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="text-on-surface text-sm font-medium truncate pr-2">{conv.participant_name}</h4>
                        <span className="text-on-surface-variant text-xs shrink-0">
                          {new Date(conv.updated_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className={`text-xs truncate ${conv.unread_count > 0 ? "text-secondary font-medium" : "text-on-surface-variant"}`}>
                        {conv.lastMessageSnippet}
                      </p>
                    </div>

                    {conv.unread_count > 0 && (
                      <div className="w-5 h-5 shrink-0 rounded-full bg-secondary flex items-center justify-center">
                        <span className="text-black text-[10px] font-bold">{conv.unread_count}</span>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-on-surface-variant text-sm">
                  Bu sekmede mesaj bulunmuyor.
                </div>
              )
            ) : (
              comments.length > 0 ? (
                comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="flex flex-col gap-2 px-4 py-4 cursor-pointer border-b border-white/5 transition-colors hover:bg-white/5"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <i className={`fa-brands fa-${comment.platform} text-[14px] ${comment.platform === 'instagram' ? 'text-[#ebb2ff]' : 'text-[#00f0ff]'}`}></i>
                        <h4 className="text-secondary text-sm font-semibold truncate pr-2">@{comment.username}</h4>
                      </div>
                      <span className="text-on-surface-variant text-xs shrink-0">
                        {new Date(comment.created_at).toLocaleDateString('tr-TR')}
                      </span>
                    </div>
                    <p className="text-on-surface text-xs leading-relaxed line-clamp-2">
                      {comment.content}
                    </p>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-on-surface-variant text-sm">
                  Bu sekmede yorum bulunmuyor.
                </div>
              )
            )}
          </div>
        </div>

        {/* Chat Area (Right Column) */}
        {activeTab === "mesajlar" && selectedConvId && selectedConv ? (
          <div className="flex-1 flex flex-col bg-transparent relative">
            {/* Chat Header */}
            <div className="h-16 px-6 border-b border-white/10 flex items-center justify-between bg-surface/80 backdrop-blur-md shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-lg text-on-surface">
                  {selectedConv.participant_name ? selectedConv.participant_name.charAt(0).toUpperCase() : "?"}
                </div>
                <div>
                  <h3 className="text-on-surface text-sm font-semibold">{selectedConv.participant_name}</h3>
                  <div className="flex items-center gap-1 mt-0.5">
                    <i className={`fa-brands fa-${selectedConv.platform} text-[10px] text-secondary`}></i>
                    <span className="text-on-surface-variant text-xs capitalize">{selectedConv.platform}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Chat History */}
            <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-4">
              {activeMessages.map((msg) => (
                <div key={msg.id} className={`flex max-w-[70%] ${msg.direction === "outgoing" ? "self-end" : "self-start"}`}>
                  <div className={`p-3 rounded-2xl ${
                    msg.direction === "outgoing" 
                    ? "bg-secondary/20 border border-secondary/30 text-on-surface rounded-br-none" 
                    : "bg-surface-container border border-white/5 text-on-surface rounded-bl-none"
                  }`}>
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                    <div className={`text-[10px] mt-1 text-right ${msg.direction === "outgoing" ? "text-secondary/70" : "text-on-surface-variant"}`}>
                      {new Date(msg.created_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="shrink-0 p-4 border-t border-white/10 bg-surface/80 backdrop-blur-md">
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
          <div className="flex-1 flex flex-col items-center justify-center text-on-surface-variant">
            <span className="material-symbols-outlined text-6xl mb-4 opacity-30">chat</span>
            <p>{activeTab === "mesajlar" ? "Görüntülemek için bir sohbet seçin." : "Yorumlar sol listede görüntülenir."}</p>
          </div>
        )}
      </div>
    </div>
  );
}
