const fs = require('fs');
let content = fs.readFileSync('src/app/(dashboard)/ai-asistan/page.tsx', 'utf8');

const oldFunc = `  const fetchSettings = async () => {
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
  };`;

const newFunc = `  const fetchSettings = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

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
  };`;

// Because of Windows CRLF vs LF, the direct string replace might fail.
// I will just use string replacement ignoring whitespace formatting.
const startIdx = content.indexOf('const fetchSettings = async () => {');
const endIdx = content.indexOf('const handleAppointmentToggle', startIdx);
if (startIdx !== -1 && endIdx !== -1) {
    const before = content.substring(0, startIdx);
    const after = content.substring(endIdx);
    fs.writeFileSync('src/app/(dashboard)/ai-asistan/page.tsx', before + newFunc + '\n\n    ' + after, 'utf8');
    console.log('Done');
} else {
    console.log('Not found');
}
