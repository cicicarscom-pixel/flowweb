"use client";

import React, { useState, useRef, KeyboardEvent } from "react";
import Image from "next/image";

interface AiChatInputProps {
  inputText: string;
  setInputText: (text: string) => void;
  handleSend: (text: string, file: File | null) => void;
  placeholder?: string;
}

export default function AiChatInput({
  inputText,
  setInputText,
  handleSend,
  placeholder = "İşlemi yazın...",
}: AiChatInputProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAction = () => {
    setIsMenuOpen(false);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setAttachedFile(file);

      // Create preview URL if it's an image
      if (file.type.startsWith("image/")) {
        setFilePreview(URL.createObjectURL(file));
      } else {
        setFilePreview(null);
      }
    }
  };

  const clearAttachment = () => {
    setAttachedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSend = () => {
    if (inputText.trim() || attachedFile) {
      handleSend(inputText, attachedFile);
      setIsMenuOpen(false);
      clearAttachment();
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
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

      {/* Input Container (Gemini Style) */}
      <div className="flex flex-col bg-[#1e1f20] rounded-[32px] mx-4 border border-white/5 relative z-40 transition-all duration-300">
        {/* File Preview Area */}
        {attachedFile && (
          <div className="px-5 pt-4 pb-1">
            <div className="relative w-16 h-16 rounded-xl border border-white/10 bg-[#131314] overflow-hidden group">
              {filePreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={filePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-gray-400">
                    description
                  </span>
                </div>
              )}
              <button
                onClick={clearAttachment}
                className="absolute -top-1 -right-1 w-5 h-5 bg-[#1e1f20] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border border-white/20"
              >
                <span className="material-symbols-outlined text-[14px] text-white">
                  close
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Text Area & Buttons Row */}
        <div className="flex flex-row items-end px-3 py-3 min-h-[64px]">
          {/* Left Actions (Add Button) */}
          <div className="relative pr-2 shrink-0 pb-[2px]">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/5 transition-colors"
            >
              <span
                className={`material-symbols-outlined text-[24px] transition-transform duration-200 ${isMenuOpen ? "text-[#e3e3e3] rotate-45" : "text-[#c4c7c5] rotate-0"}`}
              >
                add
              </span>
            </button>

            {/* Floating Menu anchored to Add button */}
            <div
              className={`absolute bottom-14 left-0 bg-[#282a2c] rounded-2xl py-2 w-48 shadow-xl border border-white/5 transition-all duration-200 z-50 ${
                isMenuOpen
                  ? "opacity-100 translate-y-0 pointer-events-auto"
                  : "opacity-0 translate-y-2 pointer-events-none"
              }`}
            >
              <button
                onClick={handleAction}
                className="flex items-center py-2 px-4 w-full text-left hover:bg-white/5 transition-colors"
              >
                <span className="material-symbols-outlined text-[#c4c7c5] text-[20px]">
                  photo_camera
                </span>
                <span className="text-[#e3e3e3] text-sm ml-3">
                  Dosya yükleyin
                </span>
              </button>
              <button
                onClick={handleAction}
                className="flex items-center py-2 px-4 w-full text-left hover:bg-white/5 transition-colors"
              >
                <span className="material-symbols-outlined text-[#c4c7c5] text-[20px]">
                  picture_as_pdf
                </span>
                <span className="text-[#e3e3e3] text-sm ml-3">Belge seçin</span>
              </button>
            </div>
          </div>

          {/* Text Area */}
          <div className="flex-1 pb-1">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder={placeholder}
                className="w-full text-[#e3e3e3] text-[20px] leading-[30px] bg-transparent focus:outline-none focus:ring-0 border-0 outline-none resize-none overflow-hidden max-h-[150px] placeholder-[#8e9194] px-1"
                rows={1}
                style={{
                  height: inputText.length > 30 ? "auto" : "30px",
                }}
              />
          </div>

          {/* Right Actions (Send Button) */}
          <div className="pl-2 shrink-0 pb-[2px]">
            <button
              onClick={onSend}
              disabled={!inputText.trim() && !attachedFile}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                inputText.trim() || attachedFile
                  ? "bg-white/10 text-[#e3e3e3] hover:bg-white/20"
                  : "text-[#444746]"
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">
                arrow_upward
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
