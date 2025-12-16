import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function AppLayout() {
  return (
    <div className="h-screen flex overflow-hidden">
      <Sidebar />

      <div className="flex flex-col flex-1">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-6 bg-muted/40">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
