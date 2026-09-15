import re

with open("src/app/(dashboard)/ai-asistan/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

old_func = """  const fetchSettings = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    // bot_settings still drives the channel toggles below (whatsapp/social
    // active) — untouched by the Persona Engine. Its system_prompt/tone/
    // role/character columns are no longer read here at all ("Tek Yapý"
    // refactor, Eylül 2026 — the "Ýleri Seviye Ayarlar" panel that used to
    // display system_prompt read-only was removed; that column is still
    // written by nothing and read by nothing on this screen anymore).
    const { data: botData } = await supabase
      .from('bot_settings')
      .select('whatsapp_bot_active, is_active')
      .eq('merchant_id', session.user.id)
      .maybeSingle();

    if (botData) {
      setBotConfig(prev => ({
        ...prev,
        whatsapp: !!botData.whatsapp_bot_active,
        social: !!botData.is_active,
      }));
    }

    // Persona Engine (Phase 5): the merchant's actual saved persona/dial
    // selections now live in organization_ai_settings, not bot_settings.
    const pRes = await getPublishedPersonas();
    if (pRes) {
      setPersonas(pRes);
    }
    setPersonasLoading(false);

    const aiSettings = await getAiPersonaSettings();
    if (aiSettings) {
      if (aiSettings.businessRole) setSelectedRole(aiSettings.businessRole);
      if (aiSettings.tone) setSelectedTone(aiSettings.tone);
      if (aiSettings.customInstruction) setCustomInstruction(aiSettings.customInstruction);
      if (aiSettings.appointmentModuleEnabled !== undefined) setAppointmentModuleEnabled(aiSettings.appointmentModuleEnabled);
      if (aiSettings.characterSlug) setSelectedPersonaSlug(aiSettings.characterSlug);
      if (aiSettings.personaIntensity !== undefined) setPersonaIntensity(aiSettings.personaIntensity);
      if (aiSettings.humorLevel !== undefined) setHumorLevel(aiSettings.humorLevel);
      if (aiSettings.modernAdaptation !== undefined) setModernAdaptation(aiSettings.modernAdaptation);
    }

    const wahaRes = await getWahaStatus();
    if (wahaRes.success && wahaRes.data) {
      setWahaStatus(wahaRes.data.status);
      if (wahaRes.data.me) {
        setWahaPhone(wahaRes.data.me.id.split('@')[0]);
      }
    }
  };"""

new_func = """  const fetchSettings = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // bot_settings still drives the channel toggles below (whatsapp/social
      // active) — untouched by the Persona Engine. Its system_prompt/tone/
      // role/character columns are no longer read here at all ("Tek Yapý"
      // refactor, Eylül 2026 — the "Ýleri Seviye Ayarlar" panel that used to
      // display system_prompt read-only was removed; that column is still
      // written by nothing and read by nothing on this screen anymore).
      const { data: botData } = await supabase
        .from('bot_settings')
        .select('whatsapp_bot_active, is_active')
        .eq('merchant_id', session.user.id)
        .maybeSingle();

      if (botData) {
        setBotConfig(prev => ({
          ...prev,
          whatsapp: !!botData.whatsapp_bot_active,
          social: !!botData.is_active,
        }));
      }

      // Persona Engine (Phase 5): the merchant's actual saved persona/dial
      // selections now live in organization_ai_settings, not bot_settings.
      const pRes = await getPublishedPersonas();
      if (pRes) {
        setPersonas(pRes);
      }
      setPersonasLoading(false);

      const aiSettings = await getAiPersonaSettings();
      if (aiSettings) {
        if (aiSettings.businessRole) setSelectedRole(aiSettings.businessRole);
        if (aiSettings.tone) setSelectedTone(aiSettings.tone);
        if (aiSettings.customInstruction) setCustomInstruction(aiSettings.customInstruction);
        if (aiSettings.appointmentModuleEnabled !== undefined) setAppointmentModuleEnabled(aiSettings.appointmentModuleEnabled);
        if (aiSettings.characterSlug) setSelectedPersonaSlug(aiSettings.characterSlug);
        if (aiSettings.personaIntensity !== undefined) setPersonaIntensity(aiSettings.personaIntensity);
        if (aiSettings.humorLevel !== undefined) setHumorLevel(aiSettings.humorLevel);
        if (aiSettings.modernAdaptation !== undefined) setModernAdaptation(aiSettings.modernAdaptation);
      }

      const wahaRes = await getWahaStatus();
      if (wahaRes.success && wahaRes.data) {
        setWahaStatus(wahaRes.data.status);
        if (wahaRes.data.me) {
          setWahaPhone(wahaRes.data.me.id.split('@')[0]);
        }
      }
    } catch (error) {
      console.error("[fetchSettings] Error during settings initialization:", error);
    } finally {
      setPersonasLoading(false);
    }
  };"""

content = content.replace(old_func, new_func)

with open("src/app/(dashboard)/ai-asistan/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("done")
