import re

with open('src/components/flow-ai/FlowAiPanel.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

# Add import
import_stmt = 'import { flowAiShareHandoff } from "@/lib/flowAiShareHandoff";\n'
code = code.replace('import { createClient } from "@/lib/supabase/client";', 
                    'import { createClient } from "@/lib/supabase/client";\n' + import_stmt)

# Add state variables
state_vars = """
  const [shareJobPending, setShareJobPending] = useState<any | null>(null);
  const [attachmentMeta, setAttachmentMeta] = useState<{ kind: "video"; mimeType: string; durationSec: number; width: number; height: number; sizeBytes: number; fileName: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [shareConfirmState, setShareConfirmState] = useState<'IDLE' | 'NOT_READY' | 'STARTED'>('IDLE');
"""
code = code.replace('const [pos, setPos] = useState({ x: 0, y: 0 });', 
                    'const [pos, setPos] = useState({ x: 0, y: 0 });' + state_vars)

# Update send payload
code = code.replace('const res = await call({ action: "chat", message: text, conversationId: conversationId.current || undefined });',
                    'const res = await call({ action: "chat", message: text, conversationId: conversationId.current || undefined, attachment: attachmentMeta || undefined });')

# Update dispatch to handle share_video
dispatch_logic = """
  const dispatch = useCallback((action: any) => {
    if (action?.type === "navigate" && Object.prototype.hasOwnProperty.call(SCREEN_ROUTES, action.screen)) {
      router.push(SCREEN_ROUTES[action.screen]);
    } else if (action?.type === "share_video") {
      const att = flowAiShareHandoff.getFile();
      if (!att) return;
      const isValidString = (s: any) => typeof s === "string" && s.length <= 5000;
      const isValidPlatformList = (arr: any) => Array.isArray(arr) && arr.length <= 10 && arr.every((x) => typeof x === "string");
      const isValidSkippedList = (arr: any) => Array.isArray(arr) && arr.length <= 10 && arr.every((x) => typeof x.platform === "string" && typeof x.reason === "string");
      
      const { caption, platforms, skipped, scheduledLocal, timezone } = action;
      if (!isValidString(caption) || !isValidPlatformList(platforms) || (skipped && !isValidSkippedList(skipped))) {
        return;
      }
      if (scheduledLocal && typeof scheduledLocal !== "string") return;
      if (typeof timezone !== "string") return;
      
      const job = { caption, platforms, skipped: skipped || [], scheduledLocal: scheduledLocal || null, timezone };
      flowAiShareHandoff.setJob(job);
      setShareJobPending(job);
      router.push(SCREEN_ROUTES.ai_uretim);
    }
  }, [router]);
"""
code = re.sub(r'const dispatch = useCallback\(\(action: any\) => \{.*?\},\s*\[router\]\);', dispatch_logic, code, flags=re.DOTALL)

# Listeners and file upload logic
effects = """
  useEffect(() => {
    const onShareResult = (e: any) => {
      const detail = e.detail;
      if (detail?.ok) {
        push("assistant", shareJobPending?.scheduledLocal ? t("share.scheduled") : t("share.done"));
      } else {
        push("error", t("share.failed", { message: detail?.message || "" }));
      }
      setShareJobPending(null);
      setAttachmentMeta(null);
      setShareConfirmState('IDLE');
      flowAiShareHandoff.clear();
      if (fileInputRef.current) fileInputRef.current.value = "";
    };
    window.addEventListener("flowai:share-result", onShareResult);
    return () => window.removeEventListener("flowai:share-result", onShareResult);
  }, [push, shareJobPending, t]);

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const isVideo = file.type.startsWith('video/');
    if (!isVideo) return;
    
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(video.src);
      const meta = {
        kind: "video" as const,
        mimeType: file.type,
        durationSec: video.duration,
        width: video.videoWidth,
        height: video.videoHeight,
        sizeBytes: file.size,
        fileName: file.name.substring(0, 120)
      };
      setAttachmentMeta(meta);
      flowAiShareHandoff.attach(file);
    };
    video.onerror = () => {
      push("error", t("share.unreadable"));
    };
    video.src = URL.createObjectURL(file);
  };
"""
code = code.replace('useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, busy, pending]);', 
                    'useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, busy, pending]);\n' + effects)

# Render confirmation card
card_render = """
        {shareJobPending && (
          <div style={{ ...box, padding: 12, borderColor: "rgba(34,181,115,0.4)", marginTop: 8 }}>
            <div style={{ color: "#22B573", fontWeight: 700, fontSize: 13, marginBottom: 8 }}>{t("share.cardTitle")}</div>
            <div style={{ fontSize: 12, color: "#D7DEE7", marginBottom: 8 }}>
              <div style={{ fontWeight: 600, color: "#9FB0C3" }}>{t("share.cardPlatforms")}:</div>
              {shareJobPending.platforms.join(", ")}
            </div>
            {shareJobPending.skipped && shareJobPending.skipped.length > 0 && (
              <div style={{ fontSize: 11, color: "#A79E96", marginBottom: 8, padding: 6, background: "rgba(255,255,255,0.03)", borderRadius: 6 }}>
                <div style={{ fontWeight: 600, color: "#8B949E", marginBottom: 2 }}>{t("share.cardSkipped")}:</div>
                {shareJobPending.skipped.map((s: any, i: number) => (
                  <div key={i}>• {cap(s.platform)}: {s.reason}</div>
                ))}
              </div>
            )}
            <div style={{ fontSize: 12, color: "#D7DEE7", marginBottom: 12 }}>
              <div style={{ fontWeight: 600, color: "#9FB0C3" }}>{t("share.cardWhen")}:</div>
              {shareJobPending.scheduledLocal ? shareJobPending.scheduledLocal : t("share.now")}
            </div>
            
            {shareConfirmState === 'NOT_READY' && (
              <div style={{ fontSize: 11, color: "#FF7A59", marginBottom: 8 }}>{t("share.notReady")}</div>
            )}

            <div style={{ display: "flex", gap: 6 }}>
              <button type="button" disabled={shareConfirmState === 'STARTED'} onClick={async () => {
                const state = await flowAiShareHandoff.confirm();
                setShareConfirmState(state);
              }} style={{ flex: 1, padding: "8px 0", borderRadius: 8, border: "none", background: "#22B573", color: "#000", fontWeight: 700, cursor: shareConfirmState === 'STARTED' ? "not-allowed" : "pointer", opacity: shareConfirmState === 'STARTED' ? 0.6 : 1 }}>
                {shareConfirmState === 'STARTED' ? t("share.sharing") : t("share.confirm")}
              </button>
              <button type="button" disabled={shareConfirmState === 'STARTED'} onClick={() => {
                setShareJobPending(null);
                setShareConfirmState('IDLE');
                flowAiShareHandoff.setJob(null as any);
              }} style={{ padding: "8px 12px", borderRadius: 8, border: "none", background: "rgba(255,255,255,0.1)", color: "#fff", fontWeight: 600, cursor: shareConfirmState === 'STARTED' ? "not-allowed" : "pointer" }}>
                {t("share.cancel")}
              </button>
            </div>
          </div>
        )}
        <div ref={endRef} />
"""
code = code.replace('<div ref={endRef} />', card_render)

# Render attachment
attachment_render = """
      {attachmentMeta && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: "rgba(34,181,115,0.1)", borderTop: "1px solid rgba(34,181,115,0.2)", fontSize: 12, color: "#22B573" }}>
          <i className="fa-solid fa-video"></i>
          <div style={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {t("share.attachedLabel")}: {attachmentMeta.fileName} ({Math.round(attachmentMeta.durationSec)}s)
          </div>
          <button type="button" onClick={() => { setAttachmentMeta(null); flowAiShareHandoff.clear(); if(fileInputRef.current) fileInputRef.current.value=""; }} style={{ background: "none", border: "none", color: "#22B573", cursor: "pointer", padding: "0 4px" }}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
      )}
      <form
"""
code = code.replace('<form\n', attachment_render)

# Render attachment button inside form
attachment_btn = """
        <input type="file" ref={fileInputRef} accept="video/mp4,video/quicktime,video/webm" hidden onChange={handleVideoSelect} />
        <button type="button" onClick={() => fileInputRef.current?.click()} aria-label={t("share.attach")} style={{ width: 42, height: 42, borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.035)", color: "#8B949E", cursor: "pointer" }}>
          <i className="fa-solid fa-paperclip"></i>
        </button>
        <input
"""
code = code.replace('<input\n          value={input}', attachment_btn)

with open('src/components/flow-ai/FlowAiPanel.tsx', 'w', encoding='utf-8') as f:
    f.write(code)
