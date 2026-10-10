"use client";

import React from "react";
import {
  LineChart, Line, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, ScatterChart, Scatter, ZAxis
} from "recharts";
import type { useTranslations } from "next-intl";
import { CustomTooltip } from "./CustomTooltip";
import type { ZernioData, InternalStats } from "./useAnalyticsData";

type T = ReturnType<typeof useTranslations>;

export type InboxAnalyticsProps = {
  t: T;
  zernioData: ZernioData;
  stats: InternalStats;
};

export function InboxAnalytics({ t, zernioData, stats }: InboxAnalyticsProps) {
    const vol = zernioData.inboxVolume || {};
    const sumVol = vol.summary || {
      received: stats.messagesReceived || 0,
      sent: stats.messagesSent || 0,
      read: 0,
      failed: 0,
      uniqueConversations: 0
    };
    
    const perf = zernioData.inboxPerformance || {};
    const medianResp = perf.medianResponseSeconds || 0;
    const formatTime = (secs: number) => {
       if (!secs) return "-";
       if (secs < 60) return `${secs}s`;
       const m = Math.floor(secs / 60);
       const s = secs % 60;
       if (m < 60) return `${m}m ${s}s`;
       const h = Math.floor(m / 60);
       const rm = m % 60;
       return `${h}h ${rm}m`;
    };

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 24, paddingBottom: 60 }}>
        {/* Top KPIs */}
        <div className="glass" style={{ borderRadius: 8, padding: "16px 24px", border: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
           <div style={{ flex: 1, minWidth: 100 }}>
              <div style={{ color: "var(--text-secondary)", fontSize: 13, marginBottom: 8 }}>{t("analizPage.inbox2.received")}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <i className="fa-solid fa-inbox" style={{ color: "#22B573" }} />
                <span style={{ fontSize: 20, fontWeight: 700, color: "#F6F1EC" }}>{sumVol.received || 0}</span>
              </div>
           </div>
           <div style={{ width: 1, background: "rgba(255,255,255,0.08)" }} />
           <div style={{ flex: 1, minWidth: 100 }}>
              <div style={{ color: "var(--text-secondary)", fontSize: 13, marginBottom: 8 }}>{t("analizPage.inbox2.sent")}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <i className="fa-regular fa-paper-plane" style={{ color: "#3B82F6" }} />
                <span style={{ fontSize: 20, fontWeight: 700, color: "#F6F1EC" }}>{sumVol.sent || 0}</span>
              </div>
           </div>
           <div style={{ width: 1, background: "rgba(255,255,255,0.08)" }} />
           <div style={{ flex: 1, minWidth: 100 }}>
              <div style={{ color: "var(--text-secondary)", fontSize: 13, marginBottom: 8 }}>{t("analizPage.inbox2.read")}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <i className="fa-regular fa-eye" style={{ color: "#8B5CF6" }} />
                <span style={{ fontSize: 20, fontWeight: 700, color: "#F6F1EC" }}>{sumVol.read || 0}</span>
              </div>
           </div>
           <div style={{ width: 1, background: "rgba(255,255,255,0.08)" }} />
           <div style={{ flex: 1, minWidth: 100 }}>
              <div style={{ color: "var(--text-secondary)", fontSize: 13, marginBottom: 8 }}>{t("analizPage.inbox2.failed")}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <i className="fa-solid fa-triangle-exclamation" style={{ color: "#F59E0B" }} />
                <span style={{ fontSize: 20, fontWeight: 700, color: "#F6F1EC" }}>{sumVol.failed || 0}</span>
              </div>
           </div>
           <div style={{ width: 1, background: "rgba(255,255,255,0.08)" }} />
           <div style={{ flex: 1, minWidth: 100 }}>
              <div style={{ color: "var(--text-secondary)", fontSize: 13, marginBottom: 8 }}>{t("analizPage.inbox2.conversations")}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <i className="fa-regular fa-comments" style={{ color: "#C2478D" }} />
                <span style={{ fontSize: 20, fontWeight: 700, color: "#F6F1EC" }}>{sumVol.uniqueConversations || 0}</span>
              </div>
           </div>
           <div style={{ width: 1, background: "rgba(255,255,255,0.08)" }} />
           <div style={{ flex: 1, minWidth: 100 }}>
              <div style={{ color: "var(--text-secondary)", fontSize: 13, marginBottom: 8 }}>{t("analizPage.inbox2.medianResponse")}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <i className="fa-regular fa-clock" style={{ color: "#F59E0B" }} />
                <span style={{ fontSize: 20, fontWeight: 700, color: "#F6F1EC" }}>{formatTime(medianResp)}</span>
              </div>
           </div>
        </div>

        {/* Row 1: Messages over time & Messages per platform */}
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 24 }}>
          <div className="glass" style={{ borderRadius: 8, padding: "24px", border: "1px solid rgba(255,255,255,0.08)" }}>
             <h3 style={{ fontSize: 16, fontWeight: 700, color: "#F6F1EC", marginBottom: 4 }}>{t("analizPage.inbox2.messagesOverTime")}</h3>
             <p style={{ color: "var(--text-secondary)", fontSize: 12, marginBottom: 24 }}>{t("analizPage.inbox2.messagesOverTimeSub")}</p>
             <div style={{ height: 300, width: "100%" }}>
                <ResponsiveContainer width="100%" height="100%">
                   <LineChart data={vol.timeseries || []}>
                     <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                     <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(val) => val ? val.substring(5,10) : ''} />
                     <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                     <Tooltip content={<CustomTooltip />} />
                     <Line type="monotone" dataKey="received" name={t("analizPage.inbox2.received")} stroke="#22B573" strokeWidth={2} dot={false} />
                     <Line type="monotone" dataKey="sent" name={t("analizPage.inbox2.sent")} stroke="#3B82F6" strokeWidth={2} dot={false} />
                     <Line type="monotone" dataKey="read" name={t("analizPage.inbox2.read")} stroke="#8B5CF6" strokeWidth={2} dot={false} />
                   </LineChart>
                </ResponsiveContainer>
             </div>
          </div>

          <div className="glass" style={{ borderRadius: 8, padding: "24px", border: "1px solid rgba(255,255,255,0.08)" }}>
             <h3 style={{ fontSize: 16, fontWeight: 700, color: "#F6F1EC", marginBottom: 4 }}>{t("analizPage.inbox2.messagesPerPlatform")}</h3>
             <p style={{ color: "var(--text-secondary)", fontSize: 12, marginBottom: 24 }}>{t("analizPage.inbox2.messagesPerPlatformSub")}</p>
             <div style={{ height: 300, width: "100%" }}>
                <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={vol.byPlatform || []}>
                     <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                     <XAxis dataKey="platform" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                     <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                     <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(255,255,255,0.05)'}} />
                     <Bar dataKey="received" name={t("analizPage.inbox2.received")} stackId="a" fill="#22B573" barSize={30} />
                     <Bar dataKey="sent" name={t("analizPage.inbox2.sent")} stackId="a" fill="#3B82F6" barSize={30} radius={[4,4,0,0]} />
                   </BarChart>
                </ResponsiveContainer>
             </div>
          </div>
        </div>

        {/* Row 2: Response time & Top accounts */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          <div className="glass" style={{ borderRadius: 8, padding: "24px", border: "1px solid rgba(255,255,255,0.08)" }}>
             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
               <div>
                 <h3 style={{ fontSize: 16, fontWeight: 700, color: "#F6F1EC", marginBottom: 4 }}>{t("analizPage.inbox2.responseTime")}</h3>
                 <p style={{ color: "var(--text-secondary)", fontSize: 12 }}>How long it takes to send the first reply after a customer message - {perf.repliedCount || 0} replied · {perf.waitingCount || 0} still waiting</p>
               </div>
               <div style={{ textAlign: "right" }}>
                 <div style={{ fontSize: 16, fontWeight: 700, color: "#F6F1EC" }}>{formatTime(medianResp)}</div>
                 <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>{t("analizPage.inbox2.median")}</div>
               </div>
             </div>
             
             <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 24 }}>
                <div style={{ border: "1px solid rgba(244,114,182,0.3)", borderRadius: 6, padding: "12px" }}>
                   <div style={{ fontSize: 11, color: "var(--text-secondary)", marginBottom: 4 }}>{t("analizPage.inbox2.within5")} <span style={{ float: "right", color: "#F472B6" }}>●</span></div>
                   <div style={{ fontSize: 20, fontWeight: 700, color: "#F472B6" }}>{perf.percentUnder5m || 0}%</div>
                   <div style={{ fontSize: 10, color: "var(--text-secondary)" }}>{t("analizPage.inbox2.target50")}</div>
                </div>
                <div style={{ border: "1px solid rgba(244,114,182,0.3)", borderRadius: 6, padding: "12px" }}>
                   <div style={{ fontSize: 11, color: "var(--text-secondary)", marginBottom: 4 }}>{t("analizPage.inbox2.within15")} <span style={{ float: "right", color: "#F472B6" }}>●</span></div>
                   <div style={{ fontSize: 20, fontWeight: 700, color: "#F472B6" }}>{perf.percentUnder15m || 0}%</div>
                   <div style={{ fontSize: 10, color: "var(--text-secondary)" }}>{t("analizPage.inbox2.target80")}</div>
                </div>
                <div style={{ border: "1px solid rgba(244,114,182,0.3)", borderRadius: 6, padding: "12px" }}>
                   <div style={{ fontSize: 11, color: "var(--text-secondary)", marginBottom: 4 }}>{t("analizPage.inbox2.within60")} <span style={{ float: "right", color: "#F472B6" }}>●</span></div>
                   <div style={{ fontSize: 20, fontWeight: 700, color: "#F472B6" }}>{perf.percentUnder1h || 0}%</div>
                   <div style={{ fontSize: 10, color: "var(--text-secondary)" }}>{t("analizPage.inbox2.target95")}</div>
                </div>
             </div>

             <div style={{ height: 200, width: "100%" }}>
                <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={perf.distribution || [
                     { name: '0-1m', value: 0, fill: '#22B573' },
                     { name: '1-5m', value: 0, fill: '#10B981' },
                     { name: '5-15m', value: 0, fill: '#F59E0B' },
                     { name: '15-60m', value: 0, fill: '#F59E0B' },
                     { name: '1-4h', value: 0, fill: '#F97316' },
                     { name: '4-24h', value: 0, fill: '#F43F5E' },
                     { name: '1d+', value: 0, fill: '#9CA3AF' }
                   ]}>
                     <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                     <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                     <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                     <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(255,255,255,0.05)'}} />
                     <Bar dataKey="value" radius={[4,4,0,0]} barSize={30}>
                        {
                          (perf.distribution || [{fill: '#22B573'}]).map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={entry.fill || '#22B573'} />
                          ))
                        }
                     </Bar>
                   </BarChart>
                </ResponsiveContainer>
             </div>
          </div>

          <div className="glass" style={{ borderRadius: 8, padding: "24px", border: "1px solid rgba(255,255,255,0.08)" }}>
             <h3 style={{ fontSize: 16, fontWeight: 700, color: "#F6F1EC", marginBottom: 4 }}>{t("analizPage.inbox2.topAccounts")}</h3>
             <p style={{ color: "var(--text-secondary)", fontSize: 12, marginBottom: 24 }}>{t("analizPage.inbox2.topAccountsSub")}</p>
             <div style={{ overflowX: "auto" }}>
               <table style={{ width: "100%", textAlign: "left", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                     <tr>
                       <th style={{ padding: "8px", borderBottom: "1px solid rgba(255,255,255,0.1)", color: "var(--text-secondary)", fontWeight: 600 }}>
                         <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>{t("analizPage.inbox2.account")} <i className="fa-solid fa-sort" style={{ opacity: 0.4, fontSize: 10 }} /></div>
                       </th>
                       <th style={{ padding: "8px", borderBottom: "1px solid rgba(255,255,255,0.1)", color: "var(--text-secondary)", fontWeight: 600 }}>
                         <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 6 }}>
                           <i className="fa-solid fa-inbox" style={{color: "#22B573", fontSize: 12}}/> {t("analizPage.inbox2.received")} <i className="fa-solid fa-sort" style={{ opacity: 0.4, fontSize: 10 }} />
                         </div>
                       </th>
                       <th style={{ padding: "8px", borderBottom: "1px solid rgba(255,255,255,0.1)", color: "var(--text-secondary)", fontWeight: 600 }}>
                         <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 6 }}>
                           <i className="fa-solid fa-paper-plane" style={{color: "#3B82F6", fontSize: 12}}/> {t("analizPage.inbox2.sent")} <i className="fa-solid fa-sort" style={{ opacity: 0.4, fontSize: 10 }} />
                         </div>
                       </th>
                       <th style={{ padding: "8px", borderBottom: "1px solid rgba(255,255,255,0.1)", color: "var(--text-secondary)", fontWeight: 600 }}>
                         <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 6 }}>
                           <i className="fa-solid fa-comments" style={{color: "#F59E0B", fontSize: 12}}/> {t("analizPage.inbox2.conversations")} <i className="fa-solid fa-sort" style={{ opacity: 0.4, fontSize: 10 }} />
                         </div>
                       </th>
                       <th style={{ padding: "8px", borderBottom: "1px solid rgba(255,255,255,0.1)", color: "var(--text-secondary)", fontWeight: 600 }}>
                         <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 6 }}>
                           <i className="fa-solid fa-clock" style={{color: "#F472B6", fontSize: 12}}/> {t("analizPage.inbox2.response")} <i className="fa-solid fa-sort" style={{ opacity: 0.4, fontSize: 10 }} />
                         </div>
                       </th>
                       <th style={{ padding: "8px", borderBottom: "1px solid rgba(255,255,255,0.1)", color: "var(--text-secondary)", fontWeight: 600 }}>
                         <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 6 }}>
                           # Total <i className="fa-solid fa-sort" style={{ opacity: 0.4, fontSize: 10 }} />
                         </div>
                       </th>
                     </tr>
                  </thead>
                  <tbody>
                     {(vol.byAccount || []).map((acc: any, i: number) => {
                       const getIcon = (p: string) => {
                         if(p==='instagram') return 'fa-brands fa-instagram';
                         if(p==='facebook') return 'fa-brands fa-facebook';
                         if(p==='whatsapp') return 'fa-brands fa-whatsapp';
                         return 'fa-solid fa-hashtag';
                       };
                       return (
                         <tr key={i}>
                            <td style={{ padding: "12px 8px", borderBottom: "1px solid rgba(255,255,255,0.05)", color: "#F6F1EC" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <i className={getIcon(acc.platform)} style={{ color: "var(--text-secondary)", fontSize: 14 }} />
                                <span>{acc.name || acc.platform}</span>
                              </div>
                            </td>
                            <td style={{ padding: "12px 8px", borderBottom: "1px solid rgba(255,255,255,0.05)", color: "#F6F1EC", textAlign: "right" }}>{acc.received || 0}</td>
                            <td style={{ padding: "12px 8px", borderBottom: "1px solid rgba(255,255,255,0.05)", color: "#F6F1EC", textAlign: "right" }}>{acc.sent || 0}</td>
                            <td style={{ padding: "12px 8px", borderBottom: "1px solid rgba(255,255,255,0.05)", color: "#F6F1EC", textAlign: "right" }}>{acc.conversations || 0}</td>
                            <td style={{ padding: "12px 8px", borderBottom: "1px solid rgba(255,255,255,0.05)", color: "#F6F1EC", textAlign: "right" }}>{formatTime(acc.medianResponseSeconds)}</td>
                            <td style={{ padding: "12px 8px", borderBottom: "1px solid rgba(255,255,255,0.05)", color: "#F6F1EC", textAlign: "right" }}>{(acc.received || 0) + (acc.sent || 0)}</td>
                         </tr>
                       );
                     })}
                  </tbody>
               </table>
             </div>
          </div>
        </div>

        {/* Row 3: Outbound by source & When messages land */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
           <div className="glass" style={{ borderRadius: 8, padding: "24px", border: "1px solid rgba(255,255,255,0.08)" }}>
             <h3 style={{ fontSize: 16, fontWeight: 700, color: "#F6F1EC", marginBottom: 4 }}>{t("analizPage.inbox2.outboundBySource")}</h3>
             <p style={{ color: "var(--text-secondary)", fontSize: 12, marginBottom: 24 }}>{t("analizPage.inbox2.outboundBySourceSub")}</p>
             <div style={{ height: 250, width: "100%" }}>
                <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={vol.outboundBySource || [
                     { name: 'Native app', value: 0, fill: '#6B7280' },
                     { name: 'API', value: 0, fill: '#22B573' }
                   ]}>
                     <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                     <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                     <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                     <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(255,255,255,0.05)'}} />
                     <Bar dataKey="value" radius={[4,4,0,0]} barSize={40}>
                        {
                          (vol.outboundBySource || [{fill: '#6B7280'}, {fill: '#22B573'}]).map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={entry.fill || '#22B573'} />
                          ))
                        }
                     </Bar>
                   </BarChart>
                </ResponsiveContainer>
             </div>
           </div>

           <div className="glass" style={{ borderRadius: 8, padding: "24px", border: "1px solid rgba(255,255,255,0.08)" }}>
             <h3 style={{ fontSize: 16, fontWeight: 700, color: "#F6F1EC", marginBottom: 4 }}>{t("analizPage.inbox2.whenMessagesLand")}</h3>
             <p style={{ color: "var(--text-secondary)", fontSize: 12, marginBottom: 24 }}>{t("analizPage.inbox2.whenMessagesLandSub")}</p>
             <div style={{ height: 250, width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                    <XAxis type="category" dataKey="hour" name={t("analizPage.inbox2.hour")} stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="day" name={t("analizPage.inbox2.day")} stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                    <ZAxis type="number" dataKey="value" range={[20, 400]} />
                    <Tooltip cursor={{strokeDasharray: '3 3'}} content={<CustomTooltip />} />
                    <Scatter data={vol.heatmap || []} fill="#8B5CF6" shape="square" />
                  </ScatterChart>
                </ResponsiveContainer>
             </div>
           </div>
        </div>
      </div>
    );
}
