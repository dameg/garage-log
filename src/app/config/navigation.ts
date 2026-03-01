import { LayoutDashboard, Car } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type NavItem = {
  label: string;
  to: string;
  icon?: LucideIcon;
  end?: boolean;
};

export const sidebarNav: NavItem[] = [
  {
    label: "Dashboard",
    to: "/",
    icon: LayoutDashboard,
    end: true,
  },
  {
    label: "Vehicles",
    to: "/vehicles",
    icon: Car,
  },
];
