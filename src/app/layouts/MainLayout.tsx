import { AppSidebar as Sidebar } from "@/shared/ui/primitives/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/shared/ui/primitives/sidebar";
import { Outlet } from "react-router-dom";
import { Header } from "@/widgets/Header";

export function MainLayout() {
  return (
    <SidebarProvider>
      <Sidebar />
      <SidebarInset>
        <Header />
        <main className="p-4">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
