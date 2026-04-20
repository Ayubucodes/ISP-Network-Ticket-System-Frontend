"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Send, AlertCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Label, Textarea } from "@/components/ui/Input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/Card";
import { createTicket } from "@/lib/api";

export default function NewTicketPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    setError("");
    setSubmitting(true);
    try {
      await createTicket({
        title: title.trim(),
        description: description.trim(),
      });
      router.push("/tickets");
      router.refresh();
    } catch (err) {
      setError(err?.message || "Failed to create ticket. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Link
          href="/tickets"
          className="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition"
        >
          <ArrowLeft className="h-4 w-4" /> Back to tickets
        </Link>
        <h1 className="mt-3 text-2xl lg:text-3xl font-semibold tracking-tight text-white">
          Create a new ticket
        </h1>
        <p className="text-sm text-white/50 mt-1">
          Tell us what's wrong and we'll get someone on it.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Issue details</CardTitle>
          <CardDescription>
            A clear title and description help us resolve faster.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-5">
            {error ? (
              <div className="flex items-start gap-2.5 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-3.5 py-3 text-sm text-rose-200">
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            ) : null}

            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="e.g. No internet"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="desc">Description</Label>
              <Textarea
                id="desc"
                placeholder="Describe the issue, when it started, and any troubleshooting you've already tried."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
              <div className="mt-2 text-right text-xs text-white/40">
                {description.length} characters
              </div>
            </div>

            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 flex gap-3">
              <Info className="h-5 w-5 text-violet-300 shrink-0 mt-0.5" />
              <div className="text-sm text-white/60">
                New tickets start as <span className="text-white font-medium">Open</span>.
                You'll get updates here as our team works on them.
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                as={Link}
                href="/tickets"
                size="md"
                variant="secondary"
                type="button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="md"
                disabled={submitting || !title.trim() || !description.trim()}
              >
                {submitting ? (
                  "Submitting…"
                ) : (
                  <>
                    Submit ticket <Send className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
