"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Radio, ArrowRight, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { login } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ email: "", password: "" });

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login({ email: form.email, password: form.password });
      router.push("/dashboard");
    } catch (err) {
      setError(err?.message || "Unable to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left — form */}
      <div className="flex flex-col px-6 sm:px-10 lg:px-16 py-8 lg:py-12">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#8b6bff] to-[#4f46e5] flex items-center justify-center glow-brand">
            <Radio className="h-4.5 w-4.5 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-white font-semibold tracking-tight">ISP Network Ticket System</span>
        </Link>

        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md fade-up">
            <h1 className="text-3xl font-semibold tracking-tight text-white">Welcome back</h1>
            <p className="mt-2 text-sm text-white/50">
              Sign in to continue managing your support tickets.
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
              or continue with email
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
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="#" className="text-xs text-violet-300 hover:text-violet-200">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  icon={Lock}
                  placeholder="••••••••"
                  required
                  value={form.password}
                  onChange={update("password")}
                />
              </div>

              <label className="flex items-center gap-2 text-sm text-white/60">
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 rounded border-white/20 bg-white/5 accent-[#7c5cff]"
                />
                Keep me signed in
              </label>

              <Button type="submit" size="lg" className="w-full" disabled={loading}>
                {loading ? "Signing in…" : "Sign in"}
                {!loading && <ArrowRight className="h-4 w-4" />}
              </Button>
            </form>

            <p className="mt-6 text-sm text-white/50 text-center">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-white hover:text-violet-300">
                Create one
              </Link>
            </p>
          </div>
        </div>

        <div className="text-xs text-white/30 flex items-center justify-between">
          <span>© {new Date().getFullYear()} ISP Network Ticket System</span>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-white/60">Privacy</a>
            <a href="#" className="hover:text-white/60">Terms</a>
          </div>
        </div>
      </div>

      {/* Right — visual */}
      <div className="hidden lg:block relative overflow-hidden border-l border-white/[0.06]">
        <div className="absolute inset-0 bg-[radial-gradient(800px_500px_at_30%_20%,rgba(124,92,255,0.35),transparent_60%),radial-gradient(600px_400px_at_80%_80%,rgba(34,211,238,0.25),transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,#0b0b12_95%)]" />
        <div className="absolute inset-0 flex items-center justify-center p-10">
          <div className="max-w-lg">
            <div className="rounded-3xl glass p-8 fade-up">
              <div className="flex items-center gap-2 text-xs text-white/60">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live incident feed
              </div>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight text-white">
                “We cut MTTR by 38% in the first quarter with this platform.”
              </h2>
              <p className="mt-3 text-sm text-white/60">
                It helped our NOC correlate tickets with node health and prioritize what
                actually affects customers. Our engineers love it.
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-fuchsia-500 to-pink-500 flex items-center justify-center text-sm font-semibold">
                  SO
                </div>
                <div className="leading-tight">
                  <div className="text-sm text-white">Sana Okafor</div>
                  <div className="text-xs text-white/50">Director of Network Ops, Aurora Labs</div>
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                { k: "38%", v: "Lower MTTR" },
                { k: "12k+", v: "Tickets / mo" },
                { k: "99.99%", v: "NOC uptime" },
              ].map((s) => (
                <div
                  key={s.v}
                  className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4"
                >
                  <div className="text-xl font-semibold text-white">{s.k}</div>
                  <div className="text-xs text-white/50">{s.v}</div>
                </div>
              ))}
            </div>
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
