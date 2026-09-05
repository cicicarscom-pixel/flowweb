'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

const ZERNIO_API_KEY = process.env.ZERNIO_API_KEY || process.env.NEXT_PUBLIC_ZERNIO_API_KEY || ''
const ZERNIO_API_URL = 'https://api.zernio.com/v1'

export async function getZernioConnectUrl(platform: string, redirectUrl: string) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) throw new Error("Unauthorized")

    const { data: orgMember } = await supabase.from('organization_members').select('organization_id').eq('user_id', user.id).limit(1).single()
    if (!orgMember?.organization_id) throw new Error("Kullanıcı herhangi bir organizasyona bağlı değil.")

    const orgId = orgMember.organization_id

    // 1. Resolve Profile Slot
    const { data: resolved, error: rpcError } = await supabase.rpc('resolve_zernio_profile_for_platform', {
      p_org_id: orgId,
      p_platform: platform
    })

    if (rpcError || !resolved) {
      console.error("RPC Error:", rpcError)
      throw new Error("Zernio profil slotu ayarlanamadı.")
    }

    let finalZernioProfileId = resolved.zernio_profile_id

    // 2. Create if new
    if (resolved.is_new) {
      const profileName = `wg_${orgId}_${resolved.profile_slot}`
      const idempotencyKey = `zernio-profile:${orgId}:${resolved.profile_slot}`

      const zernioRes = await fetch(`${ZERNIO_API_URL}/profiles`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${ZERNIO_API_KEY}`,
          'Content-Type': 'application/json',
          'Idempotency-Key': idempotencyKey
        },
        body: JSON.stringify({ name: profileName })
      })

      if (!zernioRes.ok) {
        throw new Error(`Zernio API Error: ${await zernioRes.text()}`)
      }

      const zernioData = await zernioRes.json()
      finalZernioProfileId = zernioData.profile?.id || zernioData.profile?._id || zernioData.id || zernioData._id
      
      // Update DB with the created profile ID
      if (finalZernioProfileId) {
        await supabase.schema('integration').from('zernio_profiles').update({
          zernio_profile_id: finalZernioProfileId,
          status: 'active'
        }).eq('id', resolved.mapping_id)
      }
    }

    if (!finalZernioProfileId) {
      throw new Error("Created profile ID is missing")
    }

    // 3. Get Connect URL
    const urlRes = await fetch(`${ZERNIO_API_URL}/connect/url?platform=${platform}&profileId=${finalZernioProfileId}&redirect_url=${encodeURIComponent(redirectUrl)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${ZERNIO_API_KEY}`,
        'Content-Type': 'application/json'
      }
    })

    if (!urlRes.ok) {
      throw new Error(`Zernio URL Fetch Error: ${await urlRes.text()}`)
    }

    const urlData = await urlRes.json()
    const authUrl = urlData.data?.authUrl || urlData.data?.url || urlData.authUrl || urlData.url

    return { success: true, authUrl }
  } catch (error: any) {
    console.error("Zernio Connect Error:", error)
    return { success: false, error: error.message }
  }
}

export async function disconnectZernioAccount(accountId: string) {
  try {
    const supabase = await createClient()
    
    await fetch(`${ZERNIO_API_URL}/accounts/${accountId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${ZERNIO_API_KEY}`,
        'Content-Type': 'application/json'
      }
    })

    await supabase.schema('integration').from('social_accounts').update({ is_active: false }).eq('zernio_account_id', accountId)
    
    revalidatePath('/sosyal-medya')
    return { success: true }
  } catch (error: any) {
    console.error("Zernio Disconnect Error:", error)
    return { success: false, error: error.message }
  }
}

export async function syncZernioAccounts() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    const { data: orgMember } = await supabase.from('organization_members').select('organization_id').eq('user_id', user.id).limit(1).single()
    if (!orgMember?.organization_id) throw new Error("Kullanıcı herhangi bir organizasyona bağlı değil.")

    const orgId = orgMember.organization_id

    const { data: activeProfiles } = await supabase
      .schema('integration')
      .from('zernio_profiles')
      .select('id, zernio_profile_id')
      .eq('organization_id', orgId)
      .eq('status', 'active')

    if (!activeProfiles || activeProfiles.length === 0) return { success: true, accounts: [] }

    let allAccounts: any[] = []

    for (const profile of activeProfiles) {
      try {
        const accRes = await fetch(`${ZERNIO_API_URL}/accounts?profileId=${profile.zernio_profile_id}`, {
          headers: { 'Authorization': `Bearer ${ZERNIO_API_KEY}` }
        })
        
        if (accRes.ok) {
          const accData = await accRes.json()
          const accounts = accData.data?.accounts || accData.accounts || accData.data || []
          allAccounts = allAccounts.concat(accounts)

          if (accounts.length > 0) {
            const mappedAccounts = accounts.map((acc: any) => ({
              organization_id: orgId,
              zernio_profile_mapping_id: profile.id,
              zernio_profile_id: profile.zernio_profile_id,
              zernio_account_id: acc._id || acc.id || acc.accountId || acc.uuid,
              platform: acc.platform || 'unknown',
              username: acc.username || acc.displayName || acc.name || acc.platform,
              is_active: true,
              needs_reconnection: false,
              last_seen_at: new Date().toISOString()
            }))
            
            await supabase.schema('integration').from('social_accounts').upsert(
              mappedAccounts,
              { onConflict: 'zernio_account_id' }
            )
          }
        }
      } catch (e) {
        console.error(`Sync error for profile ${profile.zernio_profile_id}`, e)
      }
    }

    revalidatePath('/sosyal-medya')
    return { success: true, accounts: allAccounts }
  } catch (error: any) {
    console.error("Zernio Sync Error:", error)
    return { success: false, error: error.message }
  }
}
