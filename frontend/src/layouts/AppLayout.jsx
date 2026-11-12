/**
 * Layout principal del ERP inmobiliario.
 *
 * Proporciona la estructura visual compartida por los
 * módulos administrativos.
 */

import { useState } from "react";

import { Outlet } from "react-router-dom";

import Sidebar from "../components/navigation/Sidebar";
import Topbar from "../components/navigation/Topbar";

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:z-60 focus:bg-surface focus:p-4">Ir al contenido</a>
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="min-h-screen lg:pl-68">
        <Topbar
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main
          id="main-content"
          className="mx-auto w-full max-w-400 px-5 py-7 sm:px-7 lg:px-10 lg:py-9"
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}