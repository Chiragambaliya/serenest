import * as SecureStore from 'expo-secure-store';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

// SecureStore has a 2 KB per-item limit; chunk large auth tokens to stay within it.
class LargeSecureStore {
  static CHUNK = 1800;

  async setItem(key, value) {
    const n = Math.ceil(value.length / LargeSecureStore.CHUNK);
    await SecureStore.setItemAsync(`${key}#n`, String(n));
    for (let i = 0; i < n; i++) {
      await SecureStore.setItemAsync(
        `${key}#${i}`,
        value.slice(i * LargeSecureStore.CHUNK, (i + 1) * LargeSecureStore.CHUNK),
      );
    }
  }

  async getItem(key) {
    const raw = await SecureStore.getItemAsync(`${key}#n`);
    if (!raw) return null;
    const n = parseInt(raw, 10);
    let out = '';
    for (let i = 0; i < n; i++) {
      const chunk = await SecureStore.getItemAsync(`${key}#${i}`);
      if (chunk === null) return null;
      out += chunk;
    }
    return out;
  }

  async removeItem(key) {
    const raw = await SecureStore.getItemAsync(`${key}#n`);
    if (!raw) return;
    const n = parseInt(raw, 10);
    await SecureStore.deleteItemAsync(`${key}#n`);
    for (let i = 0; i < n; i++) {
      await SecureStore.deleteItemAsync(`${key}#${i}`);
    }
  }
}

export const supabase =
  SUPABASE_URL && SUPABASE_ANON_KEY
    ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: {
          storage: new LargeSecureStore(),
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: false,
        },
      })
    : null;
