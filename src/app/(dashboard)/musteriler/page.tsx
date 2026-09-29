import { getCustomers } from '@/actions/customers';
import MusterilerClient from './MusterilerClient';

export default async function MusterilerPage() {
  const customers = await getCustomers();
  
  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "20px 0" }}>
      <MusterilerClient initialCustomers={customers} />
    </div>
  );
}