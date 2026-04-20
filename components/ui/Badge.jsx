import { cn } from "@/lib/utils";

const tones = {
  red: "bg-rose-500/10 text-rose-300 border-rose-500/30",
  amber: "bg-amber-500/10 text-amber-300 border-amber-500/30",
  green: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
  violet: "bg-violet-500/10 text-violet-300 border-violet-500/30",
  sky: "bg-sky-500/10 text-sky-300 border-sky-500/30",
  neutral: "bg-white/5 text-white/70 border-white/10",
};

export function Badge({ tone = "neutral", className, children, dot = false, ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
        tones[tone],
        className
      )}
      {...props}
    >
      {dot ? (
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            tone === "red" && "bg-rose-400",
            tone === "amber" && "bg-amber-400",
            tone === "green" && "bg-emerald-400",
            tone === "violet" && "bg-violet-400",
            tone === "sky" && "bg-sky-400",
            tone === "neutral" && "bg-white/60"
          )}
        />
      ) : null}
      {children}
    </span>
  );
}

const statusMap = {
  open: { tone: "red", label: "Open" },
  in_progress: { tone: "amber", label: "In Progress" },
  resolved: { tone: "green", label: "Resolved" },
};

export function StatusBadge({ status, className }) {
  const s = statusMap[status] ?? statusMap.open;
  return (
    <Badge tone={s.tone} dot className={className}>
      {s.label}
    </Badge>
  );
}

const priorityMap = {
  high: { tone: "red", label: "High" },
  medium: { tone: "amber", label: "Medium" },
  low: { tone: "sky", label: "Low" },
};

export function PriorityBadge({ priority, className }) {
  const p = priorityMap[priority] ?? priorityMap.medium;
  return (
    <Badge tone={p.tone} className={className}>
      {p.label} priority
    </Badge>
  );
}
