import { createClient } from '@/utils/supabase/server';
import { getBusinessServices } from '@/actions/businessServices';
import HizmetAyarlariClient from './HizmetAyarlariClient';

export default async function IsletmeHizmetleriPage() {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    return <div>Oturum bulunamadý.</div>;
  }
  
  const services = await getBusinessServices(session.user.id);
  
  return <HizmetAyarlariClient initialServices={services} merchantId={session.user.id} />;
}
