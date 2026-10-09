"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Flow AI web paneli için eller serbest sesli sohbet (tarayıcının Web Speech API'si; ek paket yok).
// Döngü: dinle → cümle bitince onFinal → panel yanıtı alır → speak(yanıt) okur → bitince yeniden dinler.
// Tanıma yalnız kullanıcı mikrofon düğmesine basınca başlar (tarayıcı izni + oto-oynatma kuralı).

export type VoicePhase = "OFF" | "LISTENING" | "THINKING" | "SPEAKING";
export type VoiceExit = "user" | "permission" | "silence" | "error";

const MAX_SILENT_ROUNDS = 3;

function stripForSpeech(text: string): string {
  return String(text || "").replace(/[*_`#>]+/g, " ").replace(/\s+/g, " ").trim();
}

// Chrome uzun konuşmayı ~15 sn'de keser; cümle cümle okunur.
function chunkText(text: string): string[] {
  const parts = text.match(/[^.!?\n]+[.!?]*/g) || [text];
  const out: string[] = [];
  let cur = "";
  for (const p of parts) {
    if ((cur + p).length > 180 && cur) { out.push(cur.trim()); cur = p; } else { cur += p; }
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}

export function useWebVoice(opts: { lang: string; onFinal: (text: string) => void; onPartial?: (text: string) => void; onExit?: (reason: VoiceExit) => void; isBusy?: () => boolean }) {
  const [supported, setSupported] = useState(false);
  const [phase, setPhase] = useState<VoicePhase>("OFF");
  const optsRef = useRef(opts);
  optsRef.current = opts;
  const activeRef = useRef(false);
  const recRef = useRef<any>(null);
  const silentRef = useRef(0);
  const genRef = useRef(0); // her dinleme turu bir nesil; eski turun geç gelen olayları yok sayılır

  useEffect(() => {
    const w = window as any;
    setSupported(!!(w.SpeechRecognition || w.webkitSpeechRecognition) && "speechSynthesis" in window);
  }, []);

  const halt = useCallback((reason: VoiceExit) => {
    const wasActive = activeRef.current;
    activeRef.current = false;
    try { recRef.current?.abort(); } catch { /* zaten durmuş */ }
    recRef.current = null;
    try { window.speechSynthesis?.cancel(); } catch { /* yok */ }
    setPhase("OFF");
    if (wasActive) optsRef.current.onExit?.(reason);
  }, []);

  const listen = useCallback(() => {
    if (!activeRef.current) return;
    const w = window as any;
    const Ctor = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!Ctor) return;
    const gen = ++genRef.current;
    try { recRef.current?.abort(); } catch { /* zaten durmuş */ }
    const rec = new Ctor();
    rec.lang = optsRef.current.lang;
    rec.interimResults = true;
    rec.continuous = false;
    rec.maxAlternatives = 1;
    let last = "";
    let delivered = false;
    const deliver = (txt: string) => {
      delivered = true;
      silentRef.current = 0;
      setPhase("THINKING");
      optsRef.current.onFinal(txt);
    };
    rec.onresult = (e: any) => {
      if (gen !== genRef.current) return;
      const r = e.results[e.results.length - 1];
      const txt = String(r?.[0]?.transcript || "");
      last = txt;
      if (r.isFinal) { if (!delivered && txt.trim()) deliver(txt.trim()); } else { optsRef.current.onPartial?.(txt); }
    };
    rec.onerror = (e: any) => {
      if (gen !== genRef.current) return;
      if (e.error === "no-speech" || e.error === "aborted") return;
      if (e.error === "not-allowed" || e.error === "service-not-allowed") { halt("permission"); return; }
      halt("error");
    };
    rec.onend = () => {
      if (gen !== genRef.current) return;
      if (recRef.current === rec) recRef.current = null;
      if (!activeRef.current || delivered) return;
      if (last.trim()) { deliver(last.trim()); return; }
      // Yanıt beklenirken (düşünüyor) sessizlik sayılmaz; dinleme sürer, söylenenler kuyruğa girer.
      if (optsRef.current.isBusy?.()) { listen(); return; }
      silentRef.current += 1;
      if (silentRef.current >= MAX_SILENT_ROUNDS) { halt("silence"); return; }
      listen();
    };
    recRef.current = rec;
    setPhase("LISTENING");
    try { rec.start(); } catch { halt("error"); }
  }, [halt]);

  const start = useCallback(() => {
    if (activeRef.current) return;
    activeRef.current = true;
    silentRef.current = 0;
    listen();
  }, [listen]);

  const stop = useCallback(() => halt("user"), [halt]);

  /** Yanıtı sesli okur; bitince (ya da okunamazsa) yeniden dinler. Sohbet kapalıysa hiçbir şey yapmaz. */
  const speak = useCallback((text: string) => {
    if (!activeRef.current) return;
    const clean = stripForSpeech(text);
    const synth = window.speechSynthesis;
    if (!clean || !synth) { listen(); return; }
    const chunks = chunkText(clean);
    genRef.current += 1; // okurken mikrofon kapalı: yankıyı dinlemeyelim
    try { recRef.current?.abort(); } catch { /* */ }
    recRef.current = null;
    const voices = synth.getVoices();
    const base = optsRef.current.lang.split("-")[0];
    const voice = voices.find((v) => v.lang === optsRef.current.lang) || voices.find((v) => v.lang.startsWith(base));
    setPhase("SPEAKING");
    synth.cancel();
    chunks.forEach((c, i) => {
      const u = new SpeechSynthesisUtterance(c);
      u.lang = optsRef.current.lang;
      if (voice) u.voice = voice;
      const done = () => { if (i === chunks.length - 1 && activeRef.current) listen(); };
      u.onend = done;
      u.onerror = done;
      synth.speak(u);
    });
  }, [listen]);

  /** Yanıt okunmadan yeniden dinlemeye dön (ör. hata oldu). */
  const resume = useCallback(() => { listen(); }, [listen]);

  useEffect(() => () => { activeRef.current = false; try { recRef.current?.abort(); } catch { /* */ } try { window.speechSynthesis?.cancel(); } catch { /* */ } }, []);

  return { supported, phase, active: phase !== "OFF", start, stop, speak, resume };
}
