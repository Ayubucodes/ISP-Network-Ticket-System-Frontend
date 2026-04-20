"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Ticket,
  PlusCircle,
  Activity,
} from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/tickets", label: "Tickets", icon: Ticket },
  { href: "/tickets/new", label: "Create Ticket", icon: PlusCircle, customerOnly: true },
];

export function Sidebar({ open, onClose }) {
  const pathname = usePathname();
  const { isAdmin } = useAuth();
  const nav = NAV_ITEMS.filter((item) => !item.customerOnly || !isAdmin);

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity",
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      <aside
        className={cn(
          "fixed lg:sticky top-0 left-0 z-50 h-screen w-72 shrink-0",
          "border-r border-white/[0.06] bg-[#0d0d17]/95 backdrop-blur-xl",
          "flex flex-col transition-transform duration-300",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Brand */}
        <div className="px-5 h-16 flex items-center border-b border-white/[0.06]">
          <div className="leading-tight">
            <div className="text-white font-semibold tracking-tight text-sm">
              ISP Network
            </div>
            <div className="text-[11px] text-white/40 uppercase tracking-wider">
              Ticket System
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="px-3 text-[11px] font-semibold text-white/30 uppercase tracking-wider mb-2">
            Workspace
          </div>
          {nav.map((item) => {
            const Icon = item.icon;
            const active =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                  active
                    ? "bg-gradient-to-r from-[#7c5cff]/20 to-transparent text-white border border-white/[0.06]"
                    : "text-white/60 hover:text-white hover:bg-white/[0.04] border border-transparent"
                )}
              >
                {active ? (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r bg-gradient-to-b from-[#8b6bff] to-[#22d3ee]" />
                ) : null}
                <Icon
                  className={cn(
                    "h-4.5 w-4.5 transition-colors",
                    active ? "text-violet-300" : "text-white/40 group-hover:text-white/70"
                  )}
                />
                {item.label}
              </Link>
            );
          })}

          <div className="px-3 text-[11px] font-semibold text-white/30 uppercase tracking-wider mt-6 mb-2">
            Insights
          </div>
          <div className="px-3 py-2.5 rounded-xl text-sm text-white/50 flex items-center gap-3">
            <Activity className="h-4.5 w-4.5 text-white/40" />
            Network status
            <span className="ml-auto inline-flex items-center gap-1.5 text-xs text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Healthy
            </span>
          </div>
        </nav>

      </aside>
    </>
  );
}
