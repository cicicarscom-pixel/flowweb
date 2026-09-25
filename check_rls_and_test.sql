-- 1. Gerçek Silme Testi (Arayüzde takılan 'deneme' takvimi için)
-- Önce bu takvimin ID'sini ve merchant_id'sini görelim:
SELECT id, name, merchant_id 
FROM public.calendars 
WHERE name = 'deneme';

-- Sonra doğrudan SQL üzerinden silelim (SQL Editor RLS'yi atlar, bu yüzden gerçek bir kısıtlama hatası varsa burada kesin patlar):
DELETE FROM public.calendars 
WHERE name = 'deneme';

-- 2. RLS Politikalarının Kontrolü (Asıl Kök Nedeni Bulmak İçin)
-- 'calendars' tablosundaki tüm güvenlik politikalarını listeleyelim:
SELECT polname, polcmd, polroles, polqual, polwithcheck 
FROM pg_policy 
WHERE polrelid = 'public.calendars'::regclass;
