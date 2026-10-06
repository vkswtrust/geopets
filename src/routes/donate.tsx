import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageHero, meta } from "@/components/site";
import { settingsQuery } from "@/lib/settings";
import { donationKeys } from "@/lib/content";

export const Route = createFileRoute("/donate")({
  head: () => meta("Donate", "Support GeoPetCare Foundation's rescue, medical care and feeding work with a donation."),
  component: Donate,
});

function Donate() {
  const { data: s = {}, isLoading } = useQuery(settingsQuery);
  const rows = donationKeys.filter(([k]) => k !== "donate_qr" && s[k]);
  const has = rows.length > 0 || s["donate_qr"];
  return (
    <>
      <PageHero kicker="Donate" title="Your kindness keeps them going">Every contribution supports rescue, treatment and care.</PageHero>
      <div className="mx-auto max-w-4xl px-4 py-14">
        {isLoading ? <p>Loading…</p> : !has ? (
          <p className="rounded-2xl border bg-muted p-10 text-center text-muted-foreground">Donation details will be updated soon.</p>
        ) : (
          <div className="grid gap-8 rounded-2xl border bg-card p-8 shadow-soft md:grid-cols-[auto_1fr]">
            {s["donate_qr"] && <img src={s["donate_qr"]} alt="Donation payment QR code" className="size-56 rounded-xl border object-contain" />}
            <dl className="space-y-3">
              {rows.map(([k, label]) => <div key={k}><dt className="text-sm text-muted-foreground">{label}</dt><dd className="whitespace-pre-line font-semibold">{s[k]}</dd></div>)}
            </dl>
          </div>
        )}
      </div>
    </>
  );
}
