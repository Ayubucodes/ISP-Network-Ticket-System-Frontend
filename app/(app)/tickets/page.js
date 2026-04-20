"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  PlusCircle,
  LayoutGrid,
  List,
  Inbox,
  ArrowRight,
  Clock,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { StatusBadge, PriorityBadge, Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { EmptyState } from "@/components/ui/EmptyState";
import { TicketCard } from "@/components/tickets/TicketCard";
import { TicketCardSkeleton } from "@/components/ui/Skeleton";
import { listTickets } from "@/lib/api";
import { useAuth } from "@/components/providers/AuthProvider";
import { cn, formatRelative } from "@/lib/utils";

const STATUSES = [
  { key: "all", label: "All" },
  { key: "open", label: "Open" },
  { key: "in_progress", label: "In Progress" },
  { key: "resolved", label: "Resolved" },
];

export default function TicketsPage() {
  const { isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tickets, setTickets] = useState([]);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [priority, setPriority] = useState("all");
  const [view, setView] = useState("grid");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const data = await listTickets();
        if (!cancelled) setTickets(data);
      } catch (err) {
        if (!cancelled) setError(err?.message || "Failed to load tickets.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Backend already scopes customer tickets to the authenticated user
  const scopedTickets = tickets;

  const filtered = useMemo(() => {
    return scopedTickets.filter((t) => {
      if (status !== "all" && t.status !== status) return false;
      if (priority !== "all" && t.priority !== priority) return false;
      if (q) {
        const s = q.toLowerCase();
        if (
          !t.title.toLowerCase().includes(s) &&
          !t.id.toLowerCase().includes(s) &&
          !t.customer.name.toLowerCase().includes(s)
        )
          return false;
      }
      return true;
    });
  }, [scopedTickets, q, status, priority]);

  const counts = useMemo(
    () => ({
      all: scopedTickets.length,
      open: scopedTickets.filter((t) => t.status === "open").length,
      in_progress: scopedTickets.filter((t) => t.status === "in_progress").length,
      resolved: scopedTickets.filter((t) => t.status === "resolved").length,
    }),
    [scopedTickets]
  );

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-semibold tracking-tight text-white">
            {isAdmin ? "Tickets" : "My tickets"}
          </h1>
          <p className="text-sm text-white/50 mt-1">
            {isAdmin
              ? "Browse, filter and triage your support queue."
              : "Track the status of the tickets you've opened with support."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button as={Link} href="/tickets/new" size="md">
            <PlusCircle className="h-4 w-4" /> New ticket
          </Button>
        </div>
      </div>

      {/* Status tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {STATUSES.map((s) => (
          <button
            key={s.key}
            onClick={() => setStatus(s.key)}
            className={cn(
              "inline-flex items-center gap-2 h-9 px-3.5 rounded-xl text-sm transition whitespace-nowrap border",
              status === s.key
                ? "bg-white/10 text-white border-white/15"
                : "bg-white/[0.03] text-white/60 border-white/[0.06] hover:text-white hover:bg-white/[0.06]"
            )}
          >
            {s.label}
            <span
              className={cn(
                "text-[11px] rounded-full px-1.5 py-0.5 border",
                status === s.key
                  ? "bg-white/10 border-white/10 text-white"
                  : "bg-white/[0.04] border-white/[0.06] text-white/50"
              )}
            >
              {counts[s.key]}
            </span>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center gap-3">
        <div className="flex-1">
          <Input
            icon={Search}
            placeholder="Search by title, ID, or customer…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="all">All priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </Select>
          <Button variant="secondary" size="md">
            <Filter className="h-4 w-4" /> More
          </Button>
          <div className="hidden sm:flex items-center rounded-2xl border border-white/10 bg-white/5 p-1">
            <button
              onClick={() => setView("grid")}
              className={cn(
                "h-8 w-8 rounded-xl flex items-center justify-center transition",
                view === "grid" ? "bg-white/10 text-white" : "text-white/50 hover:text-white"
              )}
              aria-label="Grid view"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setView("list")}
              className={cn(
                "h-8 w-8 rounded-xl flex items-center justify-center transition",
                view === "list" ? "bg-white/10 text-white" : "text-white/50 hover:text-white"
              )}
              aria-label="List view"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {error ? (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </div>
      ) : null}

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <TicketCardSkeleton key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="No tickets match your filters"
          description="Try adjusting your search term or clearing filters to see all tickets."
          action={
            <Button
              variant="secondary"
              onClick={() => {
                setQ("");
                setStatus("all");
                setPriority("all");
              }}
            >
              Clear filters
            </Button>
          }
        />
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((t) => (
            <TicketCard key={t.id} ticket={t} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
          <div className="hidden md:grid grid-cols-12 px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-white/40 border-b border-white/[0.06]">
            <div className="col-span-5">Ticket</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Priority</div>
            <div className="col-span-2">Customer</div>
            <div className="col-span-1 text-right">Updated</div>
          </div>
          <div className="divide-y divide-white/[0.05]">
            {filtered.map((t) => (
              <Link
                key={t.id}
                href={`/tickets/${t.id}`}
                className="grid grid-cols-1 md:grid-cols-12 items-center gap-2 px-5 py-4 hover:bg-white/[0.03] transition group"
              >
                <div className="md:col-span-5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-white/40">{t.id}</span>
                    <Badge tone="neutral">{t.category}</Badge>
                  </div>
                  <div className="mt-1 text-sm font-medium text-white truncate group-hover:text-violet-200">
                    {t.title}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <StatusBadge status={t.status} />
                </div>
                <div className="md:col-span-2">
                  <PriorityBadge priority={t.priority} />
                </div>
                <div className="md:col-span-2 flex items-center gap-2 min-w-0">
                  <Avatar name={t.customer.name} initials={t.customer.avatar} size="xs" />
                  <span className="text-xs text-white/70 truncate">{t.customer.name}</span>
                </div>
                <div className="md:col-span-1 flex md:justify-end items-center gap-3 text-xs text-white/40">
                  <span className="inline-flex items-center gap-1">
                    <MessageSquare className="h-3.5 w-3.5" />
                    {t.messages?.length ?? 0}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {formatRelative(t.updatedAt)}
                  </span>
                  <ArrowRight className="h-4 w-4 text-white/30 group-hover:translate-x-0.5 transition" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
