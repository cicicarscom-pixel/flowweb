"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useTranslations } from "next-intl";

export default function MultiCalendarToggle() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const t = useTranslations();

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      
      const { data } = await supabase
        .from("organizations")
        .select("multi_calendar_enabled")
        .eq("owner_id", session.user.id)
        .single();
        
      if (data) setIsEnabled(data.multi_calendar_enabled);
      setLoading(false);
    }
    load();
  }, []);

  const handleToggle = async () => {
    const newVal = !isEnabled;
    setIsEnabled(newVal);
    
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const { error } = await supabase
        .from("organizations")
        .update({ multi_calendar_enabled: newVal })
        .eq("owner_id", session.user.id);
        
      if (error) {
        console.error("Toggle error:", error);
        setIsEnabled(!newVal); // Revert on error
      }
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
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#fff" }}>Çoklu Takvim / Personel Modu</h3>
        </div>
        <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
          Aynı saatte birden fazla personelin randevu alabilmesini sağlar.
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
