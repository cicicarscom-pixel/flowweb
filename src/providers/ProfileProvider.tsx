"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export const ProfileContext = createContext<any>(null);

export function RealtimeProvider({ initialProfile, initialOrg, userId, children }: any) {
  const [profile, setProfile] = useState(initialProfile);
  const [organization, setOrganization] = useState(initialOrg);

  useEffect(() => {
    if (!userId) return;
    const supabase = createClient();
    
    const channel = supabase
      .channel(`profile-sync-${userId}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "profiles", filter: `id=eq.${userId}` },
        (payload) => setProfile(payload.new)
      );

    if (initialOrg?.id) {
      channel.on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "organizations", filter: `id=eq.${initialOrg.id}` },
        (payload) => setOrganization(payload.new)
      );
    }
    
    channel.subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, initialOrg?.id]);

  return (
    <ProfileContext.Provider value={{ profile, setProfile, organization, setOrganization }}>
      {children}
    </ProfileContext.Provider>
  );
}

export const useProfile = () => useContext(ProfileContext);
