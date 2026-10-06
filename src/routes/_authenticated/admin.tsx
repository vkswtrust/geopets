import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, signOut } from "@/lib/auth";
import { meta } from "@/components/site";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { submissionTypes, statuses, statKeys, donationKeys, contentKeys } from "@/lib/content";
import { settingsQuery } from "@/lib/settings";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [...meta("Admin Dashboard", "GeoPetCare administration.").meta, { name: "robots", content: "noindex" }] }),
  component: Admin,
});

const sel = "h-9 rounded-md border border-input bg-background px-2 text-sm";

function Admin() {
  const { isAdmin, loading } = useAuth();
  if (loading) return <p className="p-20 text-center">Loading…</p>;
  if (!isAdmin) return (
    <div className="p-20 text-center"><p className="text-lg">You don't have Admin access.</p>
      <Link to="/profile" className="mt-3 inline-block text-primary underline">Request access from your profile</Link></div>
  );
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between"><h1 className="text-3xl font-semibold text-primary">Admin Dashboard</h1><Button variant="outline" onClick={() => signOut()}>Logout</Button></div>
      <Tabs defaultValue="overview">
        <TabsList className="flex h-auto flex-wrap justify-start">
          {["overview", "users", "submissions", "animals", "donations", "settings", "requests", "audit"].map((t) => <TabsTrigger key={t} value={t} className="capitalize">{t === "requests" ? "Access Requests" : t === "audit" ? "Audit Logs" : t === "settings" ? "Donation Details, Stats & Settings" : t}</TabsTrigger>)}
        </TabsList>
        <TabsContent value="overview"><Overview /></TabsContent>
        <TabsContent value="users"><Users /></TabsContent>
        <TabsContent value="submissions"><Submissions /></TabsContent>
        <TabsContent value="animals"><Animals /></TabsContent>
        <TabsContent value="donations"><Donations /></TabsContent>
        <TabsContent value="settings"><Settings /></TabsContent>
        <TabsContent value="requests"><Requests /></TabsContent>
        <TabsContent value="audit"><Audit /></TabsContent>
      </Tabs>
    </div>
  );
}

const count = async (t: "profiles" | "submissions" | "animals" | "donations" | "admin_access_requests", f?: [string, string]) => {
  let q = supabase.from(t).select("*", { count: "exact", head: true });
  if (f) q = q.eq(f[0], f[1]);
  return (await q).count ?? 0;
};

function Overview() {
  const { data } = useQuery({ queryKey: ["admin-overview"], queryFn: async () => ({
    Users: await count("profiles"), Submissions: await count("submissions"), "Pending submissions": await count("submissions", ["status", "Pending"]),
    Animals: await count("animals"), "Donation records": await count("donations"), "Pending admin requests": await count("admin_access_requests", ["status", "Pending"]),
  }) });
  return <div className="mt-6 grid gap-4 sm:grid-cols-3">{data && Object.entries(data).map(([k, v]) => <div key={k} className="rounded-2xl border bg-card p-6"><p className="text-sm text-muted-foreground">{k}</p><p className="font-display text-3xl font-semibold text-primary">{v}</p></div>)}</div>;
}

function Users() {
  const [q, setQ] = useState("");
  const { data = [] } = useQuery({ queryKey: ["admin-users"], queryFn: async () => (await supabase.from("profiles").select("*").order("created_at")).data ?? [] });
  const rows = data.filter((u) => `${u.name} ${u.email} ${u.gpc_id}`.toLowerCase().includes(q.toLowerCase()));
  return <div className="mt-6 space-y-3"><Input placeholder="Search users…" value={q} onChange={(e) => setQ(e.target.value)} className="max-w-sm" />
    <Table head={["GPC ID", "Name", "Email", "Joined"]} rows={rows.map((u) => [u.gpc_id, u.name, u.email, new Date(u.created_at).toLocaleDateString()])} /></div>;
}

