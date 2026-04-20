import { cn } from "@/lib/utils";

const palette = [
  "from-violet-500 to-indigo-500",
  "from-fuchsia-500 to-pink-500",
  "from-sky-500 to-cyan-500",
  "from-emerald-500 to-teal-500",
  "from-amber-500 to-orange-500",
  "from-rose-500 to-red-500",
];

function hash(str = "") {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

const sizes = {
  xs: "h-6 w-6 text-[10px]",
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
};

export function Avatar({ name = "?", initials, size = "sm", className }) {
  const text = (initials || name.slice(0, 2)).toUpperCase();
  const gradient = palette[hash(name) % palette.length];
  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-full font-semibold text-white",
        "bg-gradient-to-br ring-1 ring-white/10 shadow-sm",
        gradient,
        sizes[size],
        className
      )}
      aria-label={name}
    >
      {text}
    </div>
  );
}
