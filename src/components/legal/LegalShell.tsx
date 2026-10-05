import Link from "next/link";
import type { ReactNode } from "react";

// Herkese açık hukuki sayfaların ortak iskeleti (Gizlilik Politikası, Hesap Silme).
// Kök <body> panel düzeni için `overflow-hidden` kullandığından bu sayfa kendi kaydırma alanını açar.

const CSS = `
.lg-root{position:fixed;inset:0;overflow-y:auto;overflow-x:hidden;scroll-behavior:smooth;color:#e2e8f0;
  background:radial-gradient(900px 500px at 12% -5%,rgba(99,102,241,.22),transparent 60%),radial-gradient(800px 480px at 95% 8%,rgba(236,72,153,.14),transparent 60%),#0b0e14;
  font-family:Inter,system-ui,-apple-system,"Segoe UI",sans-serif}
.lg-top{position:sticky;top:0;z-index:20;backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);background:rgba(11,14,20,.72);border-bottom:1px solid rgba(255,255,255,.07)}
.lg-top-in{max-width:1080px;margin:0 auto;padding:14px 20px;display:flex;align-items:center;justify-content:space-between;gap:12px}
.lg-brand{font-weight:800;letter-spacing:-.02em;color:#fff;font-size:16px}
.lg-brand b{background:linear-gradient(90deg,#FDA4AF,#C4B5FD);-webkit-background-clip:text;background-clip:text;color:transparent}
.lg-back{color:#c7d2fe;font-size:13px;font-weight:600;text-decoration:none;padding:8px 14px;border-radius:999px;border:1px solid rgba(165,180,252,.28);background:rgba(165,180,252,.08);transition:background .15s}
.lg-back:hover{background:rgba(165,180,252,.18)}
.lg-hero{max-width:1080px;margin:0 auto;padding:44px 20px 12px}
.lg-badge{display:inline-flex;align-items:center;gap:8px;font-size:12px;font-weight:700;color:#a5b4fc;background:rgba(165,180,252,.1);border:1px solid rgba(165,180,252,.25);padding:6px 12px;border-radius:999px}
.lg-badge i{width:6px;height:6px;border-radius:50%;background:#22c55e;display:inline-block}
.lg-h1{font-size:clamp(30px,5vw,46px);line-height:1.1;font-weight:900;letter-spacing:-.03em;color:#fff;margin:16px 0 10px}
.lg-sub{font-size:16px;line-height:1.7;color:#94a3b8;max-width:680px}
.lg-body{max-width:1080px;margin:0 auto;padding:24px 20px 80px;display:grid;grid-template-columns:240px minmax(0,1fr);gap:32px;align-items:start}
.lg-body.single{grid-template-columns:minmax(0,760px)}
.lg-toc{position:sticky;top:86px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.03);border-radius:16px;padding:14px}
.lg-toc-t{font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#64748b;font-weight:800;margin:2px 8px 8px}
.lg-toc a{display:block;font-size:13px;line-height:1.35;color:#94a3b8;text-decoration:none;padding:7px 8px;border-radius:8px;transition:background .15s,color .15s}
.lg-toc a:hover{background:rgba(165,180,252,.12);color:#fff}
.lg-card{border:1px solid rgba(255,255,255,.08);background:linear-gradient(180deg,rgba(255,255,255,.045),rgba(255,255,255,.02));border-radius:20px;padding:22px 24px;margin-bottom:16px;scroll-margin-top:86px}
.lg-card h2{font-size:19px;font-weight:800;color:#fff;margin:0 0 12px;letter-spacing:-.01em}
.lg-card p{font-size:15px;line-height:1.75;color:#cbd5e1;margin:0 0 10px}
.lg-card p:last-child{margin-bottom:0}
.lg-card ol,.lg-card ul{margin:0;padding:0;list-style:none}
.lg-card li{display:flex;gap:12px;align-items:flex-start;font-size:15px;line-height:1.65;color:#cbd5e1;padding:8px 0}
.lg-dot{flex:none;width:26px;height:26px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;color:#c7d2fe;background:rgba(165,180,252,.14);border:1px solid rgba(165,180,252,.3);margin-top:1px}
.lg-x{flex:none;width:22px;height:22px;border-radius:7px;display:flex;align-items:center;justify-content:center;font-size:12px;color:#fca5a5;background:rgba(239,68,68,.12);margin-top:2px}
.lg-warn{border-color:rgba(245,158,11,.35);background:linear-gradient(180deg,rgba(245,158,11,.09),rgba(245,158,11,.03))}
.lg-warn h2{color:#fbbf24}
.lg-cta{display:inline-flex;align-items:center;padding:13px 22px;border-radius:14px;background:linear-gradient(135deg,#EF4444,#F59E0B);color:#fff;font-weight:800;text-decoration:none;font-size:15px}
.lg-link{color:#a5b4fc;font-size:14px;text-decoration:none;font-weight:600}
.lg-link:hover{text-decoration:underline}
.lg-foot{max-width:1080px;margin:0 auto;padding:0 20px 40px;color:#475569;font-size:12px}
@media (max-width:860px){.lg-body{grid-template-columns:minmax(0,1fr)}.lg-toc{display:none}.lg-card{padding:18px 18px}.lg-hero{padding-top:30px}}
`;

export default function LegalShell({
  back, title, subtitle, badge, toc, tocTitle, children, single = false,
}: {
  back: string; title: string; subtitle?: string; badge?: string;
  toc?: { id: string; label: string }[]; tocTitle?: string; children: ReactNode; single?: boolean;
}) {
  return (
    <div className="lg-root">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <header className="lg-top">
        <div className="lg-top-in">
          <span className="lg-brand">Workigom <b>Flow</b></span>
          <Link href="/login" className="lg-back">← {back}</Link>
        </div>
      </header>
      <section className="lg-hero">
        {badge ? <span className="lg-badge"><i />{badge}</span> : null}
        <h1 className="lg-h1">{title}</h1>
        {subtitle ? <p className="lg-sub">{subtitle}</p> : null}
      </section>
      <div className={`lg-body${toc && toc.length ? "" : " single"}${single ? " single" : ""}`}>
        {toc && toc.length ? (
          <nav className="lg-toc" aria-label={tocTitle}>
            <div className="lg-toc-t">{tocTitle}</div>
            {toc.map((x) => <a key={x.id} href={`#${x.id}`}>{x.label}</a>)}
          </nav>
        ) : null}
        <div>{children}</div>
      </div>
      <div className="lg-foot">© {new Date().getFullYear()} Workigom Inc.</div>
    </div>
  );
}