function Submissions() {
  const qc = useQueryClient();
  const [type, setType] = useState("All"); const [status, setStatus] = useState("All"); const [q, setQ] = useState("");
  const { data = [] } = useQuery({ queryKey: ["admin-subs"], queryFn: async () => (await supabase.from("submissions").select("*").order("created_at", { ascending: false })).data ?? [] });
  const rows = data.filter((s) => (type === "All" || s.type === type) && (status === "All" || s.status === status) && `${s.name} ${s.email} ${s.gpc_id} ${s.message}`.toLowerCase().includes(q.toLowerCase()));
  async function update(id: string, st: string) {
    const { error } = await supabase.from("submissions").update({ status: st }).eq("id", id);
    if (error) toast.error("Update failed"); else qc.invalidateQueries({ queryKey: ["admin-subs"] });
  }
  return (
    <div className="mt-6 space-y-3">
      <div className="flex flex-wrap gap-2">
        <Input placeholder="Search…" value={q} onChange={(e) => setQ(e.target.value)} className="max-w-xs" />
        <select className={sel} value={type} onChange={(e) => setType(e.target.value)}><option>All</option>{submissionTypes.map((t) => <option key={t}>{t}</option>)}</select>
        <select className={sel} value={status} onChange={(e) => setStatus(e.target.value)}><option>All</option>{statuses.map((t) => <option key={t}>{t}</option>)}</select>
      </div>
      {rows.length === 0 && <p className="text-muted-foreground">No submissions.</p>}
      {rows.map((s) => (
        <div key={s.id} className="rounded-2xl border bg-card p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-semibold"><Badge variant="secondary" className="mr-2">{s.type}</Badge>{s.name} · {s.email}{s.phone && ` · ${s.phone}`} {s.gpc_id && <span className="text-leaf">· {s.gpc_id}</span>}</p>
            <select className={sel} value={s.status} onChange={(e) => update(s.id, e.target.value)}>{statuses.map((t) => <option key={t}>{t}</option>)}</select>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{new Date(s.created_at).toLocaleString()}</p>
          {Object.entries((s.details ?? {}) as Record<string, string>).filter(([, v]) => v).map(([k, v]) => <p key={k} className="text-sm"><b>{k}:</b> {v}</p>)}
          {s.message && <p className="mt-2 whitespace-pre-line text-sm">{s.message}</p>}
        </div>
      ))}
    </div>
  );
}

async function upload(file: File) {
  const path = `${crypto.randomUUID()}-${file.name.replace(/[^\w.-]/g, "_")}`;
  const { error } = await supabase.storage.from("media").upload(path, file);
  if (error) throw error;
  const { data, error: e2 } = await supabase.storage.from("media").createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
  if (e2 || !data) throw e2;
  return data.signedUrl;
}

const animalFields = ["name", "species", "age", "gender", "location", "geopet_id", "health_status", "vaccination_status", "sterilization_status", "behaviour"] as const;
const animalLong = ["rescue_story", "description"] as const;
const geoFields = ["medical_record", "vaccination_history", "rescue_history", "sponsor_info", "recovery_timeline"] as const;
const label = (k: string) => k.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()).replace("Geopet Id", "GeoPet ID™");

type AnimalRow = Record<string, unknown> & { id: string; name: string; photos: string[]; published: boolean; adoption_status: string };

