import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Gelen webhook paketini Supabase'e yönlendir (Proxy)
    const res = await fetch('https://qybzidylewzsnmlofjul.supabase.co/functions/v1/waha-webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    
    return NextResponse.json({ proxy_success: true, supabase_status: res.status });
  } catch(e: any) {
    return NextResponse.json({ proxy_success: false, error: e.message });
  }
}
