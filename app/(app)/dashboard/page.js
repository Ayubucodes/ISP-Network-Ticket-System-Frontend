"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  PlusCircle,
  Activity,
  Wifi,
  Server,
  ShieldCheck,
  Clock,
  AlertTriangle,
  Inbox,
  Ticket as TicketIcon,
  Users,
  CheckCircle2,
  Hourglass,
  CircleDot,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusBadge, Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { listTickets } from "@/lib/api";
import { useAuth } from "@/components/providers/AuthProvider";
import { cn, formatRelative } from "@/lib/utils";

export default function DashboardPage() {
  const { user, role, isAdmin } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  const displayName = (user?.name || user?.email || "there").split(" ")[0];
  const planLabel = user?.plan || "Fiber Pro";

  const stats = useMemo(() => buildStats(tickets, isAdmin), [tickets, isAdmin]);
  const activeTickets = useMemo(
    () =>
      tickets
        .filter((t) => t.status !== "resolved")
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        .slice(0, 5),
    [tickets]
  );
  const recentActivity = useMemo(() => buildActivity(tickets), [tickets]);

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl border border-white/[0.06] bg-gradient-to-br from-white/[0.04] to-transparent p-6 lg:p-8">
        <div className="absolute -top-24 -right-10 h-64 w-64 rounded-full bg-[#7c5cff]/20 blur-3xl" />
        <div className="absolute -bottom-32 left-10 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs text-white/60">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {isAdmin ? "All systems operational" : "Connection healthy"}
              <span className="mx-1 text-white/20">•</span>
              <span className="capitalize">{role}</span>
            </div>
            <h1 className="mt-3 text-3xl lg:text-4xl font-semibold tracking-tight text-white">
              {greet()}, {displayName}.
            </h1>
            <p className="mt-2 text-white/60 max-w-xl">
              {isAdmin
                ? "Here's a live snapshot of your support queue and network."
                : `You're on the ${planLabel} plan. Here's the status of your service and tickets.`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {!isAdmin ? (
              <Button as={Link} href="/tickets/new" size="md">
                <PlusCircle className="h-4 w-4" /> New ticket
              </Button>
            ) : null}
            <Button as={Link} href="/tickets" size="md" variant="secondary">
              View all <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Error banner */}
      {error ? (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </div>
      ) : null}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading
          ? [0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-28" />)
          : stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active tickets */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex items-center justify-between flex-row">
              <div>
                <CardTitle>
                  {isAdmin ? "Active tickets" : "Your active tickets"}
                </CardTitle>
                <CardDescription>
                  {isAdmin
                    ? "Most recently updated open items across the queue."
                    : "Tickets we're currently working on for you."}
                </CardDescription>
              </div>
              <Button as={Link} href="/tickets" variant="ghost" size="sm">
                View all <ArrowRight className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="pt-0">
              {loading ? (
                <div className="space-y-3">
                  {[0, 1, 2].map((i) => (
                    <Skeleton key={i} className="h-16" />
                  ))}
                </div>
              ) : activeTickets.length === 0 ? (
                <EmptyState
                  icon={Inbox}
                  title={isAdmin ? "Nothing in the queue" : "No active tickets"}
                  description={
                    isAdmin
                      ? "All caught up — there are no open tickets right now."
                      : "You're all set. Open a new ticket if you need help."
                  }
                  action={
                    <Button as={Link} href="/tickets/new" size="sm">
                      <PlusCircle className="h-4 w-4" /> New ticket
                    </Button>
                  }
                />
              ) : (
                <div className="divide-y divide-white/[0.05]">
                  {activeTickets.map((t) => (
                    <Link
                      href={`/tickets/${t.id}`}
                      key={t.id}
                      className="flex items-center gap-4 py-4 group"
                    >
                      <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                        {t.priority === "high" ? (
                          <AlertTriangle className="h-4.5 w-4.5 text-rose-300" />
                        ) : (
                          <Activity className="h-4.5 w-4.5 text-violet-300" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-mono text-white/40">
                            {t.id}
                          </span>
                          <StatusBadge status={t.status} />
                        </div>
                        <div className="mt-1 text-sm font-medium text-white truncate group-hover:text-violet-200 transition">
                          {t.title}
                        </div>
                      </div>
                      <div className="hidden md:flex items-center gap-3 text-xs text-white/50 shrink-0">
                        <Clock className="h-3.5 w-3.5" />
                        {formatRelative(t.updatedAt)}
                        <ArrowRight className="h-4 w-4 text-white/30 group-hover:translate-x-0.5 transition" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Status breakdown bars */}
          <Card>
            <CardHeader>
              <CardTitle>
                {isAdmin ? "Queue breakdown" : "Ticket breakdown"}
              </CardTitle>
              <CardDescription>
                {isAdmin
                  ? "How tickets are distributed across statuses."
                  : "Your tickets by status."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-16" />
              ) : (
                <StatusBar tickets={tickets} />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {isAdmin ? null : (
            <Card>
              <CardHeader>
                <CardTitle>Your plan</CardTitle>
                <CardDescription>Current subscription details.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-2xl border border-white/[0.06] bg-gradient-to-br from-violet-500/10 to-transparent p-4">
                  <div className="text-xs uppercase tracking-wider text-violet-300">
                    Active plan
                  </div>
                  <div className="mt-1 text-xl font-semibold text-white">
                    {planLabel}
                  </div>
                  <div className="mt-3 text-sm text-white/60">
                    Symmetrical speeds · 24/7 priority support
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Recent activity</CardTitle>
              <CardDescription>Latest updates on your tickets.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                [0, 1, 2].map((i) => <Skeleton key={i} className="h-10" />)
              ) : recentActivity.length === 0 ? (
                <div className="text-sm text-white/40">No activity yet.</div>
              ) : (
                recentActivity.map((a) => (
                  <div key={a.id} className="flex items-start gap-3">
                    <span
                      className={cn(
                        "mt-1.5 h-2 w-2 rounded-full shrink-0",
                        a.tone === "red" && "bg-rose-400",
                        a.tone === "amber" && "bg-amber-400",
                        a.tone === "green" && "bg-emerald-400",
                        a.tone === "violet" && "bg-violet-400"
                      )}
                    />
                    <div className="min-w-0">
                      <Link
                        href={`/tickets/${a.ticketId}`}
                        className="text-sm text-white/80 hover:text-white line-clamp-2"
                      >
                        {a.text}
                      </Link>
                      <div className="text-xs text-white/40">
                        {formatRelative(a.at)}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* -------- helpers -------- */

function greet() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function buildStats(tickets, isAdmin) {
  const total = tickets.length;
  const open = tickets.filter((t) => t.status === "open").length;
  const inProgress = tickets.filter((t) => t.status === "in_progress").length;
  const resolved = tickets.filter((t) => t.status === "resolved").length;
  const resolutionRate = total ? Math.round((resolved / total) * 100) : 0;

  if (isAdmin) {
    return [
      {
        label: "Open",
        value: open,
        tone: "red",
        icon: CircleDot,
        hint: open === 1 ? "ticket awaiting triage" : "tickets awaiting triage",
      },
      {
        label: "In progress",
        value: inProgress,
        tone: "amber",
        icon: Hourglass,
        hint: "being worked on",
      },
      {
        label: "Resolved",
        value: resolved,
        tone: "green",
        icon: CheckCircle2,
        hint: total ? `${resolutionRate}% resolution rate` : "no tickets yet",
      },
      {
        label: "Total",
        value: total,
        tone: "violet",
        icon: TicketIcon,
        hint: total === 1 ? "ticket in the queue" : "tickets in the queue",
      },
    ];
  }

  return [
    {
      label: "Open",
      value: open,
      tone: "red",
      icon: CircleDot,
      hint: "awaiting response",
    },
    {
      label: "In progress",
      value: inProgress,
      tone: "amber",
      icon: Hourglass,
      hint: "being worked on",
    },
    {
      label: "Resolved",
      value: resolved,
      tone: "green",
      icon: CheckCircle2,
      hint: "fixed for you",
    },
    {
      label: "Total",
      value: total,
      tone: "violet",
      icon: TicketIcon,
      hint: total === 1 ? "ticket submitted" : "tickets submitted",
    },
  ];
}

function buildActivity(tickets) {
  return [...tickets]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 5)
    .map((t, i) => ({
      id: `${t.id}-${i}`,
      ticketId: t.id,
      text:
        t.status === "resolved"
          ? `${t.id} was marked as Resolved`
          : t.status === "in_progress"
            ? `${t.id} is in progress — ${t.title}`
            : `${t.id} opened — ${t.title}`,
      at: t.updatedAt,
      tone:
        t.status === "resolved"
          ? "green"
          : t.status === "in_progress"
            ? "amber"
            : "red",
    }));
}

/* -------- subcomponents -------- */

function StatCard({ label, value, tone, icon: Icon, hint }) {
  return (
    <Card className="p-5 group hover:border-white/[0.12] transition">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs uppercase tracking-wider text-white/40">
            {label}
          </div>
          <div className="mt-2 text-3xl font-semibold text-white tabular-nums">
            {value}
          </div>
        </div>
        <div
          className={cn(
            "h-10 w-10 rounded-xl border flex items-center justify-center",
            tone === "red" && "bg-rose-500/10 border-rose-500/20 text-rose-300",
            tone === "amber" &&
            "bg-amber-500/10 border-amber-500/20 text-amber-300",
            tone === "green" &&
            "bg-emerald-500/10 border-emerald-500/20 text-emerald-300",
            tone === "violet" &&
            "bg-violet-500/10 border-violet-500/20 text-violet-300"
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-3 text-xs text-white/50">{hint}</div>
    </Card>
  );
}

function StatusBar({ tickets }) {
  const total = tickets.length || 1;
  const open = tickets.filter((t) => t.status === "open").length;
  const inProgress = tickets.filter((t) => t.status === "in_progress").length;
  const resolved = tickets.filter((t) => t.status === "resolved").length;

  if (tickets.length === 0) {
    return (
      <div className="text-sm text-white/40 py-4 text-center">
        No tickets yet — create one to get started.
      </div>
    );
  }

  const pct = (n) => `${(n / total) * 100}%`;

  return (
    <div className="space-y-4">
      <div className="flex h-3 rounded-full overflow-hidden bg-white/5 border border-white/10">
        <div className="bg-rose-400/80" style={{ width: pct(open) }} />
        <div className="bg-amber-400/80" style={{ width: pct(inProgress) }} />
        <div className="bg-emerald-400/80" style={{ width: pct(resolved) }} />
      </div>
      <div className="grid grid-cols-3 gap-3 text-xs">
        <Legend dotClass="bg-rose-400" label="Open" value={open} total={total} />
        <Legend
          dotClass="bg-amber-400"
          label="In progress"
          value={inProgress}
          total={total}
        />
        <Legend
          dotClass="bg-emerald-400"
          label="Resolved"
          value={resolved}
          total={total}
        />
      </div>
    </div>
  );
}

function Legend({ dotClass, label, value, total }) {
  const pct = total ? Math.round((value / total) * 100) : 0;
  return (
    <div className="flex items-center gap-2">
      <span className={cn("h-2 w-2 rounded-full", dotClass)} />
      <div>
        <div className="text-white/80">{label}</div>
        <div className="text-white/40 tabular-nums">
          {value} · {pct}%
        </div>
      </div>
    </div>
  );
}

function HealthRow({ icon: Icon, label, value, tone, sub }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3">
      <div className="h-9 w-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
        <Icon className="h-4 w-4 text-violet-300" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs text-white/50">{label}</div>
        <div className="text-sm font-medium text-white">{value}</div>
      </div>
      <Badge tone={tone} dot>
        {sub}
      </Badge>
    </div>
  );
}
