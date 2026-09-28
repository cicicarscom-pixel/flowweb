"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import AiChatInput from "@/components/chat/AiChatInput";
import { createClient } from "@/lib/supabase/client";

interface Message {
 id: string;
 text: string;
 sender: "user" | "ai";
 isImage?: boolean;
}

function ChatScreen() {
 const t = useTranslations();
 const searchParams = useSearchParams();
 const typeParam = searchParams.get("type");
 let transactionType = typeParam === "gelir" ? "gelir" : "gider";
 if (typeParam === "asistan") {
 transactionType = "asistan";
 }

 const transactionTypeLabel = transactionType === "gelir"
 ? t("veriGirisiPage.transactionTypes.income")
 : t("veriGirisiPage.transactionTypes.expense");

 const initialMessage = transactionType === "asistan"
 ? t("veriGirisiPage.chat.greetingAssistant")
 : t("veriGirisiPage.chat.greetingDocument", { type: transactionTypeLabel });

 const [messages, setMessages] = useState<Message[]>([
 {
 id: "1",
 text: initialMessage,
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

   const getIds = async () => {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user?.id) return { profileId: null, orgId: null };
    const { data: orgMember } = await supabase.from('organization_members').select('organization_id').eq('user_id', session.user.id).limit(1).maybeSingle();
    return { profileId: session.user.id, orgId: orgMember?.organization_id || session.user.id };
  };

  const processTextWithAI = async (textPrompt: string) => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { profileId, orgId } = await getIds();
      
      const promptPrefix = `Tür: ${transactionType}, Tarih: ${searchParams.get("date") || new Date().toISOString().split('T')[0]}. `;
      
      const { data: result, error: invokeError } = await supabase.functions.invoke('ledger-isleyici-api', {
        body: { 
          prompt: promptPrefix + textPrompt,
          profile_id: profileId,
          organization_id: orgId
        }
      });

      if (invokeError) throw invokeError;
      if (result && result.error) throw new Error(result.error);
      
      if (result?.saved) {
        addMessage(t("veriGirisiPage.chat.draftSaved") + ` \nTakvime eklendi: ${result.message || ''}`, "ai");
      } else {
        addMessage(result?.message || t("veriGirisiPage.chat.documentAnalyzed"), "ai");
      }
    } catch (error: any) {
      console.error("Sohbet hatası:", error);
      addMessage("Hata oluştu: " + error.message, "ai");
    } finally {
      setLoading(false);
    }
  };

  const processFileWithAI = async (file: File) => {
    setLoading(true);
    const isImage = file.type.startsWith("image/");
    const fileUrl = URL.createObjectURL(file);

    if (isImage) {
      addMessage(fileUrl, "user", true);
    } else {
      addMessage(t("veriGirisiPage.chat.documentUploaded", { fileName: file.name }), "user");
    }

    try {
      const supabase = createClient();
      const { profileId, orgId } = await getIds();
      
      const { data: draftDoc, error: insertError } = await supabase.from('finance_documents').insert([{
        organization_id: orgId || 'unknown',
        type: transactionType,
        image_url: null,
        document_status: 'ready_for_review',
        ledger_official_status: 'taslak',
        flow_payment_status: 'unpaid',
        title: `Belge: ${file.name}`,
        amount_minor: 0
      }]).select().maybeSingle();

      if (insertError) throw insertError;

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64Data = reader.result?.toString().split(',')[1];
        
        const { data: result, error: invokeError } = await supabase.functions.invoke('ledger-isleyici-api', {
          body: {
            document_id: draftDoc.id,
            prompt: `Tür: ${transactionType}, Tarih: ${searchParams.get("date") || new Date().toISOString().split('T')[0]}.`,
            mimeType: file.type,
            profile_id: profileId,
            organization_id: orgId,
            imageBase64: base64Data
          }
        });

        if (invokeError) throw invokeError;
        if (result && result.error) throw new Error(result.error);

        addMessage(result?.message || t("veriGirisiPage.chat.documentAnalyzed"), "ai");
        setLoading(false);
      };
      
      reader.onerror = (error) => {
        throw error;
      };

    } catch (error: any) {
      console.error("Belge işleme hatası:", error);
      addMessage("İşleme hatası: " + error.message, "ai");
      setLoading(false);
    }
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
 <div className="flex-1 flex flex-col h-full w-full bg-[#17151A] relative">
 {/* Background image overlay */}
 <div
 className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-20"
 style={{
 backgroundImage:
 "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDUpjAKmMNnHDAuGn7KDAmiX4BVuWBLEG-5a7fHFVu_x7Jxrfh8UzY6rM-oy3AiqN0b1h6_K5iobCNsv2B4iHnz_lPjQ6QXfGvJ4UZmCcQLcr6H8o6m3I1JVFmgqk7UubXZx96-wpkV8-ScZZBzzkpl4-_WMzeHLyFljEKugxDZQXZgdkjst86sxa7hU95rBimeOBSnqHbdwH9bj_yj1tbla3T_HPG2xI6XkgTpyJRiDhmg9Po0q7NWy9DKn3JnR0b5tcpUj4Vcxr3w')",
 }}
 ></div>
 <div className="absolute inset-0 z-0 bg-[#17151A]/80"></div>

 {/* Header */}
 <div className="relative z-10 flex items-center h-16 px-6 border-b border-white/10 shrink-0 bg-[#17151A]/50 backdrop-blur-md">
 <Link
 href="/ai-muhasebe"
 className="text-on-surface hover:text-secondary transition-colors mr-4 flex items-center"
 >
 <span className="material-symbols-outlined">arrow_back</span>
 </Link>
 <h1 className="text-on-surface font-semibold text-lg tracking-wide flex-1">
 {t("veriGirisiPage.header.title")}{" "}
 <span className="text-secondary/50 text-sm font-normal ml-2">
 ({transactionType === "asistan" ? t("veriGirisiPage.transactionTypes.assistant") : transactionTypeLabel})
 </span>
 </h1>
 </div>

 {/* Chat Area */}
 <div
 className="relative z-10 flex-1 overflow-y-auto px-4 pt-6 pb-20"
 ref={scrollRef}
 >
 <div className="flex flex-col space-y-4 w-full max-w-5xl mx-auto">
 {messages.map((msg) => (
 <div
 key={msg.id}
 className={`max-w-[80%] rounded-2xl p-3 ${
 msg.sender === "user"
 ? "bg-secondary/20 self-end text-on-surface border border-secondary/30"
 : "bg-surface-container self-start border border-white/5 text-on-surface"
 }`}
 >
 {msg.isImage ? (
 // eslint-disable-next-line @next/next/no-img-element
 <img
 src={msg.text}
 alt={t("veriGirisiPage.chat.uploadedImageAlt")}
 className="w-48 h-48 object-cover rounded-lg"
 />
 ) : (
 <p className="text-[18px] leading-relaxed whitespace-pre-wrap">
 {msg.text}
 </p>
 )}
 </div>
 ))}
 {loading && (
 <div className="self-start bg-surface-container p-4 rounded-2xl mb-4 border border-white/5">
 <div className="flex space-x-2 items-center">
 <div
 className="w-2 h-2 bg-secondary rounded-full animate-bounce"
 style={{ animationDelay: "0ms" }}
 ></div>
 <div
 className="w-2 h-2 bg-secondary rounded-full animate-bounce"
 style={{ animationDelay: "150ms" }}
 ></div>
 <div
 className="w-2 h-2 bg-secondary rounded-full animate-bounce"
 style={{ animationDelay: "300ms" }}
 ></div>
 </div>
 </div>
 )}
 </div>
 </div>

 {/* Input Area */}
 <div className="relative z-20 shrink-0 pb-4 max-w-5xl w-full mx-auto">
 <AiChatInput
 inputText={inputText}
 setInputText={setInputText}
 handleSend={handleSendText}
 placeholder={t("veriGirisiPage.chat.inputPlaceholder")}
 />
 </div>
 </div>
 );
}

export default function AiVeriGirisiPage() {
 const t = useTranslations();
 return (
 <Suspense
 fallback={
 <div className="flex-1 bg-[#17151A] flex items-center justify-center">
 <div className="text-secondary">{t("veriGirisiPage.loading")}</div>
 </div>
 }
 >
 <ChatScreen />
 </Suspense>
 );
}
