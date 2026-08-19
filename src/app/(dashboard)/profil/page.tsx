"use client";

import React, { useState, useEffect } from "react";
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
  const [address, setAddress] = useState("");
  const [avatar, setAvatar] = useState("");
  
  const [vkn, setVkn] = useState("");
  const [taxOffice, setTaxOffice] = useState("");
  const [organizationId, setOrganizationId] = useState("");
  
  const supabase = createClient();

  useEffect(() => {
    fetchProfileData();
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
          let parts = [];
          if (profile.address.fullAddress) parts.push(profile.address.fullAddress);
          else if (profile.address.detail) parts.push(profile.address.detail);
          
          if (profile.address.district) parts.push(profile.address.district);
          if (profile.address.city) parts.push(profile.address.city);
          
          let formatted = parts.filter(Boolean).join(", ");
          setAddress(formatted || JSON.stringify(profile.address));
        } else {
          setAddress(profile.address || "");
        }

                let av = profile.avatar_url;
        if (!av || av.startsWith('file://')) {
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Oturum bulunamadı");
      
      // Keep mobile's AddressSelector compatibility if it expects an object. 
      // If the user types in text, we can just save it as text, or wrap it in { fullAddress: text }
      let addressToSave: any = address;
      try {
        if (address.startsWith('{')) {
          addressToSave = JSON.parse(address);
        } else {
          addressToSave = { fullAddress: address };
        }
      } catch (e) {
        addressToSave = address;
      }

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
        <div style={{ padding: 16, borderRadius: 12, marginBottom: 24, background: message.includes("Hata") ? "rgba(255, 77, 77, 0.1)" : "rgba(78, 222, 163, 0.1)", color: message.includes("Hata") ? "#ff4d4d" : "#4edea3", border: '1px solid ' + (message.includes("Hata") ? "rgba(255, 77, 77, 0.2)" : "rgba(78, 222, 163, 0.2)") }}>
          {message}
        </div>
      )}
      
      <div className="glass-strong" style={{ padding: 32, borderRadius: 24, border: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 40 }}>
          <img src={avatar} alt="Avatar" style={{ width: 80, height: 80, borderRadius: 20, objectFit: "cover", border: "2px solid rgba(0, 240, 255, 0.3)" }} />
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 600, color: "#fff", marginBottom: 4 }}>{businessName || "İşletme Adı"}</h2>
            <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>{email}</p>
          </div>
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
            <textarea value={address} onChange={e => setAddress(e.target.value)} rows={3} placeholder="Açık adresinizi girin" className="glass-input" style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.2)", color: "#fff", resize: "vertical" }} />
          </div>
          
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
            <button type="submit" disabled={saving} className="pill-btn" style={{ padding: "12px 32px", borderRadius: 12, background: "var(--accent-primary, #4edea3)", color: "#000", fontWeight: 600, border: "none", cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1 }}>
              {saving ? "Kaydediliyor..." : "Profili Kaydet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}




