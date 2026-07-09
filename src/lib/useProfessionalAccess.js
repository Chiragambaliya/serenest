import { useEffect, useState } from 'react';
import { supabase } from './supabase';
import { useAuth } from './useAuth';

const BASE = import.meta.env.VITE_API_URL ?? '';

/**
 * True when the signed-in user is an approved Serenest professional.
 * Academy is free for those accounts.
 */
export function useProfessionalAccess() {
  const { user, loading: authLoading } = useAuth();
  const [professional, setProfessional] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function check() {
      if (authLoading) return;
      if (!user || !supabase) {
        if (active) {
          setProfessional(null);
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;
        if (!token) {
          if (active) {
            setProfessional(null);
            setLoading(false);
          }
          return;
        }

        const res = await fetch(`${BASE}/api/professional/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json().catch(() => ({}));
        if (active) {
          setProfessional(res.ok && json.ok ? json.professional : null);
          setLoading(false);
        }
      } catch {
        if (active) {
          setProfessional(null);
          setLoading(false);
        }
      }
    }

    check();
    return () => {
      active = false;
    };
  }, [user, authLoading]);

  return {
    user,
    professional,
    isProfessional: Boolean(professional),
    loading: authLoading || loading,
  };
}
