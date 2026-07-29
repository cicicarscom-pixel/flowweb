import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background text-on-background min-h-screen flex overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-surface-container-low via-background to-background relative">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-primary opacity-5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-80 h-80 bg-secondary opacity-5 rounded-full blur-3xl pointer-events-none"></div>
        
        <Header />
        
        <main className="flex-1 overflow-y-auto relative z-0">
          {children}
        </main>
      </div>
    </div>
  );
}
