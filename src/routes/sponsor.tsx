import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero, meta } from "@/components/site";
import { SubmissionForm } from "@/components/SubmissionForm";
import { sponsorLevels } from "@/lib/content";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/sponsor")({
  head: () => meta("Sponsor A Life", "Suggested sponsorship levels to feed, treat and rehabilitate rescued animals with GeoPetCare Foundation."),
  component: Sponsor,
});

const inr = (n: number) => "₹" + n.toLocaleString("en-IN");

function Sponsor() {
  return (
    <>
      <PageHero kicker="Sponsor A Life" title="Choose how you'd like to help">These are suggested sponsorship levels only.</PageHero>
      <div className="mx-auto max-w-6xl space-y-12 px-4 py-14">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {sponsorLevels.map(([amt, label]) => (
            <div key={amt} className="flex flex-col rounded-2xl border bg-card p-6 shadow-soft">
              <p className="font-display text-3xl font-semibold text-primary">{inr(amt)}</p>
              <p className="mt-2 flex-1 text-muted-foreground">{label}</p>
              <Button asChild variant="leaf" size="sm" className="mt-5 self-start"><Link to="/donate">Sponsor</Link></Button>
            </div>
          ))}
        </div>
        <section>
          <h2 className="mb-4 text-2xl font-semibold text-primary">Sponsorship enquiry</h2>
          <SubmissionForm type="Sponsorship" extras={[{ name: "level", label: "Sponsorship level", options: sponsorLevels.map(([a, l]) => `${inr(a)} — ${l}`) }]} submitLabel="Send enquiry" />
        </section>
      </div>
    </>
  );
}
