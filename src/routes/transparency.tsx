import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageHero, meta } from "@/components/site";
import { settingsQuery } from "@/lib/settings";
import { statKeys } from "@/lib/content";

export const Route = createFileRoute("/transparency")({
  head: () => meta("Transparency", "Genuine impact statistics from GeoPetCare Foundation, entered from real records."),
  component: Transparency,
});

function Transparency() {
  const { data: s = {} } = useQuery(settingsQuery);
  return (
    <>
      <PageHero kicker="Transparency" title="Real numbers. Nothing invented.">Statistics are shown only when our team has entered genuine figures.</PageHero>
      <div className="mx-auto grid max-w-6xl gap-4 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
        {statKeys.map(([k, label]) => (
          <div key={k} className="rounded-2xl border bg-card p-6">
            <p className="text-sm text-muted-foreground">{label}</p>
            {s[k] ? <p className="mt-2 font-display text-3xl font-semibold text-primary">{s[k]}</p> : <p className="mt-2 text-sm italic text-muted-foreground">Data will be updated soon.</p>}
          </div>
        ))}
      </div>
    </>
  );
}
