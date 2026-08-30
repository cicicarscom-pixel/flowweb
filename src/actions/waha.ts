'use server'

import { createClient } from '@/lib/supabase/server'

const WAHA_BASE_URL = 'http://31.97.37.208:3000';
const WAHA_API_KEY = 'workigom_key_2026';

export async function getWahaStatus() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Oturum bulunamadı' };
  
  try {
    const response = await fetch(`${WAHA_BASE_URL}/api/sessions?all=true`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-Api-Key': WAHA_API_KEY,
      },
      cache: 'no-store'
    });
    
    if (!response.ok) {
      return { success: false, error: 'Oturum bilgisi alınamadı' };
    }
    
    const sessions = await response.json();
    const session = sessions.find((s: any) => s.name === user.id);
    return { success: true, data: session || null };
  } catch (error: any) {
    console.error('getWahaStatus Error:', error);
    return { success: false, error: error.message };
  }
}

export async function startWahaSession() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Oturum bulunamadı' };
  
  try {
    const requestBody = {
      name: user.id,
      config: {
        webhooks: [
          {
            url: "https://qybzidylewzsnmlofjul.supabase.co/functions/v1/waha-webhook",
            events: ["message", "message.any", "session.status"]
          }
        ]
      }
    };

    const response = await fetch(`${WAHA_BASE_URL}/api/sessions/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': WAHA_API_KEY,
      },
      body: JSON.stringify(requestBody),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      if (response.status === 422 && errorData.message && errorData.message.includes('already started')) {
        // Auto-heal
        await fetch(`${WAHA_BASE_URL}/api/sessions/stop`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Api-Key': WAHA_API_KEY },
          body: JSON.stringify({ name: user.id, logout: true })
        });
        
        const retryResponse = await fetch(`${WAHA_BASE_URL}/api/sessions/start`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Api-Key': WAHA_API_KEY },
          body: JSON.stringify(requestBody)
        });
        
        if (!retryResponse.ok) return { success: false, error: 'Oto-onarım başarısız' };
        
        await new Promise(resolve => setTimeout(resolve, 4000));
        return { success: true, data: await retryResponse.json() };
      }
      return { success: false, error: errorData.message || 'Başlatılamadı' };
    }
    
    return { success: true, data: await response.json() };
  } catch (error: any) {
    console.error('startWahaSession Error:', error);
    return { success: false, error: error.message };
  }
}

export async function getWahaQrCode() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Oturum bulunamadı' };
  
  try {
    const response = await fetch(`${WAHA_BASE_URL}/api/${user.id}/auth/qr`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-Api-Key': WAHA_API_KEY,
      },
      cache: 'no-store'
    });
    
    if (!response.ok) return { success: false, error: 'QR alınamadı' };
    return { success: true, data: await response.json() };
  } catch (error: any) {
    console.error('getWahaQrCode Error:', error);
    return { success: false, error: error.message };
  }
}

export async function getWahaPairingCode(phoneNumber: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Oturum bulunamadı' };
  
  try {
    const response = await fetch(`${WAHA_BASE_URL}/api/${user.id}/auth/request-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Api-Key': WAHA_API_KEY,
      },
      body: JSON.stringify({ phoneNumber }),
    });
    
    if (!response.ok) return { success: false, error: 'Eşleşme kodu alınamadı' };
    return { success: true, data: await response.json() };
  } catch (error: any) {
    console.error('getWahaPairingCode Error:', error);
    return { success: false, error: error.message };
  }
}
