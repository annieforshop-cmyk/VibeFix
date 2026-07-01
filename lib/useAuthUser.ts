import { useEffect, useState } from "react";
import { getSupabaseBrowser } from "./supabase/client";

export interface AuthUser {
  id: string;
  email: string | null;
}

/** Tracks the current Supabase Auth session in a client component. Returns
 * { user: null, loading: false } when Supabase isn't configured. */
export function useAuthUser() {
  const supabase = getSupabaseBrowser();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(() => supabase !== null);

  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getSession().then(({ data }) => {
      const sessionUser = data.session?.user;
      setUser(sessionUser ? { id: sessionUser.id, email: sessionUser.email ?? null } : null);
      setLoading(false);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? { id: session.user.id, email: session.user.email ?? null } : null);
    });

    return () => subscription.subscription.unsubscribe();
  }, [supabase]);

  return { user, loading };
}
