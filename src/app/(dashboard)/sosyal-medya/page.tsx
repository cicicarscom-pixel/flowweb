"use client";

import React, { useEffect, useRef } from "react";

export default function SosyalMedyaPage() {
  const interactionChartRef = useRef<HTMLCanvasElement>(null);
  const dmDonutChartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Interaction Chart Logic
    const canvas = interactionChartRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const setCanvasSize = () => {
          if (canvas.parentElement) {
            canvas.width = canvas.parentElement.clientWidth;
            canvas.height = canvas.parentElement.clientHeight;
            drawChart();
          }
        };

        const drawChart = () => {
          const w = canvas.width;
          const h = canvas.height;
          ctx.clearRect(0, 0, w, h);

          // Draw grid lines
          ctx.strokeStyle = "rgba(255,255,255,0.05)";
          ctx.lineWidth = 1;
          for (let i = 0; i < 5; i++) {
            const y = (h / 5) * i;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
          }

          // Draw Purple Line (Interactions)
          ctx.strokeStyle = "#8b5cf6";
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(0, h * 0.7);
          ctx.bezierCurveTo(w * 0.2, h * 0.8, w * 0.4, h * 0.4, w * 0.6, h * 0.5);
          ctx.bezierCurveTo(w * 0.8, h * 0.6, w * 0.9, h * 0.3, w, h * 0.4);
          ctx.stroke();

          // Draw Blue Line (Posts)
          ctx.strokeStyle = "#60a5fa";
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(0, h * 0.9);
          ctx.bezierCurveTo(w * 0.3, h * 0.85, w * 0.5, h * 0.95, w * 0.7, h * 0.8);
          ctx.bezierCurveTo(w * 0.85, h * 0.75, w * 0.95, h * 0.85, w, h * 0.8);
          ctx.stroke();

          // Dots on lines
          const drawDot = (x: number, y: number, color: string) => {
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = "#1b1b20";
            ctx.lineWidth = 2;
            ctx.stroke();
          };
          drawDot(w * 0.58, h * 0.48, "#8b5cf6");
          drawDot(w * 0.58, h * 0.83, "#60a5fa");
        };

        window.addEventListener("resize", setCanvasSize);
        setCanvasSize();

        return () => window.removeEventListener("resize", setCanvasSize);
      }
    }
  }, []);

  useEffect(() => {
    // Donut Chart Logic
    const donut = dmDonutChartRef.current;
    if (donut) {
      const ctx = donut.getContext("2d");
      if (ctx) {
        donut.width = 128;
        donut.height = 128;

        const centerX = 64;
        const centerY = 64;
        const radius = 50;
        const thickness = 12;

        const drawSegment = (startAngle: number, endAngle: number, color: string) => {
          ctx.beginPath();
          ctx.arc(centerX, centerY, radius, startAngle, endAngle);
          ctx.lineWidth = thickness;
          ctx.strokeStyle = color;
          ctx.stroke();
        };

        // Simulated segments
        drawSegment(-Math.PI / 2, Math.PI * 0.4, "#8b5cf6"); // Purple (Instagram)
        drawSegment(Math.PI * 0.4, Math.PI * 0.9, "#3b82f6"); // Blue (Facebook)
        drawSegment(Math.PI * 0.9, Math.PI * 1.3, "#10b981"); // Emerald (WhatsApp)
        drawSegment(Math.PI * 1.3, Math.PI * 1.5, "#64748b"); // Slate (Diğer)
      }
    }
  }, []);

  return (
    <div className="p-8 pb-24 scrollbar-hide text-white">
      {/* GreetingAndDate */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-xl font-semibold mb-1">Merhaba Volkan! 👋</h2>
          <p className="text-dark-muted text-sm">Tüm hesaplarınızın performansını tek yerden yönetin.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-dark-card border border-dark-border rounded-xl text-sm font-medium hover:bg-dark-border transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
          </svg>
          21 Mayıs - 22 Mayıs 2024
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
          </svg>
        </button>
      </div>

      <div className="space-y-8">
        {/* UPPER SECTION: METRICS & PLATFORM PERFORMANCE */}
        <div className="space-y-6">
          {/* StatsGrid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Followers */}
            <div className="bg-dark-card p-5 rounded-2xl border border-dark-border transition-transform hover:-translate-y-1 hover:shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-brand-primary bg-opacity-10 rounded-xl flex items-center justify-center text-brand-primary">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                  </svg>
                </div>
                <span className="text-xs text-dark-muted">Toplam Takipçi</span>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold">15.670</span>
                <span className="text-[10px] text-green-400 font-medium pb-1.5">↑ %4,2</span>
              </div>
              <p className="text-[10px] text-dark-muted mt-1">Önceki 30 güne göre</p>
            </div>
            {/* Total Interaction */}
            <div className="bg-dark-card p-5 rounded-2xl border border-dark-border transition-transform hover:-translate-y-1 hover:shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-500 bg-opacity-10 rounded-xl flex items-center justify-center text-blue-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                    <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                  </svg>
                </div>
                <span className="text-xs text-dark-muted">Toplam Etkileşim</span>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold">1.248</span>
                <span className="text-[10px] text-green-400 font-medium pb-1.5">↑ %12,8</span>
              </div>
              <p className="text-[10px] text-dark-muted mt-1">Önceki 30 güne göre</p>
            </div>
            {/* Answered DM */}
            <div className="bg-dark-card p-5 rounded-2xl border border-dark-border transition-transform hover:-translate-y-1 hover:shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-pink-500 bg-opacity-10 rounded-xl flex items-center justify-center text-pink-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                  </svg>
                </div>
                <span className="text-xs text-dark-muted">Yanıtlanan DM</span>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold">128</span>
                <span className="text-[10px] text-green-400 font-medium pb-1.5">↑ %18,9</span>
              </div>
              <p className="text-[10px] text-dark-muted mt-1">Önceki 30 güne göre</p>
            </div>
            {/* Total Posts */}
            <div className="bg-dark-card p-5 rounded-2xl border border-dark-border transition-transform hover:-translate-y-1 hover:shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-emerald-500 bg-opacity-10 rounded-xl flex items-center justify-center text-emerald-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                  </svg>
                </div>
                <span className="text-xs text-dark-muted">Toplam Gönderi</span>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold">24</span>
                <span className="text-[10px] text-green-400 font-medium pb-1.5">↑ %9,1</span>
              </div>
              <p className="text-[10px] text-dark-muted mt-1">Önceki 30 güne göre</p>
            </div>
          </div>

          {/* Platform Performance */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Platform Performansı</h3>
              <div className="flex items-center gap-2 bg-dark-card border border-dark-border px-3 py-1.5 rounded-lg">
                <span className="text-xs">Bu Ay</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
              {/* Instagram */}
              <div className="p-5 rounded-2xl border border-brand-primary bg-gradient-to-b from-brand-primary/5 to-transparent flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center text-pink-500">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path>
                      </svg>
                    </div>
                    <span className="text-sm font-medium">Instagram</span>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-[10px] text-dark-muted mb-1 uppercase tracking-wider">Takipçi</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold">12.450</span>
                        <span className="text-[10px] text-green-400">↑ %4,2</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] text-dark-muted mb-1 uppercase tracking-wider">Etkileşim</p>
                      <span className="text-xl font-bold">850</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 h-1.5 w-full bg-dark-border rounded-full overflow-hidden">
                  <div className="h-full bg-brand-primary w-2/3"></div>
                </div>
              </div>
              
              {/* Facebook */}
              <div className="bg-dark-card p-5 rounded-2xl border border-dark-border flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-blue-600/20 flex items-center justify-center text-blue-600">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path>
                      </svg>
                    </div>
                    <span className="text-sm font-medium">Facebook</span>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-[10px] text-dark-muted mb-1 uppercase tracking-wider">Takipçi</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold">3.200</span>
                        <span className="text-[10px] text-green-400">↑ %1,8</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] text-dark-muted mb-1 uppercase tracking-wider">Etkileşim</p>
                      <span className="text-xl font-bold">210</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 h-1.5 w-full bg-dark-border rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 w-1/3"></div>
                </div>
              </div>
              
              {/* X (Twitter) */}
              <div className="bg-dark-card p-5 rounded-2xl border border-dark-border flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"></path>
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-xs">X (Twitter)</span>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-[10px] text-dark-muted mb-1 uppercase tracking-wider">Takipçi</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold">1.850</span>
                        <span className="text-[10px] text-red-400">↓ %0,6</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] text-dark-muted mb-1 uppercase tracking-wider">Etkileşim</p>
                      <span className="text-xl font-bold">98</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 h-1.5 w-full bg-dark-border rounded-full overflow-hidden">
                  <div className="h-full bg-white/50 w-1/4"></div>
                </div>
              </div>

              {/* TikTok */}
              <div className="bg-dark-card p-5 rounded-2xl border border-dark-border flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-cyan-400/20 flex items-center justify-center text-cyan-400">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.525.02c1.31-.032 2.612.008 3.914-.021.052 1.547.662 3.012 1.764 4.078 1.038.98 2.444 1.485 3.797 1.604v4.026c-1.127-.015-2.247-.234-3.3-.675-.634-.27-1.218-.65-1.722-1.127-.04 3.125.006 6.25-.04 9.375-.125 1.956-.913 3.864-2.31 5.228-1.503 1.502-3.642 2.373-5.772 2.39-2.61.054-5.223-1.01-6.845-3.055-1.692-2.062-2.18-5.01-1.254-7.48.966-2.656 3.655-4.52 6.47-4.402.324.015.648.044.97.104v4.183c-.88-.22-1.85-.08-2.63.39-.994.577-1.564 1.684-1.464 2.812.06 1.09.82 2.06 1.86 2.394 1.13.376 2.435.08 3.23-.815.71-.784.97-1.86.84-2.9-.036-3.805-.01-7.611-.02-11.417z"></path>
                      </svg>
                    </div>
                    <span className="text-sm font-medium">TikTok</span>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-[10px] text-dark-muted mb-1 uppercase tracking-wider">Takipçi</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold">2.120</span>
                        <span className="text-[10px] text-green-400">↑ %6,3</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] text-dark-muted mb-1 uppercase tracking-wider">Etkileşim</p>
                      <span className="text-xl font-bold">312</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 h-1.5 w-full bg-dark-border rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-400 w-2/5"></div>
                </div>
              </div>

              {/* Google */}
              <div className="bg-dark-card p-5 rounded-2xl border border-dark-border flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center text-orange-500">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.908 3.152-1.896 4.136-1.248 1.248-3.228 2.532-6.504 2.532-5.244 0-9.384-4.248-9.384-9.492s4.14-9.492 9.384-9.492c2.844 0 4.92 1.116 6.444 2.568l2.316-2.316C18.6 1.2 15.864 0 12.48 0 5.688 0 0 5.688 0 12.5s5.688 12.5 12.48 12.5c3.672 0 6.444-1.2 8.628-3.48 2.244-2.244 2.952-5.4 2.952-8.016 0-.768-.06-1.488-.18-2.184H12.48z"></path>
                      </svg>
                    </div>
                    <span className="text-sm font-medium">Google</span>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-[10px] text-dark-muted mb-1 uppercase tracking-wider">Yorum</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold">428</span>
                        <span className="text-[10px] text-green-400">↑ %12</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] text-dark-muted mb-1 uppercase tracking-wider">Puan</p>
                      <div className="flex items-center gap-1">
                        <span className="text-xl font-bold">4,8</span>
                        <div className="flex text-yellow-500">
                          {[...Array(4)].map((_, i) => (
                            <svg key={i} className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                            </svg>
                          ))}
                          <svg className="w-3 h-3 fill-current opacity-30" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 h-1.5 w-full bg-dark-border rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 w-4/5"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* LOWER SECTION: CHARTS & MANAGEMENT */}
        <div className="grid grid-cols-12 gap-6 pb-8">
          {/* Left Column: Main Charts */}
          <div className="col-span-12 lg:col-span-9 space-y-6">
            
            {/* InteractionChart */}
            <div className="bg-dark-card p-6 rounded-2xl border border-dark-border relative h-[400px]">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold">Etkileşim Grafiği</h3>
                  <svg className="w-4 h-4 text-dark-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                  </svg>
                </div>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-brand-primary"></div>
                    <span className="text-xs text-dark-muted">Etkileşim</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                    <span className="text-xs text-dark-muted">Gönderi</span>
                  </div>
                </div>
              </div>
              <div className="h-64 w-full relative">
                <canvas ref={interactionChartRef} id="interactionChart"></canvas>
                {/* Tooltip Overlay */}
                <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-dark-surface/90 border border-dark-border p-3 rounded-xl shadow-2xl backdrop-blur-md z-10 w-48 pointer-events-none">
                  <div className="text-[10px] text-dark-muted mb-2">20 Mayıs 2024</div>
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-brand-primary"></div>
                      <span className="text-xs">Etkileşim</span>
                    </div>
                    <span className="text-xs font-bold">620</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                      <span className="text-xs">Gönderi</span>
                    </div>
                    <span className="text-xs font-bold">18</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* RecentPosts */}
              <div className="bg-dark-card p-6 rounded-2xl border border-dark-border flex flex-col h-full">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Son Gönderiler</h3>
                  <button className="text-xs text-brand-primary font-medium hover:underline">Tümünü Gör</button>
                </div>
                <div className="space-y-5 flex-1">
                  {/* Post 1 */}
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img alt="Post thumbnail" className="w-14 h-14 rounded-xl object-cover border border-dark-border" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCe4VqGzCl4Neee0L7uQsHduE4fA3Ow1e6Lnb4SrAIwcTgk3rZd_vduBnSGoyTOpqjyf-P3hv579mkQG88Ljbd0LDhKiW-Gvr0s1HEVq9n1QRBFMYvZHPGJQk5YfzSkAIVWfQcBryqJP3SZOhL8FKkNtIS_I3_ND3zGnMwTf_j7rk4T71ntGcm77e5o5REREHyWbfloEStAE6SbQUf2bHgJjkGzDFlnX8UXAp0Q_6G789g80IOHvRgS" />
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-pink-500 rounded-lg flex items-center justify-center text-[10px] border-2 border-dark-card">
                        <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path>
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">Yeni koleksiyonumuz yayında! ✨</p>
                      <p className="text-[10px] text-dark-muted">22 Mayıs 2024 • 14:30</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] font-bold">254</span>
                        <svg className="w-3 h-3 text-dark-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                        </svg>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] font-bold">48</span>
                        <svg className="w-3 h-3 text-dark-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                        </svg>
                      </div>
                      <button className="text-dark-muted hover:text-white transition-colors">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path>
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Post 2 */}
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img alt="Post thumbnail" className="w-14 h-14 rounded-xl object-cover border border-dark-border" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAiJSnHHnx0F-Ah0R0vTykbb1tBCK_MZaIqXsRSzufTfmXaskprhwt3sw4_CL6BpLK-2YKsb9MLOCZpQJZhLqOiS_WWQtNvKltUsdmCFgLbq4KZHqDVs0BuUjD_FpLI8GlNssut9lIUpmD2LnHmnuPNQTKFbhTgQZn6e_JaF18OF9UOh_IOzBOtmBf6McfGP0_J5CrgwkfY6fLALjLr48b6rA89zTpz_4UlnvwhV2ObDoZuKotWCr5w" />
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-600 rounded-lg flex items-center justify-center text-[10px] border-2 border-dark-card">
                        <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path>
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">Haftanın fırsatlarını kaçırmayın!</p>
                      <p className="text-[10px] text-dark-muted">22 Mayıs 2024 • 10:15</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] font-bold">126</span>
                        <svg className="w-3 h-3 text-dark-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                        </svg>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] font-bold">19</span>
                        <svg className="w-3 h-3 text-dark-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                        </svg>
                      </div>
                      <button className="text-dark-muted hover:text-white transition-colors">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path>
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Post 3 */}
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img alt="Post thumbnail" className="w-14 h-14 rounded-xl object-cover border border-dark-border" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDO5Cq7zgFaAhnKA5JH-bapDPUb5Mib3jwftOTDJG3z5QvdPSFn_kdqKe-UT2v97flKbPuFFkTe6kizIzBpq5xHArgslcDFUORPOFaD07rX9R_Aubl4pQ1tXrSryc9CUlspSORarMGsidej1ckFNwoHHLG97L8D3Y5xfHFHoHsPIRp52giDNYt2krw5bauG6jiYpAgTuZH-IAfb_aPAOsWZaNCmLgPxKvniNzjlIg5uZjdryXEac9ca" />
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-black rounded-lg flex items-center justify-center text-[10px] border-2 border-dark-card">
                        <svg className="w-2.5 h-2.5 fill-white" viewBox="0 0 24 24">
                          <path d="M12.525.02c1.31-.032 2.612.008 3.914-.021.052 1.547.662 3.012 1.764 4.078 1.038.98 2.444 1.485 3.797 1.604v4.026c-1.127-.015-2.247-.234-3.3-.675-.634-.27-1.218-.65-1.722-1.127-.04 3.125.006 6.25-.04 9.375-.125 1.956-.913 3.864-2.31 5.228-1.503 1.502-3.642 2.373-5.772 2.39-2.61.054-5.223-1.01-6.845-3.055-1.692-2.062-2.18-5.01-1.254-7.48.966-2.656 3.655-4.52 6.47-4.402.324.015.648.044.97.104v4.183c-.88-.22-1.85-.08-2.63.39-.994.577-1.564 1.684-1.464 2.812.06 1.09.82 2.06 1.86 2.394 1.13.376 2.435.08 3.23-.815.71-.784.97-1.86.84-2.9-.036-3.805-.01-7.611-.02-11.417z"></path>
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">Behind the scenes 🎬</p>
                      <p className="text-[10px] text-dark-muted">21 Mayıs 2024 • 18:45</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] font-bold">312</span>
                        <svg className="w-3 h-3 text-dark-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                        </svg>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] font-bold">37</span>
                        <svg className="w-3 h-3 text-dark-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                        </svg>
                      </div>
                      <button className="text-dark-muted hover:text-white transition-colors">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* DMMessageSummary */}
              <div className="bg-dark-card p-6 rounded-2xl border border-dark-border flex flex-col h-full">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">DM &amp; Mesaj Özeti</h3>
                  <button className="text-xs text-brand-primary font-medium hover:underline">Tümünü Gör</button>
                </div>
                <div className="flex-1 flex items-center justify-center gap-8 mb-6">
                  <div className="relative w-32 h-32">
                    <canvas ref={dmDonutChartRef} id="dmDonutChart"></canvas>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold">128</span>
                      <span className="text-[10px] text-dark-muted">Toplam</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-6 justify-between w-40">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-brand-primary"></div>
                        <span className="text-[10px] text-dark-muted">Instagram DM</span>
                      </div>
                      <span className="text-xs font-bold">72</span>
                    </div>
                    <div className="flex items-center gap-6 justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <span className="text-[10px] text-dark-muted">Facebook DM</span>
                      </div>
                      <span className="text-xs font-bold">28</span>
                    </div>
                    <div className="flex items-center gap-6 justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                        <span className="text-[10px] text-dark-muted">WhatsApp</span>
                      </div>
                      <span className="text-xs font-bold">18</span>
                    </div>
                    <div className="flex items-center gap-6 justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-slate-500"></div>
                        <span className="text-[10px] text-dark-muted">Diğer</span>
                      </div>
                      <span className="text-xs font-bold">10</span>
                    </div>
                  </div>
                </div>
                <div className="mt-auto pt-4 border-t border-dark-border flex items-center gap-3">
                  <div className="w-10 h-10 bg-dark-surface rounded-xl flex items-center justify-center text-brand-primary border border-dark-border">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium">Yanıt süresi ortalaması: <span className="font-bold">1sa 24dk</span></p>
                    <p className="text-[10px] text-green-400">Önceki 30 güne göre %18 daha hızlı</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Account Management */}
          <div className="col-span-12 lg:col-span-3 space-y-6">
            
            {/* AccountsSection */}
            <div className="bg-dark-card p-5 rounded-2xl border border-dark-border">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-semibold">Hesaplarınız</h3>
                <button className="text-[10px] text-dark-muted bg-dark-surface px-2 py-1 rounded-md border border-dark-border hover:text-white transition-colors">Hesap Yönetimi</button>
              </div>
              <div className="space-y-4 mb-6">
                
                {/* Account Item */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center text-pink-500">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path>
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-semibold">@workigom.com.tr</p>
                      <p className="text-[10px] text-dark-muted flex items-center gap-1">Instagram Business <span className="text-green-400">• Aktif</span></p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="text-[10px] font-medium bg-dark-surface px-2 py-1 rounded-md border border-dark-border hover:text-white transition-colors">Analiz</button>
                    <button className="text-dark-muted hover:text-white transition-colors">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path>
                      </svg>
                    </button>
                  </div>
                </div>
                
                {/* Account Item */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-600/20 flex items-center justify-center text-blue-600">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path>
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-semibold">@workigom</p>
                      <p className="text-[10px] text-dark-muted flex items-center gap-1">Facebook Page <span className="text-green-400">• Aktif</span></p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="text-[10px] font-medium bg-dark-surface px-2 py-1 rounded-md border border-dark-border hover:text-white transition-colors">Analiz</button>
                    <button className="text-dark-muted hover:text-white transition-colors">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path>
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Account Item */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"></path>
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-semibold">@workigom_com</p>
                      <p className="text-[10px] text-dark-muted flex items-center gap-1">X (Twitter) <span className="text-green-400">• Aktif</span></p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="text-[10px] font-medium bg-dark-surface px-2 py-1 rounded-md border border-dark-border hover:text-white transition-colors">Analiz</button>
                    <button className="text-dark-muted hover:text-white transition-colors">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              <button className="w-full py-2.5 bg-dark-surface border border-dark-border rounded-xl text-xs font-medium hover:bg-dark-border transition-all flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
                Hesap Bağla
              </button>
            </div>

            {/* AIUsageSummary */}
            <div className="bg-dark-card p-5 rounded-2xl border border-dark-border">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-semibold">AI Kullanım Özeti</h3>
                <div className="flex items-center gap-1 bg-dark-surface px-2 py-1 rounded-md border border-dark-border">
                  <span className="text-[10px]">Bu Ay</span>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                  </svg>
                </div>
              </div>
              <div className="space-y-6 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center text-orange-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                      </svg>
                    </div>
                    <span className="text-xs text-dark-muted">Gönderi</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-bold text-green-400">24</span>
                    <svg className="w-12 h-6 text-green-400" fill="none" viewBox="0 0 100 30">
                      <path d="M0 25 C20 20, 40 10, 60 15 S 80 5, 100 10" fill="none" stroke="currentColor" strokeWidth="2"></path>
                    </svg>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                        <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                      </svg>
                    </div>
                    <span className="text-xs text-dark-muted">Etkileşim</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-bold text-blue-400">352</span>
                    <svg className="w-12 h-6 text-blue-400" fill="none" viewBox="0 0 100 30">
                      <path d="M0 10 C20 15, 40 25, 60 10 S 80 15, 100 5" fill="none" stroke="currentColor" strokeWidth="2"></path>
                    </svg>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center text-pink-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                      </svg>
                    </div>
                    <span className="text-xs text-dark-muted whitespace-nowrap">Yanıtlanan DM</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-bold text-brand-primary">128</span>
                    <svg className="w-12 h-6 text-brand-primary" fill="none" viewBox="0 0 100 30">
                      <path d="M0 15 C20 10, 40 10, 60 20 S 80 10, 100 15" fill="none" stroke="currentColor" strokeWidth="2"></path>
                    </svg>
                  </div>
                </div>
              </div>
              <button className="w-full py-2.5 bg-dark-surface border border-dark-border rounded-xl text-xs font-medium hover:text-brand-primary transition-colors flex items-center justify-center gap-2">
                Detaylı Analiz Raporu
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
              </button>
            </div>
            
            {/* SyncPromo */}
            <div className="bg-dark-card p-6 rounded-2xl border border-dark-border text-center space-y-4">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 mx-auto">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
              </div>
              <h4 className="font-bold">Senkronize Et</h4>
              <p className="text-xs text-dark-muted px-4 leading-relaxed">Tüm hesaplarınızı senkronize ederek en güncel verilere ulaşın.</p>
              <button className="w-full py-3 bg-gradient-to-r from-brand-secondary to-brand-primary rounded-xl text-sm font-bold text-white shadow-lg shadow-brand-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                Şimdi Senkronize Et
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
