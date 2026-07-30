import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#070714] text-white min-h-screen flex overflow-hidden font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <Header />
        
        <main className="flex-1 overflow-y-auto relative z-0">
          {children}
        </main>
      </div>
    </div>
  );
}
