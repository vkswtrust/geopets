import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHero, meta } from "@/components/site";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/_authenticated/submissions")({
  head: () => meta("My Submissions", "Track the status of your GeoPetCare applications and enquiries."),
  component: Subs,
});

function Subs() {
  const { session } = useAuth();
  const { data = [], isLoading } = useQuery({
    queryKey: ["my-subs", session?.user.id], enabled: !!session,
    queryFn: async () => (await supabase.from("submissions").select("*").eq("user_id", session!.user.id).order("created_at", { ascending: false })).data ?? [],
  });
  return (
    <>
      <PageHero kicker="My Submissions" title="Your applications & enquiries" />
      <div className="mx-auto max-w-4xl space-y-3 px-4 py-12">
        {isLoading ? <p>Loading…</p> : data.length === 0 ? <p className="text-muted-foreground">You haven't submitted anything yet.</p> :
          data.map((s) => (
            <div key={s.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-card p-5">
              <div><p className="font-semibold">{s.type}</p><p className="text-sm text-muted-foreground">{new Date(s.created_at).toLocaleString()} · {s.message?.slice(0, 80)}</p></div>
              <Badge>{s.status}</Badge>
            </div>
          ))}
      </div>
    </>
  );
}
