"use client";

import { useState } from "react";
import {
  User,
  Bell,
  Shield,
  CreditCard,
  Plug,
  Moon,
  Save,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Label, Select, Textarea } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { useAuth } from "@/components/providers/AuthProvider";
import { cn } from "@/lib/utils";

function getInitials(name = "") {
  const parts = name.trim().split(/\s+/);
  if (!parts[0]) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const TABS = [
  { key: "profile", label: "Profile", icon: User },
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "security", label: "Security", icon: Shield },
  { key: "billing", label: "Billing", icon: CreditCard },
  { key: "integrations", label: "Integrations", icon: Plug },
  { key: "appearance", label: "Appearance", icon: Moon },
];

export default function SettingsPage() {
  const [tab, setTab] = useState("profile");

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-semibold tracking-tight text-white">Settings</h1>
        <p className="text-sm text-white/50 mt-1">Manage your profile, security and preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6">
        {/* Tabs */}
        <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-1">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={cn(
                  "inline-flex items-center gap-2.5 h-10 px-3 rounded-xl text-sm transition whitespace-nowrap border",
                  active
                    ? "bg-white/10 text-white border-white/10"
                    : "bg-transparent text-white/60 border-transparent hover:bg-white/[0.04] hover:text-white"
                )}
              >
                <Icon className="h-4 w-4" />
                {t.label}
              </button>
            );
          })}
        </nav>

        <div className="space-y-6">
          {tab === "profile" && <ProfileTab />}
          {tab === "notifications" && <NotificationsTab />}
          {tab === "security" && <SecurityTab />}
          {tab === "billing" && <BillingTab />}
          {tab === "integrations" && <IntegrationsTab />}
          {tab === "appearance" && <AppearanceTab />}
        </div>
      </div>
    </div>
  );
}

