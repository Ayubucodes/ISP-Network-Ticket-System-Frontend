import Link from "next/link";
import {
  Radio,
  ArrowRight,
  ShieldCheck,
  Zap,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <header className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#8b6bff] to-[#4f46e5] flex items-center justify-center glow-brand">
            <Radio className="h-4.5 w-4.5 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-white font-semibold tracking-tight">ISP Network Ticket System</span>
        </Link>
        <div className="flex items-center gap-2">
          <Button as={Link} href="/login" variant="ghost" size="sm">
            Sign in
          </Button>
          <Button as={Link} href="/register" size="sm">
            Get started <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-6 pt-16 pb-24 text-center">
        <h1 className="mt-6 text-5xl md:text-7xl font-semibold tracking-tight text-white leading-[1.05]">
          Support at the{" "}
          <span className="bg-gradient-to-r from-[#a78bfa] via-[#7c5cff] to-[#22d3ee] bg-clip-text text-transparent">
            speed of fiber.
          </span>
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-lg text-white/60 leading-relaxed">
          ISP Network Ticket System is the modern ticketing platform for internet service providers.
          Triage outages, coordinate field teams, and keep every customer in the loop —
          beautifully.
        </p>
        <div className="mt-10 flex items-center justify-center gap-3">
          <Button as={Link} href="/dashboard" size="lg">
            Open dashboard <ArrowRight className="h-4 w-4" />
          </Button>
          <Button as={Link} href="/login" size="lg" variant="secondary">
            Sign in
          </Button>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              icon: Zap,
              title: "Blazing-fast triage",
              desc: "Auto-priority scoring and keyboard-first flows to resolve incidents in minutes.",
            },
            {
              icon: Activity,
              title: "Live network insights",
              desc: "Correlate tickets with node health, uplink status, and customer SLAs.",
            },
            {
              icon: ShieldCheck,
              title: "Enterprise-ready",
              desc: "Role-based access, audit logs and SOC 2-friendly controls out of the box.",
            },
          ].map((f) => (
            <div
              key={f.title}
              id="features"
              className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 text-left hover:bg-white/[0.05] transition"
            >
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-indigo-500/10 border border-white/10 flex items-center justify-center">
                <f.icon className="h-5 w-5 text-violet-300" />
              </div>
              <h3 className="mt-4 text-white font-semibold">{f.title}</h3>
              <p className="mt-1.5 text-sm text-white/50">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between text-xs text-white/40">
          <span>© {new Date().getFullYear()} ISP Network Ticket System</span>
          <span>Crafted for reliable networks.</span>
        </div>
      </footer>
    </div>
  );
}
