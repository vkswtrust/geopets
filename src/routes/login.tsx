import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Logo, meta } from "@/components/site";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth, signInWithGoogle } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  head: () => meta("Sign in", "Sign in securely to GeoPetCare."),
  component: Login,
});

type Mode = "signin" | "signup" | "forgot";

function Login() {
  const { session, isAdmin, loading } = useAuth();
  const nav = useNavigate();
  const [mode, setMode] = useState<Mode>("signin");
  const [busy, setBusy] = useState(false);
  const [info, setInfo] = useState("");
  useEffect(() => { if (!loading && session) nav({ to: isAdmin ? "/admin" : "/profile" }); }, [session, isAdmin, loading, nav]);

  async function google() {
    setBusy(true);
    try {
      const r = await signInWithGoogle();
      if (r.error) { toast.error("Google sign-in is unavailable here. Please use email sign-in."); setBusy(false); }
    } catch { toast.error("Google sign-in is unavailable here. Please use email sign-in."); setBusy(false); }
  }

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email") ?? "").trim().toLowerCase();
    const password = String(f.get("password") ?? "");
    const name = String(f.get("name") ?? "").trim().slice(0, 120);
    if (!/^\S+@\S+\.\S+$/.test(email)) { toast.error("Enter a valid email."); return; }
    setBusy(true); setInfo("");
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) toast.error(error.message.includes("confirm") ? "Please confirm your email first (check your inbox)." : "Incorrect email or password.");
      } else if (mode === "signup") {
        if (!name) { toast.error("Enter your name."); return; }
        if (password.length < 8) { toast.error("Password must be at least 8 characters."); return; }
        const { data, error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin + "/login", data: { full_name: name } } });
        if (error) toast.error(error.message);
        else if (!data.session) setInfo("Account created. Please check your email and click the confirmation link, then sign in.");
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin + "/reset-password" });
        if (error) toast.error(error.message); else setInfo("If this email is registered, a password reset link has been sent.");
      }
    } finally { setBusy(false); }
  }

  return (
    <div className="bg-hero grid min-h-[80vh] place-items-center px-4 py-16">
      <div className="w-full max-w-md rounded-[2rem] border bg-card p-8 shadow-soft">
        <Logo className="mx-auto h-40" />
        <h1 className="mt-4 text-center text-2xl font-semibold text-primary">
          {mode === "signin" ? "Sign in to GeoPetCare" : mode === "signup" ? "Create your account" : "Reset your password"}
        </h1>
        <p className="mt-1 text-center text-sm text-muted-foreground">Users and Admins use the same secure sign-in.</p>

        {mode !== "forgot" && (
          <>
            <Button variant="outline" size="lg" className="mt-6 w-full rounded-full" disabled={busy} onClick={google}>Continue with Google</Button>
            <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border" />or with email<span className="h-px flex-1 bg-border" /></div>
          </>
        )}

        <form onSubmit={submit} className="grid gap-3">
          {mode === "signup" && <div className="grid gap-1.5"><Label htmlFor="name">Full name</Label><Input id="name" name="name" required maxLength={120} /></div>}
          <div className="grid gap-1.5"><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" required autoComplete="email" /></div>
          {mode !== "forgot" && <div className="grid gap-1.5"><Label htmlFor="password">Password</Label><Input id="password" name="password" type="password" required minLength={mode === "signup" ? 8 : 1} autoComplete={mode === "signup" ? "new-password" : "current-password"} /></div>}
          <Button type="submit" variant="pill" size="lg" disabled={busy} className="mt-2 w-full">
            {busy ? "Please wait…" : mode === "signin" ? "Sign in" : mode === "signup" ? "Create account" : "Send reset link"}
          </Button>
        </form>

        {info && <p className="mt-4 rounded-xl bg-secondary p-3 text-sm text-secondary-foreground">{info}</p>}

        <div className="mt-5 flex flex-wrap justify-between gap-2 text-sm">
          {mode === "signin" ? (
            <>
              <button className="text-primary underline" onClick={() => { setMode("signup"); setInfo(""); }}>Create an account</button>
              <button className="text-muted-foreground underline" onClick={() => { setMode("forgot"); setInfo(""); }}>Forgot password?</button>
            </>
          ) : <button className="text-primary underline" onClick={() => { setMode("signin"); setInfo(""); }}>Back to sign in</button>}
        </div>
      </div>
    </div>
  );
}
