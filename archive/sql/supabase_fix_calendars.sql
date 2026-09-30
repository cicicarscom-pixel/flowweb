-- 1. Yabancı Anahtar (Foreign Key) Güncellemeleri

-- Önce mevcut kısıtlamaları (constraint) kaldıralım
ALTER TABLE calendar_services
DROP CONSTRAINT IF EXISTS calendar_services_calendar_id_fkey;

ALTER TABLE appointments
DROP CONSTRAINT IF EXISTS appointments_calendar_id_fkey;

-- Şimdi doğru davranışlarla (ON DELETE) yeniden ekleyelim

-- calendar_services: Takvim silinirse ona bağlı servis atamaları da tamamen silinsin
ALTER TABLE calendar_services
ADD CONSTRAINT calendar_services_calendar_id_fkey
FOREIGN KEY (calendar_id) REFERENCES calendars(id)
ON DELETE CASCADE;

-- appointments: Takvim silinirse geçmiş randevular silinmesin, sadece takvim bağlantısı kopsun (SET NULL)
-- Not: Muhasebe ve geçmiş kayıt bütünlüğü için en doğrusu budur.
ALTER TABLE appointments
ADD CONSTRAINT appointments_calendar_id_fkey
FOREIGN KEY (calendar_id) REFERENCES calendars(id)
ON DELETE SET NULL;


-- 2. Hayalet (Ghost) Takvimleri Temizleme
-- merchant_id alanı boş olan ve muhtemelen test amaçlı oluşturulup arayüzde bug'a sebep olan tüm kayıtları kalıcı olarak siliyoruz.
DELETE FROM calendars
WHERE merchant_id IS NULL;
