import Link from "next/link";
import { ArrowUpRight, Clock, MapPin, MessageSquare } from "lucide-react";
import { StatusBadge, PriorityBadge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { formatRelative } from "@/lib/utils";

export function TicketCard({ ticket }) {
  return (
    <Link
      href={`/tickets/${ticket.id}`}
      className="group block rounded-2xl border border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.05] hover:border-white/[0.12] transition-all duration-300 p-5 relative overflow-hidden"
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <div className="absolute -top-24 -right-20 h-48 w-48 rounded-full bg-[#7c5cff]/10 blur-3xl" />
      </div>

      <div className="relative">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[11px] font-mono text-white/40 tracking-wider">{ticket.id}</span>
          <StatusBadge status={ticket.status} />
        </div>

        <h3 className="mt-3 text-[15px] font-semibold text-white leading-snug line-clamp-2 group-hover:text-white">
          {ticket.title}
        </h3>
        <p className="mt-1.5 text-sm text-white/50 line-clamp-2">{ticket.description}</p>

        <div className="mt-4 flex items-center gap-2 flex-wrap">
          <PriorityBadge priority={ticket.priority} />
          <span className="inline-flex items-center gap-1.5 text-xs text-white/50">
            <MapPin className="h-3.5 w-3.5" />
            {ticket.location}
          </span>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-white/[0.06] pt-4">
          <div className="flex items-center gap-2 min-w-0">
            <Avatar name={ticket.customer.name} initials={ticket.customer.avatar} size="xs" />
            <span className="text-xs text-white/60 truncate">{ticket.customer.name}</span>
          </div>
          <div className="flex items-center gap-3 text-white/40">
            <span className="inline-flex items-center gap-1 text-xs">
              <MessageSquare className="h-3.5 w-3.5" />
              {ticket.messages?.length ?? 0}
            </span>
            <span className="inline-flex items-center gap-1 text-xs">
              <Clock className="h-3.5 w-3.5" />
              {formatRelative(ticket.updatedAt)}
            </span>
            <ArrowUpRight className="h-3.5 w-3.5 text-white/30 group-hover:text-violet-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
          </div>
        </div>
      </div>
    </Link>
  );
}
