import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, SafeAreaView, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { supabase } from '../lib/supabase';

const BRAND = '#3c4a2c';

export default function AuthScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const initialMode = route.params?.mode ?? 'login';

  const [mode, setMode] = useState(initialMode);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const isSignup = mode === 'signup';
  const phoneClean = phone.replace(/[^\d]/g, '');

  function switchMode(next) {
    setMode(next);
    setError('');
  }

  async function handleSubmit() {
    setError('');
    if (!supabase) { setError('Auth not available right now. Please try again later.'); return; }
    if (isSignup && fullName.trim().length < 2) { setError('Please enter your full name.'); return; }
    if (isSignup && phone && !(phoneClean.length === 10 && /^[6-9]/.test(phoneClean))) {
      setError('Enter a valid 10-digit Indian mobile number.');
      return;
    }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }

    setBusy(true);
    try {
      if (isSignup) {
        const { data, error: e1 } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              full_name: fullName.trim(),
              name: fullName.trim(),
              phone: phoneClean || undefined,
              role: 'patient',
            },
          },
        });
        if (e1) throw e1;
        if (data.session) {
          navigation.goBack();
        } else {
          Alert.alert(
            'Check your email',
            'Account created! Please confirm your email address, then log in.',
            [{ text: 'OK', onPress: () => switchMode('login') }],
          );
        }
      } else {
        const { error: e2 } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (e2) throw e2;
        navigation.goBack();
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

          <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.closeBtnText}>✕</Text>
          </TouchableOpacity>

          <Text style={styles.eyebrow}>Patient portal</Text>
          <Text style={styles.title}>{isSignup ? 'Create your account' : 'Welcome back'}</Text>
          <Text style={styles.subtitle}>
            {isSignup
              ? 'Sign up to track your appointments and view prescriptions.'
              : 'Log in to view your bookings and health records.'}
          </Text>

          {/* Mode toggle */}
          <View style={styles.toggleRow}>
            <TouchableOpacity
              style={[styles.toggleBtn, mode === 'login' && styles.toggleBtnActive]}
              onPress={() => switchMode('login')}
            >
              <Text style={[styles.toggleBtnText, mode === 'login' && styles.toggleBtnTextActive]}>Log in</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleBtn, mode === 'signup' && styles.toggleBtnActive]}
              onPress={() => switchMode('signup')}
            >
              <Text style={[styles.toggleBtnText, mode === 'signup' && styles.toggleBtnTextActive]}>Sign up</Text>
            </TouchableOpacity>
          </View>

          {/* Signup-only fields */}
          {isSignup && (
            <>
              <Text style={styles.label}>Full name *</Text>
              <TextInput
                style={styles.input}
                value={fullName}
                onChangeText={setFullName}
                placeholder="Your full name"
                autoCapitalize="words"
                autoComplete="name"
              />
              <Text style={styles.label}>Mobile number <Text style={styles.optional}>(optional — helps match past bookings)</Text></Text>
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="10-digit Indian mobile"
                keyboardType="phone-pad"
                autoComplete="tel"
              />
            </>
          )}

          <Text style={styles.label}>Email *</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />

          <Text style={styles.label}>Password *</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="At least 6 characters"
            secureTextEntry
            autoComplete={isSignup ? 'new-password' : 'current-password'}
          />

          {!!error && <View style={styles.errorBox}><Text style={styles.errorText}>{error}</Text></View>}

          <TouchableOpacity
            style={[styles.submitBtn, busy && styles.submitBtnDisabled]}
            onPress={handleSubmit}
            disabled={busy}
          >
            <Text style={styles.submitBtnText}>
              {busy ? 'Please wait…' : isSignup ? 'Create account' : 'Log in'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.guestLink}>
            <Text style={styles.guestLinkText}>Book without an account →</Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  scroll: { padding: 24, paddingTop: 12 },
  closeBtn: { alignSelf: 'flex-end', padding: 8, marginBottom: 4 },
  closeBtnText: { fontSize: 18, color: '#888' },
  eyebrow: { fontSize: 10, fontWeight: '800', letterSpacing: 1, color: BRAND, textTransform: 'uppercase', marginBottom: 8 },
  title: { fontSize: 26, fontWeight: '800', color: '#1a1a1a', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#666', lineHeight: 20, marginBottom: 22 },

  toggleRow: {
    flexDirection: 'row', backgroundColor: '#f4f6f0', borderRadius: 12,
    padding: 4, marginBottom: 24,
  },
  toggleBtn: { flex: 1, paddingVertical: 11, borderRadius: 9, alignItems: 'center' },
  toggleBtnActive: {
    backgroundColor: '#fff',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08, shadowRadius: 3, elevation: 2,
  },
  toggleBtnText: { fontSize: 14, fontWeight: '600', color: '#999' },
  toggleBtnTextActive: { color: BRAND },

  label: { fontSize: 13, fontWeight: '600', color: '#444', marginBottom: 7 },
  optional: { fontWeight: '400', color: '#999', fontSize: 12 },
  input: {
    borderWidth: 1.5, borderColor: '#e0e0e0', borderRadius: 11,
    padding: 14, fontSize: 15, marginBottom: 16, backgroundColor: '#fafafa',
  },

  errorBox: { backgroundColor: '#fdecea', borderRadius: 10, padding: 12, marginBottom: 14 },
  errorText: { color: '#a02622', fontSize: 13, lineHeight: 18 },

  submitBtn: { backgroundColor: BRAND, paddingVertical: 16, borderRadius: 13, alignItems: 'center', marginTop: 4 },
  submitBtnDisabled: { opacity: 0.65 },
  submitBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },

  guestLink: { marginTop: 18, alignItems: 'center', paddingBottom: 8 },
  guestLinkText: { color: '#aaa', fontSize: 14 },
});
