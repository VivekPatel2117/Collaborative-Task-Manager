import { Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";
import NotificationBell from "./NotificationBell";

export default function Navbar() {
    const { user } = useAuth();
    const navigate = useNavigate();

  return (
    <header className="h-16 border-b bg-background flex items-center justify-between px-4">
      {/* Mobile Sidebar */}
    <Sheet>
  <SheetTrigger asChild>
    <Button variant="ghost" size="icon" className="md:hidden">
      <Menu size={20} />
    </Button>
  </SheetTrigger>

  <SheetContent side="left" className="p-4">
    <Sidebar />
  </SheetContent>
</Sheet>

      <div className="font-semibold hidden md:block">
        Dashboard
      </div>

      <div className="flex items-center gap-3">
          <div className="text-sm">
        {user?.name.split(" ")[0]}
      </div>
       <NotificationBell/>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
               
              <User size={18} />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => navigate("/profile")}>Profile</DropdownMenuItem>
            <DropdownMenuItem className="text-red-500">
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
