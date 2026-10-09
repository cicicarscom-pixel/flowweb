"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { toggleMultiCalendarMode } from "@/actions/toggleCalendar";
import { useDialog } from "@/components/ui/DialogProvider";

export default function MultiCalendarToggle() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const t = useTranslations("multiCalendarToggle");
  const dialog = useDialog();
  const supabase = createClient();

  useEffect(() => {
    let sub: ReturnType<typeof supabase.channel> | null = null;
    let userId: string | null = null;
    let active = true;

    async function load() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || !active) return;
      userId = session.user.id;
      
      const { data } = await supabase
        .from("organizations")
        .select("multi_calendar_enabled")
        .eq("owner_id", userId)
        .single();
        
      if (!active) return;
      if (data) setIsEnabled(data.multi_calendar_enabled);
      setLoading(false);

      sub = supabase.channel("org_changes")
        .on("postgres_changes", {
          event: "UPDATE",
          schema: "public",
          table: "organizations",
          filter: `owner_id=eq.${userId}`
        }, (payload) => {
          if (payload.new && typeof payload.new.multi_calendar_enabled === "boolean") {
            setIsEnabled(payload.new.multi_calendar_enabled);
          }
        })
        .subscribe();
    }
    load();

    return () => {
      active = false;
      if (sub) supabase.removeChannel(sub);
    };
  }, [supabase]);

  const handleToggle = async () => {
    const newVal = !isEnabled;
    setIsEnabled(newVal); // Optimistic
    
    const res = await toggleMultiCalendarMode(newVal);
    if (res.error) {
      dialog.alert(t("errorPrefix", { message: res.error }));
      setIsEnabled(!newVal); // Revert
    }
  };

  if (loading) return null;

  return (
    <div className="glass" style={{ 
      borderRadius: 16, padding: "20px 24px", border: "1px solid rgba(255,255,255,0.06)",
      display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16
    }}>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
          <span style={{ fontSize: 20 }}>📅</span>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#fff" }}>{t("title")}</h3>
        </div>
        <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
          {t("description")}
        </p>
      </div>

      <div 
        onClick={handleToggle}
        style={{
          width: 52, height: 28, borderRadius: 99,
          background: isEnabled ? "#22B573" : "rgba(255,255,255,0.1)",
          position: "relative", cursor: "pointer",
          transition: "background 0.3s",
          border: "1px solid rgba(255,255,255,0.1)"
        }}
      >
        <div style={{
          position: "absolute", top: 2, left: isEnabled ? 26 : 2,
          width: 22, height: 22, borderRadius: "50%",
          background: "#fff", transition: "left 0.3s",
          boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
        }} />
      </div>
    </div>
  );
}

