import {
  LayoutDashboard,
  CheckSquare,
} from "lucide-react";

export interface SidebarItem {
  title: string;
  href: string;
  icon: any;
}

export const sidebarItems: SidebarItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Tasks",
    href: "/tasks",
    icon: CheckSquare,
  },
];