function Animals() {
  const qc = useQueryClient();
  const [edit, setEdit] = useState<AnimalRow | "new" | null>(null);
  const { data = [] } = useQuery({ queryKey: ["admin-animals"], queryFn: async () => (await supabase.from("animals").select("*").order("created_at", { ascending: false })).data as AnimalRow[] ?? [] });
  async function del(id: string) {
    if (!confirm("Delete this animal?")) return;
    await supabase.from("animals").delete().eq("id", id); qc.invalidateQueries({ queryKey: ["admin-animals"] });
  }
  if (edit) return <AnimalForm animal={edit === "new" ? null : edit} onDone={() => { setEdit(null); qc.invalidateQueries({ queryKey: ["admin-animals"] }); }} />;
  return (
    <div className="mt-6 space-y-3">
      <Button variant="pill" onClick={() => setEdit("new")}>Add animal</Button>
      {data.length === 0 && <p className="text-muted-foreground">No animals yet.</p>}
      {data.map((a) => (
        <div key={a.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-card p-4">
          <div className="flex items-center gap-3">{a.photos[0] && <img src={a.photos[0]} alt="" className="size-12 rounded-lg object-cover" />}<p className="font-semibold">{a.name} <span className="text-sm font-normal text-muted-foreground">{String(a.geopet_id ?? "")}</span></p>
            <Badge>{a.adoption_status}</Badge><Badge variant={a.published ? "default" : "secondary"}>{a.published ? "Published" : "Hidden"}</Badge></div>
          <div className="flex gap-2"><Button size="sm" variant="outline" onClick={() => setEdit(a)}>Edit</Button><Button size="sm" variant="destructive" onClick={() => del(a.id)}>Delete</Button></div>
        </div>
      ))}
    </div>
  );
}

function AnimalForm({ animal, onDone }: { animal: AnimalRow | null; onDone: () => void }) {
  const [photos, setPhotos] = useState<string[]>(animal?.photos ?? []);
  const [busy, setBusy] = useState(false);
  const { data: geo } = useQuery({ queryKey: ["geo", animal?.id], enabled: !!animal, queryFn: async () => (await supabase.from("geopet_records").select("*").eq("animal_id", animal!.id).maybeSingle()).data });
  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); setBusy(true);
    const f = new FormData(e.currentTarget);
    const v = (k: string) => (String(f.get(k) ?? "").trim() || null);
    const row: Record<string, unknown> = { photos, published: f.get("published") === "on", adoption_status: v("adoption_status") ?? "Available" };
    [...animalFields, ...animalLong].forEach((k) => (row[k] = v(k)));
    if (!row.name) { toast.error("Name required"); setBusy(false); return; }
    const res = animal ? await supabase.from("animals").update(row).eq("id", animal.id).select("id").single()
      : await supabase.from("animals").insert(row as never).select("id").single();
    if (res.error) { toast.error(res.error.message); setBusy(false); return; }
    const g: Record<string, unknown> = { animal_id: res.data.id, updated_at: new Date().toISOString() };
    geoFields.forEach((k) => (g[k] = v(k)));
    await supabase.from("geopet_records").upsert(g as never);
    toast.success("Saved"); onDone();
  }
  async function addPhotos(files: FileList | null) {
    if (!files) return;
    try { const urls = await Promise.all([...files].map(upload)); setPhotos((p) => [...p, ...urls]); } catch { toast.error("Upload failed"); }
  }
  const val = (k: string) => (animal?.[k] as string) ?? "";
  return (
    <form onSubmit={onSubmit} className="mt-6 grid gap-4 rounded-2xl border bg-card p-6" key={geo ? "g" : "n"}>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {animalFields.map((k) => <label key={k} className="grid gap-1 text-sm">{label(k)}<Input name={k} defaultValue={val(k)} /></label>)}
        <label className="grid gap-1 text-sm">Adoption Status<select name="adoption_status" defaultValue={animal?.adoption_status ?? "Available"} className={sel}>{["Available", "Adopted", "Fostered"].map((s) => <option key={s}>{s}</option>)}</select></label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="published" defaultChecked={animal?.published ?? false} /> Published (visible on Adopt page)</label>
      </div>
      {animalLong.map((k) => <label key={k} className="grid gap-1 text-sm">{label(k)}<Textarea name={k} defaultValue={val(k)} /></label>)}
      <div><p className="text-sm font-semibold">Photos</p>
        <div className="mt-2 flex flex-wrap gap-2">{photos.map((p) => <button type="button" key={p} onClick={() => setPhotos(photos.filter((x) => x !== p))} title="Remove"><img src={p} alt="" className="size-20 rounded-lg object-cover" /></button>)}</div>
        <input type="file" accept="image/*" multiple onChange={(e) => addPhotos(e.target.files)} className="mt-2 text-sm" /></div>
      <p className="mt-2 font-display text-lg font-semibold text-primary">Private GeoPet ID™ record (admin only)</p>
      {geoFields.map((k) => <label key={k} className="grid gap-1 text-sm">{label(k)}<Textarea name={k} defaultValue={(geo?.[k] as string) ?? ""} /></label>)}
      <div className="flex gap-2"><Button type="submit" variant="pill" disabled={busy}>Save</Button><Button type="button" variant="outline" onClick={onDone}>Cancel</Button></div>
    </form>
  );
}

function Donations() {
  const qc = useQueryClient();
  const { data = [] } = useQuery({ queryKey: ["admin-donations"], queryFn: async () => (await supabase.from("donations").select("*").order("donated_on", { ascending: false })).data ?? [] });
  async function add(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); const form = e.currentTarget; const f = new FormData(form);
    const v = (k: string) => String(f.get(k) ?? "").trim() || null;
    const amount = Number(f.get("amount"));
    if (!v("donor_name") || !(amount > 0)) { toast.error("Donor name and amount required"); return; }
    const { error } = await supabase.from("donations").insert({ donor_name: v("donor_name")!, email: v("email"), amount, method: v("method"), reference: v("reference"), notes: v("notes"), donated_on: v("donated_on") ?? undefined });
    if (error) toast.error(error.message); else { form.reset(); qc.invalidateQueries({ queryKey: ["admin-donations"] }); }
  }
  async function del(id: string) { if (confirm("Delete record?")) { await supabase.from("donations").delete().eq("id", id); qc.invalidateQueries({ queryKey: ["admin-donations"] }); } }
  return (
    <div className="mt-6 space-y-4">
      <form onSubmit={add} className="grid gap-2 rounded-2xl border bg-card p-4 sm:grid-cols-4">
        <Input name="donor_name" placeholder="Donor name" /><Input name="email" placeholder="Email" /><Input name="amount" type="number" step="0.01" placeholder="Amount (₹)" /><Input name="donated_on" type="date" />
        <Input name="method" placeholder="Method" /><Input name="reference" placeholder="Reference" /><Input name="notes" placeholder="Notes" /><Button type="submit" variant="pill">Add genuine record</Button>
      </form>
      <Table head={["Date", "Donor", "Amount", "Method", "Reference", ""]} rows={data.map((d) => [d.donated_on, `${d.donor_name}${d.email ? ` (${d.email})` : ""}`, "₹" + Number(d.amount).toLocaleString("en-IN"), d.method, d.reference,
        <Button key="d" size="sm" variant="ghost" onClick={() => del(d.id)}>Delete</Button>])} />
    </div>
  );
}

