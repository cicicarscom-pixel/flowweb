"use client";

import React, { useState, useEffect } from "react";
import { Country, State, City } from "country-state-city";


import { createClient } from "@/lib/supabase/client";


export default function ProfilPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  
  const [businessName, setBusinessName] = useState("");
  const [authorizedPerson, setAuthorizedPerson] = useState("");
  const [category, setCategory] = useState("Diğer");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
    const [addressObj, setAddressObj] = useState({ country: "", city: "", district: "", fullAddress: "" });
  const [avatar, setAvatar] = useState("");
  
  const [vkn, setVkn] = useState("");
  const [taxOffice, setTaxOffice] = useState("");
  const [organizationId, setOrganizationId] = useState("");
  
  const supabase = createClient();

  useEffect(() => {
    fetchProfileData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProfileData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      
      setEmail(session.user.email || "");
      
      const { data: profile } = await supabase
        .from("profiles")
        .select("business_name, authorized_person, category, phone_number, address, avatar_url")
        .eq("id", session.user.id)
        .single();
        
      if (profile) {
        setBusinessName(profile.business_name || "");
        setAuthorizedPerson(profile.authorized_person || "");
        setCategory(profile.category || "Diğer");
        setPhone(profile.phone_number || "");
        
        // Handle address object from mobile AddressSelector
                if (typeof profile.address === 'object' && profile.address !== null) {
          setAddressObj({
            country: profile.address.country || "",
            city: profile.address.city || "",
            district: profile.address.district || "",
            fullAddress: profile.address.fullAddress || profile.address.detail || ""
          });
        } else {
          setAddressObj({ country: "", city: "", district: "", fullAddress: profile.address || "" });
        }

        let av = profile.avatar_url;
        if (av && av.startsWith('file://')) {
            av = null;
        } else if (av && !av.startsWith('http')) {
            const { data } = supabase.storage.from('avatars').getPublicUrl(av);
            av = data.publicUrl;
        }
        
        if (!av) {
            av = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(profile.business_name || 'Esnaf') + '&background=00daf3&color=fff';
        }
        setAvatar(av);
      }
      
      // Fetch organization and legal info for VKN
      const { data: orgMember } = await supabase
        .from("organization_members")
        .select("organization_id")
        .eq("user_id", session.user.id)
        .limit(1)
        .maybeSingle();
        
      if (orgMember?.organization_id) {
        setOrganizationId(orgMember.organization_id);
        
        const { data: orgData } = await supabase
          .from("organizations")
          .select("name")
          .eq("id", orgMember.organization_id)
          .maybeSingle();
          
        if (orgData && orgData.name) {
          setBusinessName(orgData.name);
        }

        const { data: legalData } = await supabase
          .from("organization_legal_profiles")
          .select("tax_identifier, tax_office")
          .eq("organization_id", orgMember.organization_id)
          .maybeSingle();
          
        if (legalData) {
          setVkn(legalData.tax_identifier || "");
          setTaxOffice(legalData.tax_office || "");
        }
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || e.target.files.length === 0) return;
      const file = e.target.files[0];
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${session.user.id}-${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(fileName, file);
        
      if (error) throw error;
      
      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(fileName);
      setAvatar(publicUrl);
      
      await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', session.user.id);
      
      setMessage("Profil fotoğrafı güncellendi.");
      setTimeout(() => setMessage(""), 3000);
    } catch (error: any) {
      console.error("Avatar upload error:", error);
      setMessage("Fotoğraf yükleme hatası: " + error.message);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Oturum bulunamadı");
      
      // Keep mobile's AddressSelector compatibility if it expects an object. 
      // If the user types in text, we can just save it as text, or wrap it in { fullAddress: text }
      let addressToSave = addressObj;

      await supabase
        .from("profiles")
        .update({
          business_name: businessName,
          authorized_person: authorizedPerson,
          category: category,
          phone_number: phone,
          address: addressToSave,
        })
        .eq("id", session.user.id);
        
      if (organizationId) {
        await supabase
          .from("organizations")
          .update({ name: businessName })
          .eq("id", organizationId);

        const { data: existingLegal } = await supabase
          .from("organization_legal_profiles")
          .select("id")
          .eq("organization_id", organizationId)
          .maybeSingle();
          
        if (existingLegal) {
          await supabase
            .from("organization_legal_profiles")
            .update({ tax_identifier: vkn, tax_office: taxOffice })
            .eq("organization_id", organizationId);
        } else {
          await supabase
            .from("organization_legal_profiles")
            .insert({ organization_id: organizationId, tax_identifier: vkn, tax_office: taxOffice });
        }
      }
      
      setMessage("Profil başarıyla güncellendi!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err: any) {
      setMessage("Hata: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: 40, color: "#fff" }}>Yükleniyor...</div>;

  return (
    <div style={{ padding: "40px", maxWidth: 800, margin: "0 auto", width: "100%" }}>
      <h1 style={{ fontSize: 28, fontWeight: 600, color: "#fff", marginBottom: 8, fontFamily: "Outfit, sans-serif" }}>Profil Ayarları</h1>
      <p style={{ color: "var(--text-muted)", marginBottom: 32 }}>İşletme ve vergi bilgilerinizi buradan yönetebilirsiniz.</p>
      
      {message && (
        <div style={{ padding: 16, borderRadius: 12, marginBottom: 24, background: message.includes("Hata") ? "rgba(239,68,68, 0.1)" : "rgba(34,181,115, 0.1)", color: message.includes("Hata") ? "#EF4444" : "#22B573", border: '1px solid ' + (message.includes("Hata") ? "rgba(239,68,68, 0.2)" : "rgba(34,181,115, 0.2)") }}>
          {message}
        </div>
      )}
      
      <div className="glass-strong" style={{ padding: 32, borderRadius: 24, border: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 40 }}>
            <label style={{ cursor: "pointer", position: "relative" }}>
              <img src={avatar} alt="Avatar" style={{ width: 80, height: 80, borderRadius: 20, objectFit: "cover", border: "2px solid rgba(255,122,89, 0.3)" }} />
              <input type="file" accept="image/*" onChange={handleAvatarUpload} style={{ display: "none" }} />
              <div style={{ position: "absolute", bottom: -8, right: -8, background: "var(--primary)", color: "#000", padding: 6, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M4 4h3l2-2h6l2 2h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm8 3a5 5 0 1 0 0 10 5 5 0 0 0 0-10z"/></svg>
              </div>
            </label>
          </div>
        
        <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div>
              <label style={{ display: "block", color: "var(--text-secondary)", fontSize: 13, marginBottom: 8, fontWeight: 500 }}>Yetkili Kişi Adı Soyadı</label>
              <input type="text" value={authorizedPerson} onChange={e => setAuthorizedPerson(e.target.value)} placeholder="Örn: Mehmet Yılmaz" className="glass-input" style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.2)", color: "#fff", marginBottom: 20 }} />
            </div>
            <div>
              <label style={{ display: "block", color: "var(--text-secondary)", fontSize: 13, marginBottom: 8, fontWeight: 500 }}>İşletme Adı</label>
              <input type="text" value={businessName} onChange={e => setBusinessName(e.target.value)} placeholder="İşletmenizin adını girin" className="glass-input" style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.2)", color: "#fff" }} />
            </div>
            <div>
              <label style={{ display: "block", color: "var(--text-secondary)", fontSize: 13, marginBottom: 8, fontWeight: 500 }}>E-posta</label>
              <input type="email" value={email} disabled className="glass-input" style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.2)", color: "#fff", opacity: 0.6 }} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div>
              <label style={{ display: "block", color: "var(--text-secondary)", fontSize: 13, marginBottom: 8, fontWeight: 500 }}>Telefon</label>
              <input type="text" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Telefon numarasını girin" className="glass-input" style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.2)", color: "#fff" }} />
            </div>
            <div>
              <label style={{ display: "block", color: "var(--text-secondary)", fontSize: 13, marginBottom: 8, fontWeight: 500 }}>Mağaza Kategorisi</label>
              <input type="text" value={category} onChange={e => setCategory(e.target.value)} placeholder="Örn: Cafe & Restoran, Kuaför..." className="glass-input" style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.2)", color: "#fff" }} />
            </div>
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div>
              <label style={{ display: "block", color: "var(--text-secondary)", fontSize: 13, marginBottom: 8, fontWeight: 500 }}>Vergi Numarası (VKN)</label>
              <input type="text" value={vkn} onChange={e => setVkn(e.target.value)} placeholder="VKN girin" className="glass-input" style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.2)", color: "#fff" }} />
            </div>
            <div>
              <label style={{ display: "block", color: "var(--text-secondary)", fontSize: 13, marginBottom: 8, fontWeight: 500 }}>Vergi Dairesi</label>
              <input type="text" value={taxOffice} onChange={e => setTaxOffice(e.target.value)} placeholder="Vergi dairesini girin" className="glass-input" style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.2)", color: "#fff" }} />
            </div>
          </div>
          
                    <div>
            <label style={{ display: "block", color: "var(--text-secondary)", fontSize: 13, marginBottom: 8, fontWeight: 500 }}>Adres Bilgileri</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
                            <select 
                value={addressObj.country} 
                onChange={e => setAddressObj({...addressObj, country: e.target.value, city: "", district: ""})}
                className="glass-input" 
                style={{ width: "100%", padding: "12px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.2)", color: "#fff" }}
              >
                <option value="">Ülke Seçin</option>
                {Country.getAllCountries().map(c => <option key={c.isoCode} value={c.isoCode}>{c.name}</option>)}
              </select>
              
              <select 
                value={addressObj.city} 
                onChange={e => setAddressObj({...addressObj, city: e.target.value, district: ""})}
                disabled={!addressObj.country}
                className="glass-input" 
                style={{ width: "100%", padding: "12px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.2)", color: "#fff", opacity: addressObj.country ? 1 : 0.5 }}
              >
                <option value="">Şehir / Eyalet Seçin</option>
                {addressObj.country && State.getStatesOfCountry(addressObj.country).map(s => <option key={s.isoCode} value={s.isoCode}>{s.name}</option>)}
              </select>

              <select 
                value={addressObj.district} 
                onChange={e => setAddressObj({...addressObj, district: e.target.value})}
                disabled={!addressObj.city}
                className="glass-input" 
                style={{ width: "100%", padding: "12px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.2)", color: "#fff", opacity: addressObj.city ? 1 : 0.5 }}
              >
                <option value="">İlçe Seçin</option>
                {addressObj.country && addressObj.city && City.getCitiesOfState(addressObj.country, addressObj.city).map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
              </select>
            </div>
            <textarea 
              value={addressObj.fullAddress} 
              onChange={e => setAddressObj({...addressObj, fullAddress: e.target.value})} 
              rows={3} 
              placeholder="Açık adresinizi girin" 
              className="glass-input" 
              style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.2)", color: "#fff", resize: "vertical" }} 
            />
          </div>
          
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
            <button type="submit" disabled={saving} className="pill-btn" style={{ padding: "12px 32px", borderRadius: 12, background: "var(--accent-primary, #22B573)", color: "#000", fontWeight: 600, border: "none", cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1 }}>
              {saving ? "Kaydediliyor..." : "Profili Kaydet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}












