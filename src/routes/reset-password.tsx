import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { meta } from "@/components/site";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [...meta("Set a new password", "Choose a new password for your GeoPetCare account.").meta, { name: "robots", content: "noindex" }] }),
  component: Reset,
});

function Reset() {
  const nav = useNavigate();
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (window.location.hash.includes("type=recovery")) setReady(true);
    const { data } = supabase.auth.onAuthStateChange((e) => { if (e === "PASSWORD_RECOVERY") setReady(true); });
    return () => data.subscription.unsubscribe();
  }, []);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const pw = String(new FormData(e.currentTarget).get("password") ?? "");
    if (pw.length < 8) { toast.error("Password must be at least 8 characters."); return; }
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password: pw });
    setBusy(false);
    if (error) toast.error(error.message); else { toast.success("Password updated."); nav({ to: "/profile" }); }
  }

  return (
    <div className="bg-hero grid min-h-[70vh] place-items-center px-4 py-16">
      <div className="w-full max-w-md rounded-[2rem] border bg-card p-8 shadow-soft">
        <h1 className="text-2xl font-semibold text-primary">Set a new password</h1>
        {ready ? (
          <form onSubmit={submit} className="mt-5 grid gap-3">
            <Label htmlFor="password">New password</Label>
            <Input id="password" name="password" type="password" required minLength={8} autoComplete="new-password" />
            <Button type="submit" variant="pill" disabled={busy}>{busy ? "Saving…" : "Save password"}</Button>
          </form>
        ) : <p className="mt-4 text-sm text-muted-foreground">Open this page from the reset link sent to your email.</p>}
      </div>
    </div>
  );
}
