"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Send,
  MapPin,
  Tag,
  Calendar,
  User,
  Activity,
  CheckCircle2,
  Clock,
  MessageSquare,
  MoreHorizontal,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Textarea, Select } from "@/components/ui/Input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/Card";
import { StatusBadge, PriorityBadge, Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  createTicketComment,
  getTicket,
  listTicketComments,
  updateTicketStatus,
} from "@/lib/api";
import { useAuth } from "@/components/providers/AuthProvider";
import { formatRelative } from "@/lib/utils";

export default function TicketDetailsPage({ params }) {
  const { id } = use(params);
  const { isAdmin } = useAuth();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("open");
  const [savingStatus, setSavingStatus] = useState(false);
  const [statusError, setStatusError] = useState("");
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");

  async function changeStatus(next) {
    if (!isAdmin || !ticket || next === status || savingStatus) return;
    const previous = status;
    setStatus(next); // optimistic
    setSavingStatus(true);
    setStatusError("");
    try {
      const updated = await updateTicketStatus(ticket.rawId ?? id, next);
      setTicket((t) => ({ ...t, ...updated }));
      setStatus(updated.status);
    } catch (err) {
      setStatus(previous); // rollback
      setStatusError(err?.message || "Failed to update status.");
    } finally {
      setSavingStatus(false);
    }
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const t = await getTicket(id);
        if (cancelled) return;
        setTicket(t);
        setStatus(t.status);
        try {
          const comments = await listTicketComments(t.rawId ?? id);
          if (cancelled) return;
          const arr = Array.isArray(comments) ? comments : [];
          if (arr.length) {
            setMessages(
              arr.map((c, idx) => {
                const at = c.created_at || c.createdAt || c.at || new Date().toISOString();
                const rawId = c.id ?? c.ID ?? c.comment_id;
                const fallbackId = `comment-${t.rawId ?? id}-${at}-${idx}`;
                return {
                  id: rawId ?? fallbackId,
                  author: c.author?.name || c.user?.name || c.author || c.name || "User",
                  role: c.role || c.author?.role || c.user?.role || "customer",
                  avatar:
                    c.avatar ||
                    c.author?.avatar ||
                    c.user?.avatar ||
                    initialsOf(c.author?.name || c.user?.name || c.author || c.name || "U"),
                  at,
                  text: c.text || c.message || c.body || "",
                };
              })
            );
          } else {
            setMessages(
              t.messages?.length
                ? t.messages
                : [
                  {
                    id: 1,
                    author: t.customer.name,
                    role: "customer",
                    avatar: t.customer.avatar,
                    at: t.createdAt,
                    text: t.description || "(No description provided)",
                  },
                ]
            );
          }
        } catch {
          if (cancelled) return;
          setMessages(
            t.messages?.length
              ? t.messages
              : [
                {
                  id: 1,
                  author: t.customer.name,
                  role: "customer",
                  avatar: t.customer.avatar,
                  at: t.createdAt,
                  text: t.description || "(No description provided)",
                },
              ]
          );
        }
      } catch (err) {
        if (!cancelled) setError(err?.message || "Ticket not found.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  async function sendReply(e) {
    e.preventDefault();
    const text = draft.trim();
    if (!text || sending) return;

    setSendError("");
    setSending(true);

    const optimistic = {
      id: `optimistic-${Date.now()}`,
      author: "You",
      role: isAdmin ? "agent" : "customer",
      avatar: "YU",
      at: new Date().toISOString(),
      text,
      _optimistic: true,
    };

    setMessages((m) => [...m, optimistic]);
    setDraft("");

    try {
      const created = await createTicketComment(ticket?.rawId ?? id, { text });
      const normalized = {
        id: created?.id ?? created?.ID ?? created?.comment_id ?? optimistic.id,
        author:
          created?.author?.name ||
          created?.user?.name ||
          created?.author ||
          created?.name ||
          optimistic.author,
        role: created?.role || created?.author?.role || created?.user?.role || optimistic.role,
        avatar:
          created?.avatar ||
          created?.author?.avatar ||
          created?.user?.avatar ||
          optimistic.avatar,
        at: created?.created_at || created?.createdAt || created?.at || optimistic.at,
        text: created?.text || created?.message || created?.body || optimistic.text,
      };
      setMessages((m) => m.map((x) => (x.id === optimistic.id ? normalized : x)));
    } catch (err) {
      setMessages((m) => m.filter((x) => x.id !== optimistic.id));
      setDraft(text);
      setSendError(err?.message || "Failed to send reply.");
    } finally {
      setSending(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-[1400px] mx-auto space-y-6">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-10 w-3/5" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-40" />
            <Skeleton className="h-32" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-64" />
            <Skeleton className="h-40" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="max-w-xl mx-auto text-center py-16">
        <div className="flex items-center justify-center gap-2 text-rose-200 mb-3">
          <AlertCircle className="h-5 w-5" />
          <span className="font-medium">{error || "Ticket not found"}</span>
        </div>
        <p className="text-sm text-white/50">
          The ticket you&apos;re looking for doesn&apos;t exist or you don&apos;t have access to it.
        </p>
        <Button as={Link} href="/tickets" variant="secondary" className="mt-6">
          <ArrowLeft className="h-4 w-4" /> Back to tickets
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/tickets"
          className="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition"
        >
          <ArrowLeft className="h-4 w-4" /> Back to tickets
        </Link>
        <div className="mt-4 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-mono text-white/40 tracking-wider">
                {ticket.id}
              </span>
              <StatusBadge status={status} />
              <PriorityBadge priority={ticket.priority} />
              <Badge tone="neutral">
                <Tag className="h-3 w-3" /> {ticket.category}
              </Badge>
            </div>
            <h1 className="mt-3 text-2xl lg:text-3xl font-semibold tracking-tight text-white">
              {ticket.title}
            </h1>
          </div>

          {isAdmin ? (
            <div className="flex items-center gap-2">
              <Select
                value={status}
                onChange={(e) => changeStatus(e.target.value)}
                disabled={savingStatus}
                className="h-10 w-44"
              >
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </Select>
              <Button
                variant="secondary"
                size="md"
                onClick={() => changeStatus("resolved")}
                disabled={savingStatus || status === "resolved"}
              >
                <CheckCircle2 className="h-4 w-4" />
                {savingStatus ? "Saving…" : "Resolve"}
              </Button>
              <Button variant="ghost" size="icon" aria-label="More">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          ) : null}
        </div>
        {statusError ? (
          <div className="mt-3 flex items-start gap-2.5 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-3.5 py-2.5 text-sm text-rose-200">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            <span>{statusError}</span>
          </div>
        ) : null}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversation */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex items-center justify-between flex-row">
              <CardTitle className="inline-flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-violet-300" /> Conversation
              </CardTitle>
              <span className="text-xs text-white/40">
                {messages.length} message{messages.length === 1 ? "" : "s"}
              </span>
            </CardHeader>
            <CardContent className="space-y-5">
              {messages.map((m) => (
                <Message key={m.id} message={m} />
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Reply</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={sendReply} className="space-y-3">
                <Textarea
                  placeholder="Type your response…"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                />
                {sendError ? (
                  <div className="flex items-start gap-2.5 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-3.5 py-2.5 text-sm text-rose-200">
                    <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                    <span>{sendError}</span>
                  </div>
                ) : null}
                <div className="flex items-center justify-end gap-2">
                  <Button type="button" variant="secondary" size="md">
                    Save as draft
                  </Button>
                  <Button type="submit" size="md" disabled={!draft.trim() || sending}>
                    {sending ? "Sending…" : "Send reply"} <Send className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Detail icon={User} label={isAdmin ? "Customer" : "Opened by"}>
                <div className="flex items-center gap-2">
                  <Avatar
                    name={ticket.customer.name}
                    initials={ticket.customer.avatar}
                    size="sm"
                  />
                  <div className="leading-tight min-w-0">
                    <div className="text-sm text-white truncate">
                      {ticket.customer.name}
                    </div>
                    {ticket.customer.email ? (
                      <div className="text-xs text-white/50 truncate">
                        {ticket.customer.email}
                      </div>
                    ) : null}
                  </div>
                </div>
              </Detail>
              <Detail icon={Activity} label="Assignee">
                <div className="flex items-center gap-2">
                  <Avatar
                    name={ticket.assignee.name}
                    initials={ticket.assignee.avatar}
                    size="sm"
                  />
                  <div className="text-sm text-white">{ticket.assignee.name}</div>
                </div>
              </Detail>
              <Detail icon={MapPin} label="Location">
                <div className="text-sm text-white">{ticket.location}</div>
              </Detail>
              <Detail icon={Calendar} label="Created">
                <div className="text-sm text-white">
                  {formatRelative(ticket.createdAt)}
                </div>
              </Detail>
              <Detail icon={Clock} label="Last updated">
                <div className="text-sm text-white">
                  {formatRelative(ticket.updatedAt)}
                </div>
              </Detail>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="relative border-l border-white/10 pl-5 space-y-5">
                {[
                  { t: "Ticket created", at: ticket.createdAt },
                  { t: `Status: ${labelFor(status)}`, at: ticket.updatedAt },
                ].map((e, i) => (
                  <li key={i} className="relative">
                    <span className="absolute -left-[27px] top-1 h-3 w-3 rounded-full bg-[#12121c] border-2 border-violet-400" />
                    <div className="text-sm text-white">{e.t}</div>
                    <div className="text-xs text-white/40">
                      {formatRelative(e.at)}
                    </div>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function labelFor(s) {
  if (s === "in_progress") return "In Progress";
  if (s === "resolved") return "Resolved";
  return "Open";
}

function Detail({ icon: Icon, label, children }) {
  return (
    <div className="flex items-start gap-3">
      <div className="h-9 w-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
        <Icon className="h-4 w-4 text-white/60" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[11px] uppercase tracking-wider text-white/40">
          {label}
        </div>
        <div className="mt-0.5">{children}</div>
      </div>
    </div>
  );
}

function Message({ message }) {
  const isAgent = message.role === "agent";
  return (
    <div className="flex items-start gap-3">
      <Avatar name={message.author} initials={message.avatar} size="md" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-white">{message.author}</span>
          <Badge tone={isAgent ? "violet" : "neutral"}>
            {isAgent ? "Agent" : "Customer"}
          </Badge>
          <span className="text-xs text-white/40">
            {formatRelative(message.at)}
          </span>
        </div>
        <div
          className={`mt-2 rounded-2xl border p-3.5 text-sm leading-relaxed whitespace-pre-wrap ${isAgent
            ? "bg-gradient-to-br from-violet-500/10 to-transparent border-violet-500/20 text-white/90"
            : "bg-white/[0.03] border-white/[0.06] text-white/80"
            }`}
        >
          {message.text}
        </div>
      </div>
    </div>
  );
}

function initialsOf(name = "") {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (!parts[0]) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
