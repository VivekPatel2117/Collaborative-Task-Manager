import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

interface Props {
  title: string;
  href: string;
  icon: any;
}

export default function SidebarItem({ title, href, icon: Icon }: Props) {
  return (
    <NavLink
      to={href}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition",
          isActive
            ? "bg-black text-white"
            : "text-muted-foreground hover:bg-muted"
        )
      }
    >
      <Icon size={18} />
      {title}
    </NavLink>
  );
}