function ProfileTab() {
  const { user, role } = useAuth();
  const displayName = user?.name || "";
  const displayEmail = user?.email || "";
  const initials = getInitials(displayName || displayEmail);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>This is how others will see you on the platform.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex items-center gap-4">
            <Avatar name={displayName || "User"} initials={initials} size="lg" />
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm">
                <Upload className="h-4 w-4" /> Upload
              </Button>
              <Button variant="ghost" size="sm">
                Remove
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Full name</Label>
              <Input defaultValue={displayName} />
            </div>
            <div>
              <Label>Email</Label>
              <Input type="email" defaultValue={displayEmail} />
            </div>
            <div>
              <Label>Role</Label>
              <Select defaultValue={role} disabled>
                <option value="admin">Admin</option>
                <option value="agent">Support Agent</option>
                <option value="customer">Customer</option>
              </Select>
            </div>
            <div>
              <Label>Timezone</Label>
              <Select defaultValue="utc-5">
                <option value="utc-8">Pacific (UTC-8)</option>
                <option value="utc-5">Eastern (UTC-5)</option>
                <option value="utc">London (UTC)</option>
                <option value="utc+1">Central Europe (UTC+1)</option>
              </Select>
            </div>
          </div>

          <div>
            <Label>Bio</Label>
            <Textarea placeholder="A short description about you." />
          </div>

          <div className="flex justify-end">
            <Button>
              <Save className="h-4 w-4" /> Save changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

function NotificationsTab() {
  const prefs = [
    { k: "New tickets assigned to me", d: "Get notified the moment a ticket lands on your desk." },
    { k: "Replies on my tickets", d: "Customer and teammate replies on your conversations." },
    { k: "SLA breach warnings", d: "Heads-up before a ticket misses SLA." },
    { k: "Weekly digest", d: "Summary of activity and team performance." },
  ];
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>Choose what you want to hear about.</CardDescription>
      </CardHeader>
      <CardContent className="divide-y divide-white/[0.05]">
        {prefs.map((p, i) => (
          <div key={p.k} className="flex items-center justify-between py-4">
            <div className="pr-4">
              <div className="text-sm text-white">{p.k}</div>
              <div className="text-xs text-white/50 mt-0.5">{p.d}</div>
            </div>
            <Toggle defaultChecked={i !== 3} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function SecurityTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Security</CardTitle>
        <CardDescription>Protect your account with a strong password and 2FA.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Current password</Label>
            <Input type="password" placeholder="••••••••" />
          </div>
          <div>
            <Label>New password</Label>
            <Input type="password" placeholder="At least 8 characters" />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
          <div>
            <div className="text-sm font-medium text-white">Two-factor authentication</div>
            <div className="text-xs text-white/50 mt-0.5">Add an extra layer of security.</div>
          </div>
          <Toggle />
        </div>

        <div className="flex justify-end">
          <Button>
            <Save className="h-4 w-4" /> Update security
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function BillingTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing</CardTitle>
        <CardDescription>Plan, invoices and payment method.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="rounded-2xl border border-white/[0.06] bg-gradient-to-br from-violet-500/10 to-transparent p-5 flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wider text-violet-300">Current plan</div>
            <div className="mt-1 text-xl font-semibold text-white">Fiber Pro — 1 Gbps</div>
            <div className="text-sm text-white/50 mt-1">Renews on May 1, 2025 · $249 / month</div>
          </div>
          <Button variant="secondary">Change plan</Button>
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-white">Payment method</div>
              <div className="text-xs text-white/50">Visa ending in 4242 · Expires 09/27</div>
            </div>
            <Badge tone="green" dot>Default</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function IntegrationsTab() {
  const integrations = [
    { name: "Slack", desc: "Pipe ticket updates into Slack channels.", connected: true },
    { name: "PagerDuty", desc: "Escalate critical incidents automatically.", connected: true },
    { name: "Jira", desc: "Sync tickets with engineering backlogs.", connected: false },
    { name: "Datadog", desc: "Correlate tickets with node metrics.", connected: false },
  ];
  return (
    <Card>
      <CardHeader>
        <CardTitle>Integrations</CardTitle>
        <CardDescription>Connect the ticket system with the rest of your stack.</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {integrations.map((i) => (
          <div
            key={i.name}
            className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 hover:bg-white/[0.04] transition"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-indigo-500/10 border border-white/10 flex items-center justify-center text-sm font-semibold text-white">
                  {i.name[0]}
                </div>
                <div>
                  <div className="text-sm font-medium text-white">{i.name}</div>
                  <div className="text-xs text-white/50">{i.desc}</div>
                </div>
              </div>
              <Button size="sm" variant={i.connected ? "secondary" : "primary"}>
                {i.connected ? "Manage" : "Connect"}
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function AppearanceTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
        <CardDescription>Customize how the ticket system looks for you.</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {["Midnight", "Aurora", "Graphite"].map((t, i) => (
          <button
            key={t}
            className={cn(
              "rounded-2xl p-5 border text-left transition hover:bg-white/[0.04]",
              i === 0
                ? "border-[#7c5cff]/50 bg-gradient-to-br from-[#7c5cff]/10 to-transparent ring-2 ring-[#7c5cff]/20"
                : "border-white/[0.06] bg-white/[0.02]"
            )}
          >
            <div
              className={cn(
                "h-24 rounded-xl mb-3",
                i === 0 && "bg-[radial-gradient(300px_200px_at_30%_20%,#7c5cff55,transparent_60%),#0b0b12]",
                i === 1 && "bg-[radial-gradient(300px_200px_at_70%_30%,#22d3ee55,transparent_60%),#0b0b12]",
                i === 2 && "bg-[linear-gradient(135deg,#1f1f2b,#0b0b12)]"
              )}
            />
            <div className="text-sm font-medium text-white">{t}</div>
            <div className="text-xs text-white/50">
              {i === 0 ? "Default" : "Preview"}
            </div>
          </button>
        ))}
      </CardContent>
    </Card>
  );
}

function Toggle({ defaultChecked = false }) {
  const [on, setOn] = useState(defaultChecked);
  return (
    <button
      type="button"
      onClick={() => setOn((v) => !v)}
      className={cn(
        "relative h-6 w-11 rounded-full transition border",
        on ? "bg-[#7c5cff] border-[#7c5cff]/60" : "bg-white/10 border-white/10"
      )}
      aria-pressed={on}
    >
      <span
        className={cn(
          "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition",
          on ? "left-5" : "left-0.5"
        )}
      />
    </button>
  );
}
