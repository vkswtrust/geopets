import { createFileRoute, Link } from "@tanstack/react-router";
import { HeartHandshake, PawPrint, Siren, Home as HomeIcon, Users, HandCoins, Mail, Stethoscope, Soup, ShieldCheck, Ambulance, QrCode } from "lucide-react";
import hero from "@/assets/hero.jpg";
import { Button } from "@/components/ui/button";
import { meta } from "@/components/site";
import { useAuth, signInWithGoogle } from "@/lib/auth";

export const Route = createFileRoute("/")({
  head: () => meta("Every Life Matters. Every Paw Deserves Love.", "GeoPetCare Foundation rescues, treats, feeds and rehomes animals. One World. One Family. Every Pet Counts."),
  component: Home,
});

const actions = [
  { to: "/adopt", label: "Adopt", icon: HomeIcon },
  { to: "/programs/volunteer", label: "Volunteer", icon: Users },
  { to: "/sponsor", label: "Sponsor A Life", icon: HeartHandshake },
  { to: "/donate", label: "Donate", icon: HandCoins },
  { to: "/programs/rescue", label: "Emergency Rescue", icon: Siren },
  { to: "/contact", label: "Contact Us", icon: Mail },
];
const work = [
  { slug: "rescue", label: "Rescue", icon: PawPrint },
  { slug: "emergency-care", label: "Emergency Medical Care", icon: Stethoscope },
  { slug: "community-feeding", label: "Community Feeding", icon: Soup },
  { slug: "sterilization", label: "Sterilization Programme", icon: ShieldCheck },
  { slug: "ambulance", label: "Animal Ambulance", icon: Ambulance },
  { slug: "foster", label: "Foster Programme", icon: HomeIcon },
];

function Home() {
  const { session, profile } = useAuth();
  return (
    <>
      <section className="bg-hero">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-14 md:grid-cols-2 md:py-20">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-leaf">GeoPetCare Foundation</p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight text-primary md:text-6xl">Every Life Matters. Every Paw Deserves Love.</h1>
            <p className="mt-5 text-xl text-muted-foreground">One World. One Family. Every Pet Counts.</p>
            <div className="mt-8 rounded-2xl border bg-card p-5 shadow-soft">
              {session ? (
                <p className="text-sm">Welcome back, <b>{profile?.name}</b> · <span className="text-leaf font-semibold">{profile?.gpc_id}</span> · <Link to="/submissions" className="text-primary underline">My Submissions</Link></p>
              ) : (
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm text-muted-foreground">Sign in to adopt, volunteer, foster and track your submissions.</p>
                  <Button variant="pill" onClick={() => signInWithGoogle()}>Continue with Google</Button>
                </div>
              )}
            </div>
          </div>
          <img src={hero} alt="A volunteer gently holding a rescued puppy beside a cat" className="aspect-[4/3] w-full rounded-[2rem] object-cover shadow-soft" />
        </div>
      </section>

      <section className="mx-auto -mt-2 max-w-7xl px-4 py-12">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {actions.map((a) => (
            <a key={a.label} href={a.to} className="group flex flex-col items-center gap-3 rounded-2xl border bg-card p-5 text-center transition hover:-translate-y-0.5 hover:border-leaf hover:shadow-soft">
              <span className="grid size-12 place-items-center rounded-full bg-accent text-accent-foreground group-hover:bg-leaf group-hover:text-leaf-foreground"><a.icon /></span>
              <span className="text-sm font-semibold">{a.label}</span>
            </a>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12">
        <h2 className="text-3xl font-semibold text-primary">How we care</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {work.map((w) => (
            <Link key={w.slug} to="/programs/$slug" params={{ slug: w.slug }} className="rounded-2xl border bg-card p-6 transition hover:shadow-soft">
              <w.icon className="text-leaf" />
              <p className="mt-4 font-display text-lg font-semibold">{w.label}</p>
              <p className="mt-1 text-sm text-primary">Learn more →</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid items-center gap-8 rounded-[2rem] bg-primary p-10 text-primary-foreground md:grid-cols-[1fr_auto]">
          <div>
            <QrCode className="size-10 text-leaf" />
            <h2 className="mt-3 text-3xl font-semibold">GeoPet ID™</h2>
            <p className="mt-2 max-w-2xl opacity-85">A unique identity for every rescued animal — medical records, vaccinations, rescue history and recovery timeline in one place.</p>
          </div>
          <Button asChild variant="leaf" size="lg"><Link to="/geopet-id">Explore GeoPet ID™</Link></Button>
        </div>
      </section>
    </>
  );
}
