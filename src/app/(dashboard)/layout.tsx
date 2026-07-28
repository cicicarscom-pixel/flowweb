import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Sidebar />
      <main className="flex-1 flex flex-col md:ml-[280px] h-screen overflow-hidden">
        <Header />
        <div className="flex-1 overflow-y-auto p-margin-mobile md:p-margin-desktop space-y-xl">
          {children}
          <div className="h-lg w-full"></div>
        </div>
      </main>
    </>
  );
}
