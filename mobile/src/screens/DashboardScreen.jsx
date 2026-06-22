import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  SafeAreaView, RefreshControl, ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth, signOut } from '../lib/useAuth';
import { patientBookings } from '../lib/api';

const BRAND = '#3c4a2c';
const BRAND_LIGHT = '#f4f6f0';

const STATUS_COLORS = {
  pending:   { bg: '#fff3cd', text: '#856404' },
  confirmed: { bg: '#d1e7dd', text: '#0a3622' },
  completed: { bg: '#cce5ff', text: '#004085' },
  cancelled: { bg: '#f8d7da', text: '#721c24' },
};

function fmtDate(str) {
  if (!str) return '—';
  return new Date(str).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function MetaCell({ label, value }) {
  return (
    <View style={styles.metaCell}>
      <Text style={styles.metaLabel}>{label}</Text>
      <Text style={styles.metaValue}>{value || '—'}</Text>
    </View>
  );
}

export default function DashboardScreen() {
  const navigation = useNavigation();
  const { user, loading: authLoading } = useAuth();

  const [appts, setAppts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const isPatient = user?.user_metadata?.role === 'patient';
  const displayName = user
    ? (user.user_metadata?.full_name || user.user_metadata?.name || user.email || '')
    : '';
  const firstName = displayName.includes('@') ? displayName : displayName.split(' ')[0];

  const fetchBookings = useCallback(async () => {
    if (!user) return;
    setError('');
    try {
      const json = await patientBookings.list();
      setAppts(json.bookings ?? []);
    } catch (e) {
      setError(e.message || 'Could not load your bookings. Please try again.');
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    fetchBookings().finally(() => setLoading(false));
  }, [user, fetchBookings]);

  async function handleRefresh() {
    setRefreshing(true);
    await fetchBookings();
    setRefreshing(false);
  }

  async function handleSignOut() {
    await signOut();
  }

  if (authLoading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={BRAND} />
        </View>
      </SafeAreaView>
    );
  }

  // Not signed in — show portal prompt
  if (!user) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.promptEyebrow}>Patient portal</Text>
          <Text style={styles.promptTitle}>Your care, all in one place</Text>
          <Text style={styles.promptBody}>
            Sign in or create a free account to view your appointments, prescriptions, and care history.
          </Text>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => navigation.navigate('Auth', { mode: 'signup' })}
          >
            <Text style={styles.primaryBtnText}>Create free account</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.secondaryBtn, { marginTop: 12 }]}
            onPress={() => navigation.navigate('Auth', { mode: 'login' })}
          >
            <Text style={styles.secondaryBtnText}>Sign in</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ marginTop: 20 }}
            onPress={() => navigation.navigate('Book')}
          >
            <Text style={styles.guestLink}>Book without an account →</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={BRAND} />
        }
      >
        {/* Page header */}
        <View style={styles.pageHead}>
          <View style={{ flex: 1 }}>
            <Text style={styles.kicker}>Patient portal</Text>
            <Text style={styles.pageTitle}>Hello, {firstName}</Text>
            <Text style={styles.pageSub}>{user.email}</Text>
          </View>
          <TouchableOpacity onPress={handleSignOut} style={styles.signOutBtn}>
            <Text style={styles.signOutText}>Sign out</Text>
          </TouchableOpacity>
        </View>

        {/* Quick action */}
        <View style={styles.quickRow}>
          <TouchableOpacity
            style={[styles.primaryBtn, { flex: 1 }]}
            onPress={() => navigation.navigate('Book')}
          >
            <Text style={styles.primaryBtnText}>+ Book appointment</Text>
          </TouchableOpacity>
        </View>

        {/* Appointments heading */}
        <Text style={styles.sectionHead}>
          Your appointments{!loading ? ` (${appts.length})` : ''}
        </Text>

        {loading && (
          <View style={{ paddingVertical: 40, alignItems: 'center' }}>
            <ActivityIndicator size="large" color={BRAND} />
          </View>
        )}

        {!!error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={() => { setLoading(true); fetchBookings().finally(() => setLoading(false)); }}>
              <Text style={[styles.errorText, { fontWeight: '700', marginTop: 8 }]}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {!loading && !error && appts.length === 0 && (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyIcon}>📅</Text>
            <Text style={styles.emptyTitle}>No appointments yet</Text>
            <Text style={styles.emptyBody}>
              If you booked before signing up, make sure the email or phone number you used matches this account.
            </Text>
            <TouchableOpacity
              style={[styles.primaryBtn, { marginTop: 20, alignSelf: 'stretch' }]}
              onPress={() => navigation.navigate('Book')}
            >
              <Text style={styles.primaryBtnText}>Book your first appointment</Text>
            </TouchableOpacity>
          </View>
        )}

        {!loading && appts.map((b) => {
          const sc = STATUS_COLORS[b.status] ?? { bg: '#e9ecef', text: '#495057' };
          return (
            <View key={b.id} style={styles.card}>
              <View style={styles.cardTop}>
                <View style={[styles.badge, { backgroundColor: sc.bg }]}>
                  <Text style={[styles.badgeText, { color: sc.text }]}>{b.status}</Text>
                </View>
                {b.payment_status === 'paid' && (
                  <View style={styles.paidBadge}>
                    <Text style={styles.paidBadgeText}>✓ Paid{b.amount_paid ? ` ₹${b.amount_paid}` : ''}</Text>
                  </View>
                )}
                <Text style={styles.cardBooked}>Booked {fmtDate(b.created_at)}</Text>
              </View>

              <View style={styles.metaGrid}>
                <MetaCell label="Practitioner" value={b.practitioner_type} />
                <MetaCell label="Mode" value={b.mode} />
                <MetaCell label="Date" value={fmtDate(b.preferred_date)} />
                <MetaCell label="Time" value={b.preferred_time} />
              </View>

              {!!b.notes && (
                <Text style={styles.cardNotes}>"{b.notes}"</Text>
              )}

              {b.status === 'pending' && (
                <Text style={styles.pendingNote}>Awaiting confirmation from our team</Text>
              )}
            </View>
          );
        })}

        {/* Help footer */}
        <View style={styles.helpFooter}>
          <Text style={styles.helpText}>Need help? </Text>
          <Text style={styles.helpLink}>support@serenest.in</Text>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f8f9f4' },
  scroll: { flex: 1 },

  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  promptEyebrow: { fontSize: 10, fontWeight: '800', letterSpacing: 1, color: BRAND, textTransform: 'uppercase', marginBottom: 12 },
  promptTitle: { fontSize: 24, fontWeight: '800', color: '#1a1a1a', textAlign: 'center', marginBottom: 12 },
  promptBody: { fontSize: 14, color: '#666', textAlign: 'center', lineHeight: 21, marginBottom: 28, maxWidth: 300 },
  primaryBtn: { backgroundColor: BRAND, paddingVertical: 15, paddingHorizontal: 24, borderRadius: 13, alignItems: 'center' },
  primaryBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  secondaryBtn: { borderWidth: 1.5, borderColor: BRAND, paddingVertical: 15, paddingHorizontal: 24, borderRadius: 13, alignItems: 'center', width: '100%' },
  secondaryBtnText: { color: BRAND, fontWeight: '700', fontSize: 15 },
  guestLink: { color: '#aaa', fontSize: 14 },

  pageHead: {
    flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between',
    padding: 20, paddingBottom: 14, backgroundColor: '#fff',
    borderBottomWidth: 1, borderBottomColor: '#eee',
  },
  kicker: { fontSize: 10, fontWeight: '800', letterSpacing: 1, color: BRAND, textTransform: 'uppercase', marginBottom: 4 },
  pageTitle: { fontSize: 22, fontWeight: '800', color: '#1a1a1a', marginBottom: 2 },
  pageSub: { fontSize: 12, color: '#999' },
  signOutBtn: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, paddingVertical: 7, paddingHorizontal: 12, marginTop: 4 },
  signOutText: { fontSize: 12, color: '#666', fontWeight: '600' },

  quickRow: { padding: 16, paddingBottom: 0 },
  sectionHead: { fontSize: 15, fontWeight: '700', color: '#1a1a1a', paddingHorizontal: 16, marginTop: 20, marginBottom: 12 },

  errorBox: { margin: 16, backgroundColor: '#fdecea', borderRadius: 12, padding: 14 },
  errorText: { color: '#a02622', fontSize: 13 },

  emptyBox: { margin: 16, backgroundColor: '#fff', borderRadius: 16, padding: 24, alignItems: 'center' },
  emptyIcon: { fontSize: 44, marginBottom: 14 },
  emptyTitle: { fontSize: 17, fontWeight: '700', color: '#1a1a1a', marginBottom: 8 },
  emptyBody: { fontSize: 13, color: '#888', textAlign: 'center', lineHeight: 19 },

  card: {
    marginHorizontal: 16, marginBottom: 12, backgroundColor: '#fff',
    borderRadius: 16, padding: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  cardTop: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
  badge: { borderRadius: 99, paddingVertical: 3, paddingHorizontal: 10 },
  badgeText: { fontSize: 12, fontWeight: '700', textTransform: 'capitalize' },
  paidBadge: { backgroundColor: '#d1e7dd', borderRadius: 99, paddingVertical: 3, paddingHorizontal: 8 },
  paidBadgeText: { fontSize: 11, fontWeight: '700', color: '#0a3622' },
  cardBooked: { fontSize: 12, color: '#aaa', marginLeft: 'auto' },

  metaGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 4 },
  metaCell: { minWidth: '42%' },
  metaLabel: { fontSize: 10, fontWeight: '700', color: '#bbb', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 3 },
  metaValue: { fontSize: 14, fontWeight: '600', color: '#1a1a1a', textTransform: 'capitalize' },

  cardNotes: { fontSize: 13, color: '#999', fontStyle: 'italic', marginTop: 10 },
  pendingNote: { fontSize: 12, color: '#888', marginTop: 10 },

  helpFooter: { flexDirection: 'row', justifyContent: 'center', paddingTop: 8 },
  helpText: { fontSize: 12, color: '#aaa' },
  helpLink: { fontSize: 12, color: BRAND, fontWeight: '600' },
});
