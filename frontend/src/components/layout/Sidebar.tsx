import SidebarItem from "./SidebarItem";
import { sidebarItems } from "@/config/sidebar.config";

export default function Sidebar() {
  return (
    <aside className=" md:flex w-64 flex-col border-r bg-background">
      <div className="h-16 px-6 flex items-center font-semibold text-lg">
        AbleSpace
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {sidebarItems.map((item) => (
          <SidebarItem key={item.href} {...item} />
        ))}
      </nav>
    </aside>
  );
}
