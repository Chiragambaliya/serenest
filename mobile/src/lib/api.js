import { supabase } from './supabase';

const BASE = process.env.EXPO_PUBLIC_API_URL ?? '';

async function request(method, path, body, token) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  const opts = { method, headers };
  if (body !== undefined) opts.body = JSON.stringify(body);

  const res = await fetch(`${BASE}${path}`, opts);
  const text = await res.text();
  let json;
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    throw new Error('Unexpected server response. Please try again.');
  }
  if (!json.ok) throw new Error(json.error ?? 'Request failed');
  return json;
}

export const health = () => request('GET', '/api/health');

export const bookings = {
  create: (data) => request('POST', '/api/bookings', data),
};

export const patientBookings = {
  list: async () => {
    if (!supabase) throw new Error('Auth not available');
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) throw new Error('Not signed in');
    return request('GET', '/api/patient/bookings', undefined, session.access_token);
  },
};
