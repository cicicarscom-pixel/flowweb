import { getTranslations } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import { getBusinessServices } from '@/actions/businessServices';
import HizmetAyarlariClient from './HizmetAyarlariClient';

export default async function IsletmeHizmetleriPage() {
  const t = await getTranslations();
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return <div>{t("hizmetAyarlari.sessionNotFound")}</div>;
  }
  
  const services = await getBusinessServices(session.user.id);
  
  return (
    <HizmetAyarlariClient initialServices={services} merchantId={session.user.id} />
  );
}
