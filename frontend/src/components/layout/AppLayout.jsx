import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";

export const AppLayout = () => (
  <div className="min-h-screen">
    <Navbar />
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <Outlet />
    </main>
  </div>
);
