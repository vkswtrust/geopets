import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { PageHero, meta } from "@/components/site";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({ ...meta("My Profile", "Your GeoPetCare account details."), meta: [...meta("My Profile", "Your GeoPetCare account details.").meta, { name: "robots", content: "noindex" }] }),
  component: Profile,
});

function Profile() {
  const { profile, isAdmin, session } = useAuth();
  const qc = useQueryClient();
  const { data: req } = useQuery({
    queryKey: ["my-admin-request", session?.user.id],
    enabled: !!session,
    queryFn: async () => (await supabase.from("admin_access_requests").select("*").eq("user_id", session!.user.id).order("created_at", { ascending: false }).limit(1)).data?.[0] ?? null,
  });
  async function requestAdmin() {
    const { error } = await supabase.from("admin_access_requests").insert({ user_id: session!.user.id, name: profile?.name ?? null, email: profile?.email ?? null });
    if (error) toast.error("Could not send request."); else { toast.success("Admin access requested."); qc.invalidateQueries({ queryKey: ["my-admin-request"] }); }
  }
  return (
    <>
      <PageHero kicker="My Profile" title={profile?.name ?? "My account"} />
      <div className="mx-auto max-w-3xl space-y-6 px-4 py-12">
        <dl className="grid gap-4 rounded-2xl border bg-card p-6 sm:grid-cols-2">
          <div><dt className="text-sm text-muted-foreground">GPC User ID</dt><dd className="font-display text-2xl font-semibold text-leaf">{profile?.gpc_id}</dd></div>
          <div><dt className="text-sm text-muted-foreground">Name</dt><dd className="font-semibold">{profile?.name}</dd></div>
          <div><dt className="text-sm text-muted-foreground">Email</dt><dd className="font-semibold">{profile?.email}</dd></div>
          <div><dt className="text-sm text-muted-foreground">Member since</dt><dd className="font-semibold">{profile && new Date(profile.created_at).toLocaleDateString()}</dd></div>
          <div><dt className="text-sm text-muted-foreground">Account type</dt><dd className="font-semibold">{isAdmin ? "Admin" : "User"}</dd></div>
        </dl>
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="pill"><Link to="/submissions">My Submissions</Link></Button>
          {!isAdmin && (req ? <p className="self-center text-sm text-muted-foreground">Admin access request: <b>{req.status}</b></p>
            : <Button variant="outline" onClick={requestAdmin}>Request Admin access</Button>)}
        </div>
      </div>
    </>
  );
}
