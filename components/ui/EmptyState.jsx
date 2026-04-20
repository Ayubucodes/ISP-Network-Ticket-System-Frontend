import { cn } from "@/lib/utils";

export function EmptyState({ icon: Icon, title, description, action, className }) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center py-16 px-6",
        "rounded-2xl border border-dashed border-white/10 bg-white/[0.02]",
        className
      )}
    >
      {Icon ? (
        <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-violet-500/20 to-indigo-500/10 border border-white/10 flex items-center justify-center mb-4">
          <Icon className="h-6 w-6 text-violet-300" />
        </div>
      ) : null}
      <h3 className="text-white font-semibold text-lg">{title}</h3>
      {description ? (
        <p className="text-white/50 text-sm mt-1.5 max-w-sm">{description}</p>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
