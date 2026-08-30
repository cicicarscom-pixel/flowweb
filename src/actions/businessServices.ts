'use server'

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getBusinessServices(merchantId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('business_services')
    .select('*')
    .eq('merchant_id', merchantId)
    .order('created_at', { ascending: true });

  if (error) throw new Error(error.message);
  return data || [];
}

export async function createBusinessService(merchantId: string, formData: FormData) {
  const supabase = createClient();
  
  const payload = {
    merchant_id: merchantId,
    name: formData.get('name') as string,
    price: parseFloat(formData.get('price') as string),
    currency: formData.get('currency') as string || 'TL',
    unit: formData.get('unit') as string || 'seans',
    duration_minutes: parseInt(formData.get('duration_minutes') as string, 10),
    description: formData.get('description') as string || null,
    color: formData.get('color') as string || null,
    is_visible: formData.get('is_visible') === 'true'
  };

  const { error } = await supabase.from('business_services').insert(payload);
  
  if (error) throw new Error(error.message);
  
  revalidatePath('/ai-asistan/isletme-hizmetleri');
  return { success: true };
}

export async function updateBusinessService(id: string, formData: FormData) {
  const supabase = createClient();
  
  const payload = {
    name: formData.get('name') as string,
    price: parseFloat(formData.get('price') as string),
    currency: formData.get('currency') as string || 'TL',
    unit: formData.get('unit') as string || 'seans',
    duration_minutes: parseInt(formData.get('duration_minutes') as string, 10),
    description: formData.get('description') as string || null,
    color: formData.get('color') as string || null,
    is_visible: formData.get('is_visible') === 'true',
    updated_at: new Date().toISOString()
  };

  const { error } = await supabase.from('business_services').update(payload).eq('id', id);
  
  if (error) throw new Error(error.message);
  
  revalidatePath('/ai-asistan/isletme-hizmetleri');
  return { success: true };
}

export async function deleteBusinessService(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from('business_services').delete().eq('id', id);
  
  if (error) throw new Error(error.message);
  
  revalidatePath('/ai-asistan/isletme-hizmetleri');
  return { success: true };
}
