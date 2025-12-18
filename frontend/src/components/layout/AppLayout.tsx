import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useTaskSocket } from "@/hooks/useTaskSocket";
export default function AppLayout() {
  useTaskSocket();
  return (
    <div className="h-screen flex overflow-hidden">
       <div className="hidden md:flex">
    <Sidebar />
  </div>

      <div className="flex flex-col flex-1">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-6 bg-muted/40">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
