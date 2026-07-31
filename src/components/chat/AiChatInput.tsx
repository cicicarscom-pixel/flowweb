"use client";

import React, { useState, useRef, KeyboardEvent } from "react";

interface AiChatInputProps {
  inputText: string;
  setInputText: (text: string) => void;
  handleSend: () => void;
  placeholder?: string;
  onAttachFile?: (file: File) => void;
}

export default function AiChatInput({
  inputText,
  setInputText,
  handleSend,
  placeholder = "İşlemi yazın...",
  onAttachFile,
}: AiChatInputProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAction = () => {
    setIsMenuOpen(false);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      if (onAttachFile) {
        onAttachFile(e.target.files[0]);
      }
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (inputText.trim()) {
        handleSend();
        setIsMenuOpen(false);
      }
    }
  };

  return (
    <div className="relative z-50 p-4 w-full">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*,application/pdf"
        onChange={handleFileChange}
      />

      {/* Floating Attachment Menu */}
      <div
        className={`absolute bottom-[80px] left-8 bg-[#161b26] rounded-2xl py-2 px-4 shadow-[0_4px_10px_rgba(0,242,254,0.15)] border border-white/5 transition-all duration-200 z-50 ${
          isMenuOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-2 pointer-events-none"
        }`}
      >
        <button
          onClick={handleAction}
          className="flex items-center py-3 px-4 w-full text-left border-b border-white/5 hover:bg-white/5 transition-colors"
        >
          <span className="material-symbols-outlined text-[#00f0ff] text-[22px]">
            photo_camera
          </span>
          <span className="text-[#e5e2e3] text-sm ml-3 font-medium">
            Kamera / Galeri
          </span>
        </button>
        <button
          onClick={handleAction}
          className="flex items-center py-3 px-4 w-full text-left hover:bg-white/5 transition-colors"
        >
          <span className="material-symbols-outlined text-[#00f0ff] text-[22px]">
            picture_as_pdf
          </span>
          <span className="text-[#e5e2e3] text-sm ml-3 font-medium">
            Belge Seç
          </span>
        </button>
      </div>

      {/* Input Bar */}
      <div className="flex items-end px-3 py-3 mx-4 rounded-3xl border border-white/5 relative z-40 bg-[#161b26]/85 shadow-[0_4px_10px_rgba(0,242,254,0.1)]">
        {/* Toggle Attachments Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 mr-2 shrink-0 hover:bg-white/10 transition-colors"
        >
          <span
            className={`material-symbols-outlined text-[24px] transition-transform duration-200 ${
              isMenuOpen
                ? "text-[#00f0ff] rotate-45"
                : "text-[#b9cacb] rotate-0"
            }`}
          >
            add
          </span>
        </button>

        {/* Expanding Input */}
        <div className="flex-1 bg-white/[0.03] border border-white/10 rounded-2xl flex items-center px-3 min-h-[40px]">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            className="flex-1 text-[#e5e2e3] text-sm py-2 bg-transparent focus:outline-none resize-none max-h-[120px] placeholder-[#849495]/50"
            rows={1}
            style={{
              height: inputText.length > 50 ? "auto" : "40px",
            }}
          />
        </div>

        {/* Send Button */}
        <button
          onClick={() => {
            if (inputText.trim()) {
              handleSend();
              setIsMenuOpen(false);
            }
          }}
          className={`ml-2 w-10 h-10 shrink-0 rounded-full flex items-center justify-center transition-colors ${
            inputText.trim()
              ? "bg-[#00f0ff]/20 text-[#00f0ff]"
              : "bg-white/5 text-[#b9cacb]"
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">send</span>
        </button>
      </div>
    </div>
  );
}
