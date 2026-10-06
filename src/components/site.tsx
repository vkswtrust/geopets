import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Menu, X } from "lucide-react";
import logo from "@/assets/logo.jpg.asset.json";
import { Button } from "@/components/ui/button";
import { useAuth, signOut } from "@/lib/auth";
import { programs } from "@/lib/content";

const main = [
  { to: "/adopt", label: "Adopt" },
  { to: "/programs/$slug", params: { slug: "volunteer" }, label: "Volunteer" },
  { to: "/sponsor", label: "Sponsor A Life" },
  { to: "/geopet-id", label: "GeoPet ID™" },
  { to: "/transparency", label: "Transparency" },
  { to: "/contact", label: "Contact" },
] as const;

export function Logo({ className = "h-12" }: { className?: string }) {
  return <img src={logo.url} alt="GeoPetCare — One World. One Family. Every Pet Counts." className={`${className} w-auto object-contain`} />;
}

export function SiteHeader() {
  const { session, isAdmin } = useAuth();
  const [open, setOpen] = useState(false);
  const links = (
    <>
      {main.map((l) => (
        <Link key={l.label} to={l.to} {...("params" in l ? { params: l.params } : {})} onClick={() => setOpen(false)}
          className="text-sm font-semibold text-foreground/80 hover:text-primary" activeProps={{ className: "text-primary" }}>
          {l.label}
        </Link>
      ))}
    </>
  );
  return (
    <header className="sticky top-0 z-40 border-b bg-card/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2">
        <Link to="/" aria-label="GeoPetCare home"><Logo className="h-14" /></Link>
        <nav className="hidden items-center gap-6 lg:flex">{links}</nav>
        <div className="hidden items-center gap-2 lg:flex">
          {session ? (
            <>
              {isAdmin && <Button asChild variant="ghost" size="sm"><Link to="/admin">Admin</Link></Button>}
              <Button asChild variant="ghost" size="sm"><Link to="/profile">My Account</Link></Button>
              <Button variant="outline" size="sm" onClick={() => signOut()}>Sign out</Button>
            </>
          ) : (
            <Button asChild variant="ghost" size="sm"><Link to="/login">Sign in</Link></Button>
          )}
          <Button asChild variant="leaf" size="sm"><Link to="/donate">Donate</Link></Button>
        </div>
        <button className="lg:hidden" onClick={() => setOpen(!open)} aria-label="Menu">{open ? <X /> : <Menu />}</button>
      </div>
      {open && (
        <div className="flex flex-col gap-3 border-t px-4 py-4 lg:hidden">
          {links}
          <Link to="/donate" onClick={() => setOpen(false)} className="text-sm font-semibold text-leaf">Donate</Link>
          {session ? (
            <>
              <Link to="/profile" onClick={() => setOpen(false)} className="text-sm font-semibold">My Account</Link>
              {isAdmin && <Link to="/admin" onClick={() => setOpen(false)} className="text-sm font-semibold">Admin</Link>}
              <button className="text-left text-sm font-semibold" onClick={() => signOut()}>Sign out</button>
            </>
          ) : <Link to="/login" onClick={() => setOpen(false)} className="text-sm font-semibold">Sign in</Link>}
        </div>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-4">
        <div className="md:col-span-1">
          <p className="font-display text-2xl font-semibold">GeoPetCare Foundation</p>
          <p className="mt-2 text-sm opacity-80">Every Life Matters. Every Paw Deserves Love.</p>
          <p className="mt-1 text-sm opacity-80">One World. One Family. Every Pet Counts.</p>
        </div>
        <FooterCol title="Who we are" items={programs.filter((p) => ["vision", "mission", "promise", "roadmap", "paws-of-india"].includes(p.slug))} />
        <FooterCol title="What we do" items={programs.filter((p) => ["rescue", "emergency-care", "community-feeding", "sterilization", "ambulance"].includes(p.slug))} />
        <FooterCol title="Get involved" items={programs.filter((p) => ["volunteer", "foster", "csr", "schools"].includes(p.slug))} />
      </div>
      <p className="border-t border-primary-foreground/15 py-5 text-center text-xs opacity-70">© {new Date().getFullYear()} GeoPetCare Foundation · www.GeoPetCare.com</p>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: { slug: string; kicker: string }[] }) {
  return (
    <div>
      <p className="mb-3 text-sm font-bold uppercase tracking-wider opacity-70">{title}</p>
      <ul className="space-y-2 text-sm">
        {items.map((i) => <li key={i.slug}><Link to="/programs/$slug" params={{ slug: i.slug }} className="opacity-90 hover:opacity-100 hover:underline">{i.kicker}</Link></li>)}
      </ul>
    </div>
  );
}

export function PageHero({ kicker, title, children }: { kicker: string; title: string; children?: ReactNode }) {
  return (
    <section className="bg-hero border-b">
      <div className="mx-auto max-w-5xl px-4 py-16 md:py-20">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-leaf">{kicker}</p>
        <h1 className="mt-3 text-4xl font-semibold text-primary md:text-5xl">{title}</h1>
        {children && <div className="mt-5 max-w-3xl text-lg text-muted-foreground">{children}</div>}
      </div>
    </section>
  );
}

export const meta = (title: string, description: string) => ({
  meta: [
    { title: `${title} | GeoPetCare Foundation` },
    { name: "description", content: description },
    { property: "og:title", content: `${title} | GeoPetCare Foundation` },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ],
});
