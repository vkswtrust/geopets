import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

type Profile = { id: string; name: string | null; email: string | null; gpc_id: string; created_at: string };
type AuthCtx = { session: Session | null; profile: Profile | null; isAdmin: boolean; loading: boolean; refresh: () => Promise<void> };

const Ctx = createContext<AuthCtx>({ session: null, profile: null, isAdmin: false, loading: true, refresh: async () => {} });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  async function load(s: Session | null) {
    setSession(s);
    if (!s) { setProfile(null); setIsAdmin(false); setLoading(false); return; }
    const [{ data: p }, { data: r }] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", s.user.id).maybeSingle(),
      supabase.from("user_roles").select("role").eq("user_id", s.user.id),
    ]);
    setProfile(p as Profile | null);
    setIsAdmin(!!r?.some((x) => x.role === "admin"));
    setLoading(false);
  }

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, s) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "INITIAL_SESSION" || event === "USER_UPDATED") {
        setTimeout(() => load(s), 0);
      }
    });
    return () => data.subscription.unsubscribe();
  }, []);

  return (
    <Ctx.Provider value={{ session, profile, isAdmin, loading, refresh: async () => load((await supabase.auth.getSession()).data.session) }}>
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => useContext(Ctx);

export async function signInWithGoogle() {
  return lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/login" });
}
export const signOut = () => supabase.auth.signOut();
