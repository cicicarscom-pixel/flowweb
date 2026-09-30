import { getAppointmentsByDate } from './src/actions/appointments';
import { createClient } from './src/lib/supabase/server';

async function test() {
  const res = await getAppointmentsByDate('2026-09-30');
  console.log('Appointments:', res.data?.length);
  console.log(res.data);
}
test();
