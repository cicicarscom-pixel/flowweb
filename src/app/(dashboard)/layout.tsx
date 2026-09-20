import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { RealtimeProvider } from "@/providers/ProfileProvider";

export const dynamic = 'force-dynamic';

export default async function DashboardLayout({
 children,
}: {
 children: React.ReactNode;
}) {
 const supabase = await createClient();
 const { data: { session } } = await supabase.auth.getSession();
 
 if (!session) {
   redirect("/login");
 }

 if (!session.user.email_confirmed_at) {
   redirect("/verify-email");
 }

 const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
 if (profile && profile.user_type === 'business' && profile.onboarding_completed === false) {
   redirect("/onboarding");
 }

 const { data: orgMember } = await supabase.from('organization_members').select('organization_id').eq('user_id', session.user.id).single();
 let organization = null;
 if (orgMember) {
   const { data: orgData } = await supabase.from('organizations').select('*').eq('id', orgMember.organization_id).single();
   organization = orgData;
 }

 return (
 <RealtimeProvider initialProfile={profile} initialOrg={organization} userId={session.user.id}>
 <div className=" text-[#e2e8f0] min-h-screen w-full flex overflow-hidden font-sans">
 <Sidebar />
 <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
 <Header />
 
 <main className="flex-1 overflow-y-auto relative z-0">
 {children}
 </main>
 </div>
 </div>
 </RealtimeProvider>
 );
}
