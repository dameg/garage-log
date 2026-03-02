import { AppSidebar as Sidebar } from "@/shared/ui/primitives/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/shared/ui/primitives/sidebar";
import { Outlet } from "react-router-dom";
import { Header } from "@/widgets/Header";

export function MainLayout() {
  return (
    <SidebarProvider>
      <Sidebar />
      <SidebarInset className="flex h-screen min-h-0 flex-col">
        <Header />
        <div className="flex-1 overflow-auto p-4">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
