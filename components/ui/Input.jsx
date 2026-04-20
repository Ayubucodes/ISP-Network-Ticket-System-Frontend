import { cn } from "@/lib/utils";

export function Label({ className, children, ...props }) {
  return (
    <label
      className={cn("block text-sm font-medium text-white/80 mb-1.5", className)}
      {...props}
    >
      {children}
    </label>
  );
}

export function Input({ className, icon: Icon, ...props }) {
  return (
    <div className="relative">
      {Icon ? (
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
      ) : null}
      <input
        className={cn(
          "w-full h-11 rounded-2xl bg-white/[0.04] border border-white/[0.08]",
          "text-white placeholder:text-white/30 text-sm",
          "px-4 transition-all duration-200",
          "hover:border-white/20",
          "focus:outline-none focus:border-[#7c5cff]/60 focus:bg-white/[0.06] focus:ring-2 focus:ring-[#7c5cff]/20",
          Icon && "pl-10",
          className
        )}
        {...props}
      />
    </div>
  );
}

export function Textarea({ className, ...props }) {
  return (
    <textarea
      className={cn(
        "w-full rounded-2xl bg-white/[0.04] border border-white/[0.08]",
        "text-white placeholder:text-white/30 text-sm",
        "px-4 py-3 transition-all duration-200 min-h-[120px] resize-y",
        "hover:border-white/20",
        "focus:outline-none focus:border-[#7c5cff]/60 focus:bg-white/[0.06] focus:ring-2 focus:ring-[#7c5cff]/20",
        className
      )}
      {...props}
    />
  );
}

export function Select({ className, children, ...props }) {
  return (
    <select
      className={cn(
        "w-full h-11 rounded-2xl bg-white/[0.04] border border-white/[0.08]",
        "text-white text-sm px-4 transition-all duration-200",
        "hover:border-white/20 appearance-none",
        "focus:outline-none focus:border-[#7c5cff]/60 focus:bg-white/[0.06] focus:ring-2 focus:ring-[#7c5cff]/20",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}
