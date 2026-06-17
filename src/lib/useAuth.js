import { useEffect, useState } from 'react';
import { supabase } from './supabase';

/**
 * Tracks the current Supabase Auth session (Academy accounts).
 * Returns { user, loading } and stays in sync via onAuthStateChange.
 */
export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return undefined;
    }
    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (active) {
        setUser(data.session?.user ?? null);
        setLoading(false);
      }
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      active = false;
      sub?.subscription?.unsubscribe?.();
    };
  }, []);

  return { user, loading };
}

export async function signOut() {
  if (supabase) await supabase.auth.signOut();
}
