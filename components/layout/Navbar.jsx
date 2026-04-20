"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Search,
  Menu as MenuIcon,
  ChevronDown,
  LogOut,
  Command,
  ShieldCheck,
} from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { useAuth } from "@/components/providers/AuthProvider";
import { cn } from "@/lib/utils";

function getInitials(name = "") {
  const parts = name.trim().split(/\s+/);
  if (!parts[0]) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function Navbar({ onToggleSidebar }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const { user, role, isAdmin, logout } = useAuth();

  const displayName = user?.name || user?.email || "Guest";
  const displayEmail = user?.email || "";
  const initials = getInitials(user?.name || user?.email || "?");

  useEffect(() => {
    function onClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-white/[0.06] bg-[#0b0b12]/70 backdrop-blur-xl">
      <div className="h-full px-4 lg:px-6 flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden h-10 w-10 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-white/70 hover:text-white"
          aria-label="Toggle sidebar"
        >
          <MenuIcon className="h-5 w-5" />
        </button>

        {/* Search */}
        <div className="flex-1 max-w-xl relative group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          <input
            placeholder="Search tickets, customers, nodes…"
            className="w-full h-10 pl-10 pr-20 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#7c5cff]/60 focus:ring-2 focus:ring-[#7c5cff]/20 transition"
          />
          <kbd className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 items-center gap-1 h-6 px-1.5 rounded-md bg-white/5 border border-white/10 text-[11px] text-white/50">
            <Command className="h-3 w-3" /> K
          </kbd>
        </div>

        <div className="ml-auto flex items-center gap-2">
          {/* Role badge */}
          <div
            className={cn(
              "hidden md:inline-flex items-center gap-2 h-10 px-3 rounded-2xl text-xs font-medium border transition",
              isAdmin
                ? "border-violet-400/30 bg-violet-500/10 text-violet-200"
                : "border-white/10 bg-white/5 text-white/70"
            )}
            title={`Signed in as ${role}`}
          >
            <ShieldCheck
              className={cn("h-3.5 w-3.5", isAdmin ? "text-violet-300" : "text-white/50")}
            />
            <span className="capitalize">{role}</span>
          </div>

          {/* Profile */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setOpen((v) => !v)}
              className="h-10 pl-1 pr-2.5 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition flex items-center gap-2"
            >
              <Avatar name={displayName} initials={initials} size="sm" />
              <div className="hidden sm:flex flex-col items-start leading-tight">
                <span className="text-xs font-medium text-white">{displayName}</span>
                <span className="text-[11px] text-white/40 capitalize">{role}</span>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-white/50" />
            </button>

            <div
              className={cn(
                "absolute right-0 mt-2 w-64 origin-top-right rounded-2xl border border-white/10 bg-[#12121c]/95 backdrop-blur-xl shadow-2xl overflow-hidden transition-all",
                open
                  ? "opacity-100 translate-y-0 pointer-events-auto"
                  : "opacity-0 -translate-y-1 pointer-events-none"
              )}
            >
              <div className="px-4 py-3 border-b border-white/[0.06]">
                <div className="text-sm font-medium text-white">{displayName}</div>
                <div className="text-xs text-white/50 truncate">{displayEmail}</div>
              </div>
              <div className="p-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-xl transition text-rose-300 hover:bg-rose-500/10"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

