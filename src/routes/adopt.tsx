import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { PawPrint } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PageHero, meta } from "@/components/site";
import { SubmissionForm } from "@/components/SubmissionForm";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export const Route = createFileRoute("/adopt")({
  head: () => meta("Adopt. Don't Shop.", "Meet rescued animals listed for adoption by GeoPetCare Foundation and send an adoption enquiry."),
  component: Adopt,
});

type Animal = { id: string; name: string; species: string | null; age: string | null; gender: string | null; location: string | null; rescue_story: string | null; health_status: string | null; vaccination_status: string | null; sterilization_status: string | null; behaviour: string | null; description: string | null; geopet_id: string | null; adoption_status: string; photos: string[] };

function Adopt() {
  const { data = [], isLoading } = useQuery({
    queryKey: ["animals-public"],
    queryFn: async () => (await supabase.from("animals").select("*").eq("published", true).order("created_at", { ascending: false })).data as Animal[] ?? [],
  });
  const [sel, setSel] = useState<Animal | null>(null);
  return (
    <>
      <PageHero kicker="Adopt. Don't Shop." title="Give a rescued animal a forever home">Every animal listed here has been added by our team. Sign in to send an adoption enquiry.</PageHero>
      <div className="mx-auto max-w-7xl px-4 py-14">
        {isLoading ? <p className="text-muted-foreground">Loading…</p> : data.length === 0 ? (
          <div className="rounded-2xl border bg-card p-12 text-center"><PawPrint className="mx-auto text-leaf" /><p className="mt-4 text-lg">No animals are currently listed for adoption. Please check back soon.</p></div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.map((a) => (
              <article key={a.id} className="overflow-hidden rounded-2xl border bg-card shadow-soft">
                {a.photos[0] ? <img src={a.photos[0]} alt={a.name} loading="lazy" className="aspect-[4/3] w-full object-cover" /> : <div className="grid aspect-[4/3] place-items-center bg-muted"><PawPrint className="text-muted-foreground" /></div>}
                <div className="p-5">
                  <div className="flex items-center justify-between"><h3 className="text-xl font-semibold">{a.name}</h3><Badge variant={a.adoption_status === "Available" ? "default" : "secondary"}>{a.adoption_status}</Badge></div>
                  <p className="mt-1 text-sm text-muted-foreground">{[a.species, a.age, a.gender, a.location].filter(Boolean).join(" · ")}</p>
                  <Button variant="pill" size="sm" className="mt-4" onClick={() => setSel(a)}>View & enquire</Button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
      <Dialog open={!!sel} onOpenChange={(o) => !o && setSel(null)}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          {sel && <>
            <DialogHeader><DialogTitle>{sel.name}</DialogTitle></DialogHeader>
            {sel.photos.length > 0 && <div className="flex gap-2 overflow-x-auto">{sel.photos.map((p) => <img key={p} src={p} alt={sel.name} className="h-40 rounded-lg object-cover" />)}</div>}
            <dl className="grid grid-cols-2 gap-2 text-sm">
              {([["GeoPet ID™", sel.geopet_id], ["Species", sel.species], ["Age", sel.age], ["Gender", sel.gender], ["Location", sel.location], ["Health", sel.health_status], ["Vaccination", sel.vaccination_status], ["Sterilization", sel.sterilization_status], ["Behaviour", sel.behaviour]] as const).filter(([, v]) => v).map(([k, v]) => <div key={k}><dt className="text-muted-foreground">{k}</dt><dd className="font-semibold">{v}</dd></div>)}
            </dl>
            {sel.rescue_story && <p className="text-sm"><b>Rescue story:</b> {sel.rescue_story}</p>}
            {sel.description && <p className="text-sm">{sel.description}</p>}
            {sel.adoption_status === "Available" && <SubmissionForm type="Adoption" animalId={sel.id} requireLogin submitLabel="Interested in Adoption" extras={[{ name: "animal", label: "Animal", options: [sel.name] }]} />}
          </>}
        </DialogContent>
      </Dialog>
    </>
  );
}
