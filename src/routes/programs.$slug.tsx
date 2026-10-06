import { createFileRoute, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Phone } from "lucide-react";
import { PageHero, meta } from "@/components/site";
import { SubmissionForm } from "@/components/SubmissionForm";
import { programs } from "@/lib/content";
import { settingsQuery } from "@/lib/settings";

export const Route = createFileRoute("/programs/$slug")({
  loader: ({ params }) => {
    const p = programs.find((x) => x.slug === params.slug);
    if (!p) throw notFound();
    return p;
  },
  head: ({ loaderData }) => loaderData ? meta(loaderData.kicker, loaderData.summary) : { meta: [{ title: "Not found" }, { name: "robots", content: "noindex" }] },
  component: ProgramPage,
  notFoundComponent: () => <p className="p-20 text-center">Page not found.</p>,
  errorComponent: () => <p className="p-20 text-center">This page didn't load.</p>,
});

const volunteerRoles = ["Animal Rescuer", "Foster Parent", "Feeding Volunteer", "Event Volunteer", "Veterinary Volunteer", "Student Volunteer", "CSR Volunteer"];

function ProgramPage() {
  const p = Route.useLoaderData();
  const { data: s = {} } = useQuery(settingsQuery);
  const isContent = p.settingKey?.startsWith("content_");
  const emergency = p.settingKey === "emergency_number" ? s["emergency_number"] : undefined;
  return (
    <>
      <PageHero kicker={p.kicker} title={p.title}>{!isContent && p.summary}</PageHero>
      <div className="mx-auto max-w-5xl space-y-10 px-4 py-14">
        {isContent && (
          s[p.settingKey!] ? <div className="whitespace-pre-line rounded-2xl border bg-card p-8 text-lg leading-relaxed">{s[p.settingKey!]}</div>
            : <p className="rounded-2xl border bg-muted p-8 text-muted-foreground">Information will be updated soon.</p>
        )}
        {p.points.length > 0 && (
          <ul className="grid gap-4 sm:grid-cols-2">
            {p.points.map((pt) => <li key={pt} className="flex gap-3 rounded-2xl border bg-card p-5"><CheckCircle2 className="shrink-0 text-leaf" />{pt}</li>)}
          </ul>
        )}
        {emergency && (
          <a href={`tel:${emergency}`} className="flex items-center gap-3 rounded-2xl bg-destructive p-5 font-semibold text-destructive-foreground"><Phone /> Emergency: {emergency}</a>
        )}
        {p.form === "volunteer" && <section><h2 className="mb-4 text-2xl font-semibold text-primary">Apply to volunteer</h2>
          <SubmissionForm type="Volunteer" requireLogin extras={[{ name: "role", label: "Volunteer role", options: volunteerRoles }, { name: "city", label: "City" }]} submitLabel="Submit application" /></section>}
        {p.form === "foster" && <section><h2 className="mb-4 text-2xl font-semibold text-primary">Apply to foster</h2>
          <SubmissionForm type="Foster" requireLogin extras={[{ name: "city", label: "City" }, { name: "home", label: "Home type (flat, house, etc.)" }]} submitLabel="Submit application" /></section>}
        {p.form === "csr" && <section><h2 className="mb-4 text-2xl font-semibold text-primary">CSR enquiry</h2>
          <SubmissionForm type="CSR" extras={[{ name: "company", label: "Company / Organisation Name" }, { name: "interest", label: "CSR Interest" }]} submitLabel="Send enquiry" /></section>}
      </div>
    </>
  );
}
