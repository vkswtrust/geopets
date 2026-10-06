import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageHero, meta } from "@/components/site";
import { SubmissionForm } from "@/components/SubmissionForm";
import { submissionTypes } from "@/lib/content";
import { settingsQuery } from "@/lib/settings";

export const Route = createFileRoute("/contact")({
  head: () => meta("Contact / Enquiry", "Send a general, volunteer, foster, adoption, CSR or sponsorship enquiry to GeoPetCare Foundation."),
  component: Contact,
});

function Contact() {
  const { data: s = {} } = useQuery(settingsQuery);
  return (
    <>
      <PageHero kicker="Contact / Enquiry" title="We'd love to hear from you">
        {s["contact_email"] && <>Email: <a className="text-primary underline" href={`mailto:${s["contact_email"]}`}>{s["contact_email"]}</a></>}
      </PageHero>
      <div className="mx-auto max-w-3xl px-4 py-14">
        <SubmissionForm type="General" typeChoices={submissionTypes} submitLabel="Send enquiry" />
      </div>
    </>
  );
}
