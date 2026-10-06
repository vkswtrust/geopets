import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

type Extra = { name: string; label: string; options?: readonly string[] };

export function SubmissionForm({
  type, extras = [], animalId, requireLogin = false, submitLabel = "Submit", typeChoices,
}: { type: string; extras?: Extra[]; animalId?: string; requireLogin?: boolean; submitLabel?: string; typeChoices?: readonly string[] }) {
  const { session, profile } = useAuth();
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  if (requireLogin && !session) {
    return (
      <div className="rounded-2xl border bg-card p-6 text-center">
        <p className="text-muted-foreground">Please sign in to submit this form. Your GPC User ID will be attached automatically.</p>
        <Button asChild variant="pill" className="mt-4"><Link to="/login">Sign in with Google</Link></Button>
      </div>
    );
  }
  if (done) {
    return (
      <div className="rounded-2xl border bg-secondary p-6 text-center">
        <p className="font-display text-xl text-secondary-foreground">Thank you — we've received your submission.</p>
        {session && <Link to="/submissions" className="mt-2 inline-block text-sm text-primary underline">View status in My Submissions</Link>}
      </div>
    );
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const get = (k: string) => String(f.get(k) ?? "").trim();
    const name = get("name"), email = get("email");
    if (!name || !email || name.length > 120 || email.length > 200 || !/^\S+@\S+\.\S+$/.test(email)) {
      toast.error("Please enter a valid name and email."); return;
    }
    const details: Record<string, string> = {};
    extras.forEach((x) => { details[x.label] = get(x.name).slice(0, 500); });
    setBusy(true);
    const { error } = await supabase.from("submissions").insert({
      type: typeChoices ? get("type") || type : type,
      name, email, phone: get("phone").slice(0, 30) || null, message: get("message").slice(0, 3000) || null,
      details, animal_id: animalId ?? null, user_id: session?.user.id ?? null,
    });
    setBusy(false);
    if (error) { toast.error("Could not submit. Please try again."); return; }
    setDone(true);
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 rounded-2xl border bg-card p-6 shadow-soft">
      {profile && <p className="text-xs text-muted-foreground">Submitting as <b>{profile.gpc_id}</b></p>}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name"><Input name="name" required maxLength={120} defaultValue={profile?.name ?? ""} /></Field>
        <Field label="Email"><Input name="email" type="email" required maxLength={200} defaultValue={profile?.email ?? ""} /></Field>
        <Field label="Phone (optional)"><Input name="phone" maxLength={30} /></Field>
        {typeChoices && (
          <Field label="Enquiry type">
            <select name="type" defaultValue={type} className="h-9 rounded-md border border-input bg-background px-3 text-sm">
              {typeChoices.map((t) => <option key={t}>{t}</option>)}
            </select>
          </Field>
        )}
        {extras.map((x) => (
          <Field key={x.name} label={x.label}>
            {x.options ? (
              <select name={x.name} required className="h-9 rounded-md border border-input bg-background px-3 text-sm">
                {x.options.map((o) => <option key={o}>{o}</option>)}
              </select>
            ) : <Input name={x.name} maxLength={500} />}
          </Field>
        ))}
      </div>
      <Field label="Message"><Textarea name="message" rows={4} maxLength={3000} /></Field>
      <Button type="submit" variant="pill" disabled={busy} className="justify-self-start">{busy ? "Sending…" : submitLabel}</Button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="grid gap-1.5"><Label>{label}</Label>{children}</div>;
}
