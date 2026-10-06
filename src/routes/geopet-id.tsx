import { createFileRoute } from "@tanstack/react-router";
import { QrCode, Stethoscope, Syringe, LifeBuoy, Home, HeartHandshake, LineChart, Lock } from "lucide-react";
import { PageHero, meta } from "@/components/site";

export const Route = createFileRoute("/geopet-id")({
  head: () => meta("GeoPet ID™", "GeoPet ID™ gives every rescued animal a unique identity with medical, vaccination, rescue and recovery records."),
  component: GeoPetId,
});

const items = [
  [QrCode, "QR identity"], [Stethoscope, "Medical Record"], [Syringe, "Vaccination History"], [LifeBuoy, "Rescue History"],
  [Home, "Adoption Status"], [HeartHandshake, "Sponsor Information"], [LineChart, "Recovery Timeline"],
] as const;

function GeoPetId() {
  return (
    <>
      <PageHero kicker="GeoPet ID™" title="A unique identity for every animal">Each animal in our care can receive a GeoPet ID™ that brings its whole story together.</PageHero>
      <div className="mx-auto max-w-5xl space-y-8 px-4 py-14">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(([Icon, label]) => <div key={label} className="rounded-2xl border bg-card p-5"><Icon className="text-leaf" /><p className="mt-3 font-semibold">{label}</p></div>)}
        </div>
        <p className="flex gap-3 rounded-2xl bg-secondary p-5 text-secondary-foreground"><Lock className="shrink-0" />Private animal records are kept private. Only authorised GeoPetCare administrators can create or edit GeoPet ID™ records.</p>
      </div>
    </>
  );
}
