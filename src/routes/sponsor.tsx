import { createFileRoute, Link } from "@tanstack/react-router";
import { Soup, Syringe, HeartPulse, ShieldCheck, MapPin, Ambulance, Building2 } from "lucide-react";
import { PageHero, meta } from "@/components/site";
import { SubmissionForm } from "@/components/SubmissionForm";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/sponsor")({
  head: () => meta("Sponsor A Life", "How sponsorship supports feeding, treatment, rehabilitation and rescue of animals with GeoPetCare Foundation."),
  component: Sponsor,
});

const uses = [
  [Soup, "Feeding rescued animals", "Nutritious, regular meals for animals in our care."],
  [Syringe, "Vaccination & treatment", "Vaccines, medicines and veterinary treatment."],
  [HeartPulse, "Rehabilitation", "Recovery care, shelter and follow-up for injured animals."],
  [ShieldCheck, "Sterilization & medical care", "Safe sterilization with complete post-operative care."],
  [MapPin, "Community feeding zones", "Clean, regular feeding points for street animals."],
  [Ambulance, "Rescue vehicle support", "Fuel, equipment and running of rescue transport."],
  [Building2, "City welfare partnership", "Long-term support for animal welfare across a city."],
] as const;

function Sponsor() {
  return (
    <>
      <PageHero kicker="Sponsor A Life" title="How your support is used">Every sponsorship goes directly into the care of animals.</PageHero>
      <div className="mx-auto max-w-6xl space-y-12 px-4 py-14">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {uses.map(([Icon, title, text]) => (
            <div key={title} className="rounded-2xl border bg-card p-6 shadow-soft">
              <Icon className="text-leaf" />
              <p className="mt-3 font-display text-lg font-semibold text-primary">{title}</p>
              <p className="mt-1 text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
        <Button asChild variant="leaf"><Link to="/donate">View donation details</Link></Button>
        <section>
          <h2 className="mb-4 text-2xl font-semibold text-primary">Sponsorship enquiry</h2>
          <SubmissionForm requireLogin type="Sponsorship" extras={[{ name: "area", label: "Area you'd like to support", options: uses.map(([, t]) => t) }]} submitLabel="Send enquiry" />
        </section>
      </div>
    </>
  );
}
