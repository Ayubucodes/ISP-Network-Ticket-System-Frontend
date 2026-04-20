"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";

export function AppShell({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen flex">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onToggleSidebar={() => setOpen((v) => !v)} />
        <main className="flex-1 p-4 lg:p-8 fade-up">{children}</main>
      </div>
    </div>
  );
}
