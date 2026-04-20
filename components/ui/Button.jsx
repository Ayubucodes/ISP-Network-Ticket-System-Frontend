import { cn } from "@/lib/utils";

const variants = {
  primary:
    "bg-gradient-to-b from-[#8b6bff] to-[#5b45e0] text-white shadow-[0_10px_30px_-12px_rgba(124,92,255,0.8)] hover:from-[#9b7bff] hover:to-[#6855e8] border border-white/10",
  secondary:
    "bg-white/5 text-white border border-white/10 hover:bg-white/10 backdrop-blur",
  ghost: "text-white/80 hover:text-white hover:bg-white/5",
  danger:
    "bg-gradient-to-b from-rose-500 to-rose-600 text-white hover:from-rose-400 hover:to-rose-500 border border-white/10",
  outline:
    "border border-white/15 bg-transparent text-white hover:bg-white/5",
};

const sizes = {
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-5 text-base",
  icon: "h-10 w-10 p-0",
};

export function Button({
  as: Tag = "button",
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}) {
  return (
    <Tag
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-2xl font-medium",
        "transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7c5cff]/60 focus-visible:ring-offset-0",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}
