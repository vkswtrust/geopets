import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Logo, meta } from "@/components/site";
import { Button } from "@/components/ui/button";
import { useAuth, signInWithGoogle } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  head: () => meta("Sign in", "Sign in securely to GeoPetCare with Google."),
  component: Login,
});

function Login() {
  const { session, isAdmin, loading } = useAuth();
  const nav = useNavigate();
  const [busy, setBusy] = useState(false);
  useEffect(() => { if (!loading && session) nav({ to: isAdmin ? "/admin" : "/profile" }); }, [session, isAdmin, loading, nav]);

  async function go() {
    setBusy(true);
    const r = await signInWithGoogle();
    if (r.error) { toast.error("Sign-in failed. Please try again."); setBusy(false); }
  }

  return (
    <div className="bg-hero grid min-h-[80vh] place-items-center px-4 py-16">
      <div className="w-full max-w-md rounded-[2rem] border bg-card p-8 text-center shadow-soft">
        <Logo className="mx-auto h-48" />
        <h1 className="mt-4 text-2xl font-semibold text-primary">Welcome to GeoPetCare</h1>
        <p className="mt-2 text-sm text-muted-foreground">Sign in with your Google account. We store only your name, email and your GPC User ID.</p>
        <Button variant="pill" size="lg" className="mt-6 w-full" disabled={busy} onClick={go}>Continue with Google</Button>
        <p className="mt-6 text-xs text-muted-foreground">Admins sign in with their authorised official Google account. Admin access is verified securely by our servers.</p>
      </div>
    </div>
  );
}
