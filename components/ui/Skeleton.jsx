import { cn } from "@/lib/utils";

export function Skeleton({ className, ...props }) {
  return <div className={cn("skeleton rounded-xl", className)} {...props} />;
}

export function TicketCardSkeleton() {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <Skeleton className="h-5 w-3/4 mt-4" />
      <Skeleton className="h-4 w-full mt-3" />
      <Skeleton className="h-4 w-5/6 mt-2" />
      <div className="flex items-center justify-between mt-5">
        <div className="flex items-center gap-2">
          <Skeleton className="h-7 w-7 rounded-full" />
          <Skeleton className="h-3 w-24" />
        </div>
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  );
}
