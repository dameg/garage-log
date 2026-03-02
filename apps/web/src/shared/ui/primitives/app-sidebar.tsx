import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/shared/ui/primitives/sidebar";
import { Link, useMatch } from "react-router-dom";
import { sidebarNav, type NavItem } from "@/app/config/navigation";

function SidebarNavItem({ item }: { item: NavItem }) {
  const match = useMatch({ path: item.to, end: item.end ?? false });
  const isActive = !!match;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive}>
        <Link to={item.to}>
          {item.icon ? <item.icon className="h-4 w-4" /> : null}
          <span>{item.label}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>Logo</SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {sidebarNav.map((item) => {
              return <SidebarNavItem key={item.to} item={item} />;
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