function Settings() {
  const qc = useQueryClient();
  const { data: s = {} } = useQuery(settingsQuery);
  async function save(key: string, value: string) {
    const { error } = await supabase.from("site_settings").upsert({ key, value: value.trim() || null, updated_at: new Date().toISOString() });
    if (error) toast.error(error.message); else { toast.success("Saved"); qc.invalidateQueries({ queryKey: ["settings"] }); }
  }
  async function qr(file?: File) { if (!file) return; try { await save("donate_qr", await upload(file)); } catch { toast.error("Upload failed"); } }
  const group = (title: string, keys: readonly (readonly [string, string])[], long = false) => (
    <section className="rounded-2xl border bg-card p-6">
      <h3 className="mb-4 text-lg font-semibold text-primary">{title}</h3>
      <div className="grid gap-3 sm:grid-cols-2">
        {keys.filter(([k]) => k !== "donate_qr").map(([k, l]) => <SettingField key={k + (s[k] ?? "")} k={k} label={l} value={s[k] ?? ""} onSave={save} long={long || k.startsWith("content_")} />)}
      </div>
    </section>
  );
  return (
    <div className="mt-6 space-y-6">
      <section className="rounded-2xl border bg-card p-6">
        <h3 className="mb-3 text-lg font-semibold text-primary">Payment QR image</h3>
        {s.donate_qr && <img src={s.donate_qr} alt="QR" className="mb-3 size-40 rounded-lg border object-contain" />}
        <div className="flex gap-2"><input type="file" accept="image/*" onChange={(e) => qr(e.target.files?.[0])} className="text-sm" />{s.donate_qr && <Button size="sm" variant="ghost" onClick={() => save("donate_qr", "")}>Remove</Button>}</div>
      </section>
      {group("Donation details", donationKeys)}
      {group("Impact statistics (leave blank to show “Data will be updated soon.”)", statKeys)}
      {group("Contact & page content", contentKeys)}
    </div>
  );
}

function SettingField({ k, label, value, onSave, long }: { k: string; label: string; value: string; onSave: (k: string, v: string) => void; long?: boolean }) {
  const [v, setV] = useState(value);
  return (
    <div className={`grid gap-1 text-sm ${long ? "sm:col-span-2" : ""}`}>{label}
      <div className="flex gap-2">{long ? <Textarea value={v} onChange={(e) => setV(e.target.value)} rows={4} /> : <Input value={v} onChange={(e) => setV(e.target.value)} />}
        <Button size="sm" variant="outline" disabled={v === value} onClick={() => onSave(k, v)}>Save</Button></div>
    </div>
  );
}

function Requests() {
  const qc = useQueryClient();
  const { data = [] } = useQuery({ queryKey: ["admin-requests"], queryFn: async () => (await supabase.from("admin_access_requests").select("*").order("created_at", { ascending: false })).data ?? [] });
  async function set(id: string, status: string) {
    const { error } = await supabase.from("admin_access_requests").update({ status }).eq("id", id);
    if (error) toast.error(error.message); else qc.invalidateQueries({ queryKey: ["admin-requests"] });
  }
  return <div className="mt-6"><Table head={["Name", "Email", "Date", "Status", ""]} rows={data.map((r) => [r.name, r.email, new Date(r.created_at).toLocaleDateString(), r.status,
    <div key="a" className="flex gap-1"><Button size="sm" variant="leaf" onClick={() => set(r.id, "Approved")}>Approve</Button><Button size="sm" variant="outline" onClick={() => set(r.id, "Rejected")}>Reject</Button></div>])} /></div>;
}

function Audit() {
  const { data = [] } = useQuery({ queryKey: ["admin-audit"], queryFn: async () => (await supabase.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(300)).data ?? [] });
  return <div className="mt-6"><Table head={["When", "Admin", "Action", "Area", "Record"]} rows={data.map((a) => [new Date(a.created_at).toLocaleString(), a.actor_email, a.action, a.table_name, a.record_id])} /></div>;
}

function Table({ head, rows }: { head: string[]; rows: React.ReactNode[][] }) {
  if (rows.length === 0) return <p className="text-muted-foreground">No records.</p>;
  return (
    <div className="overflow-x-auto rounded-2xl border bg-card">
      <table className="w-full text-sm"><thead className="bg-muted text-left"><tr>{head.map((h) => <th key={h} className="p-3 font-semibold">{h}</th>)}</tr></thead>
        <tbody>{rows.map((r, i) => <tr key={i} className="border-t">{r.map((c, j) => <td key={j} className="p-3">{c}</td>)}</tr>)}</tbody></table>
    </div>
  );
}
