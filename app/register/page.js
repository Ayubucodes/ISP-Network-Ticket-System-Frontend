"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  User,
  Radio,
  ArrowRight,
  Check,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { register } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    agree: false,
  });

  function update(field) {
    return (e) =>
      setForm((f) => ({
        ...f,
        [field]: e.target.type === "checkbox" ? e.target.checked : e.target.value,
      }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register({
        name: form.name.trim(),
        email: form.email,
        password: form.password,
      });
      router.push("/dashboard");
    } catch (err) {
      setError(err?.message || "Unable to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const perks = [
    "Unlimited tickets across all customer segments",
    "Live node health correlation and SLA alerts",
    "Role-based access for NOC, field & billing teams",
    "Free for the first 14 days — no card required",
  ];

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex relative overflow-hidden border-r border-white/[0.06] flex-col justify-between p-10">
        <div className="absolute inset-0 bg-[radial-gradient(700px_500px_at_20%_10%,rgba(124,92,255,0.35),transparent_60%),radial-gradient(600px_400px_at_80%_90%,rgba(34,211,238,0.25),transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,#0b0b12_95%)]" />

        <Link href="/" className="relative flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#8b6bff] to-[#4f46e5] flex items-center justify-center glow-brand">
            <Radio className="h-4.5 w-4.5 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-white font-semibold tracking-tight">ISP Network Ticket System</span>
        </Link>

        <div className="relative max-w-md fade-up">
          <h2 className="text-3xl font-semibold tracking-tight text-white">
            The support platform your network engineers will actually love.
          </h2>
          <ul className="mt-6 space-y-3">
            {perks.map((p) => (
              <li key={p} className="flex items-start gap-3 text-sm text-white/70">
                <span className="mt-0.5 h-5 w-5 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
                  <Check className="h-3 w-3 text-emerald-300" />
                </span>
                {p}
              </li>
            ))}
          </ul>

          <div className="mt-10 flex items-center gap-3">
            <div className="flex -space-x-2">
              {["PS", "MD", "YT", "NB"].map((i, idx) => (
                <div
                  key={i}
                  className={`h-8 w-8 rounded-full ring-2 ring-[#0b0b12] bg-gradient-to-br ${[
                    "from-violet-500 to-indigo-500",
                    "from-fuchsia-500 to-pink-500",
                    "from-sky-500 to-cyan-500",
                    "from-emerald-500 to-teal-500",
                  ][idx]
                    } flex items-center justify-center text-[11px] font-semibold`}
                >
                  {i}
                </div>
              ))}
            </div>
            <div className="text-xs text-white/60">
              <span className="text-white font-medium">2,400+</span> network teams onboarded
            </div>
          </div>
        </div>

        <div className="relative text-xs text-white/30">© {new Date().getFullYear()} ISP Network Ticket System</div>
      </div>

      <div className="flex flex-col px-6 sm:px-10 lg:px-16 py-8 lg:py-12">
        <Link href="/" className="lg:hidden flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#8b6bff] to-[#4f46e5] flex items-center justify-center">
            <Radio className="h-4.5 w-4.5 text-white" />
          </div>
          <span className="text-white font-semibold">ISP Network Ticket System</span>
        </Link>

        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md fade-up">
            <h1 className="text-3xl font-semibold tracking-tight text-white">Create your account</h1>
            <p className="mt-2 text-sm text-white/50">
              Start your 14-day trial. No credit card required.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-3">
              <Button variant="secondary" size="md" type="button">
                <GithubIcon /> GitHub
              </Button>
              <Button variant="secondary" size="md" type="button">
                <GoogleIcon /> Google
              </Button>
            </div>

            <div className="my-6 flex items-center gap-3 text-xs text-white/30 uppercase tracking-wider">
              <span className="h-px flex-1 bg-white/10" />
              or with email
              <span className="h-px flex-1 bg-white/10" />
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              {error ? (
                <div className="flex items-start gap-2.5 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-3.5 py-3 text-sm text-rose-200">
                  <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              ) : null}
              <div>
                <Label htmlFor="name">Full name</Label>
                <Input
                  id="name"
                  icon={User}
                  placeholder="Alice"
                  required
                  value={form.name}
                  onChange={update("name")}
                />
              </div>
              <div>
                <Label htmlFor="email">Work email</Label>
                <Input
                  id="email"
                  type="email"
                  icon={Mail}
                  placeholder="you@company.com"
                  required
                  value={form.email}
                  onChange={update("email")}
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  icon={Lock}
                  placeholder="At least 8 characters"
                  required
                  minLength={6}
                  value={form.password}
                  onChange={update("password")}
                />
                <p className="mt-1.5 text-xs text-white/40">
                  Must include a number and a symbol.
                </p>
              </div>

              <label className="flex items-start gap-2 text-sm text-white/60">
                <input
                  type="checkbox"
                  required
                  checked={form.agree}
                  onChange={update("agree")}
                  className="mt-0.5 h-4 w-4 rounded border-white/20 bg-white/5 accent-[#7c5cff]"
                />
                <span>
                  I agree to the{" "}
                  <a className="text-white hover:text-violet-300" href="#">
                    Terms
                  </a>{" "}
                  and{" "}
                  <a className="text-white hover:text-violet-300" href="#">
                    Privacy Policy
                  </a>
                  .
                </span>
              </label>

              <Button type="submit" size="lg" className="w-full" disabled={loading}>
                {loading ? "Creating account…" : "Create account"}
                {!loading && <ArrowRight className="h-4 w-4" />}
              </Button>
            </form>

            <p className="mt-6 text-sm text-white/50 text-center">
              Already have an account?{" "}
              <Link href="/login" className="text-white hover:text-violet-300">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function GithubIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2 1-.3 2-.4 3-.4s2 .1 3 .4c2.3-1.5 3.3-1.2 3.3-1.2.7 1.6.3 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.5-2.7 5.5-5.3 5.8.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5z" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.5c-.2 1.4-1.7 4.1-5.5 4.1-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.9 3.6 14.7 2.7 12 2.7 6.9 2.7 2.8 6.8 2.8 12S6.9 21.3 12 21.3c6.9 0 9.2-4.8 9.2-8.2 0-.6-.1-1-.2-1.4H12z"
      />
    </svg>
  );
}
