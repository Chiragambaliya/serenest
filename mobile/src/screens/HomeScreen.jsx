import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking, SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../lib/useAuth';

const BRAND = '#3c4a2c';
const BRAND_LIGHT = '#f4f6f0';

const PILLARS = [
  { title: 'Private by design', body: 'Encrypted sessions and careful handling of your health information.' },
  { title: 'Verified clinicians', body: 'Psychiatrists and psychologists reviewed before they join Serenest.' },
  { title: 'Continuity of care', body: 'Notes, follow-ups, and re-booking stay connected after your first visit.' },
];

export default function HomeScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();

  const isPatient = user?.user_metadata?.role === 'patient';
  const firstName = isPatient
    ? (user.user_metadata?.full_name || user.user_metadata?.name || '').split(' ')[0]
    : '';

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>Serenest</Text>
            <Text style={styles.tagline}>Mind care, simplified</Text>
          </View>
          {!user && (
            <TouchableOpacity onPress={() => navigation.navigate('Auth', { mode: 'login' })} style={styles.signInChip}>
              <Text style={styles.signInChipText}>Sign in</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>Pan-India telepsychiatry</Text>
          <Text style={styles.heroTitle}>
            Private, clinical mental health care — wherever you are.
          </Text>
          <Text style={styles.heroBody}>
            Speak with verified psychiatrists and psychologists from home. Structured intake,
            evidence-based screening, and care that continues beyond a single session.
          </Text>
          <TouchableOpacity style={styles.primaryBtn} onPress={() => navigation.navigate('Book')}>
            <Text style={styles.primaryBtnText}>Book now</Text>
          </TouchableOpacity>
        </View>

        {/* Patient portal strip */}
        <View style={styles.portalCard}>
          <Text style={styles.sectionEyebrow}>Patient portal</Text>
          <Text style={styles.portalTitle}>Your care, all in one place</Text>
          <Text style={styles.portalBody}>
            {isPatient && firstName
              ? `Welcome back, ${firstName}. View and manage your appointments.`
              : 'Track appointments, access prescriptions, and manage your mental health journey.'}
          </Text>
          {isPatient ? (
            <TouchableOpacity
              style={styles.secondaryBtn}
              onPress={() => navigation.navigate('Portal')}
            >
              <Text style={styles.secondaryBtnText}>View my bookings</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.portalBtns}>
              <TouchableOpacity
                style={[styles.primaryBtn, { flex: 1 }]}
                onPress={() => navigation.navigate('Auth', { mode: 'signup' })}
              >
                <Text style={styles.primaryBtnText}>Create account</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.secondaryBtn, { flex: 1 }]}
                onPress={() => navigation.navigate('Auth', { mode: 'login' })}
              >
                <Text style={styles.secondaryBtnText}>Sign in</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Pillars */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Why Serenest</Text>
          {PILLARS.map((p) => (
            <View key={p.title} style={styles.pillar}>
              <Text style={styles.pillarTitle}>{p.title}</Text>
              <Text style={styles.pillarBody}>{p.body}</Text>
            </View>
          ))}
        </View>

        {/* Formats strip */}
        <View style={styles.strip}>
          {['Video consultations', 'Audio sessions', 'Secure chat', 'Pan-India access'].map((t) => (
            <View key={t} style={styles.stripChip}>
              <Text style={styles.stripChipText}>{t}</Text>
            </View>
          ))}
        </View>

        {/* Contact */}
        <View style={styles.contactSection}>
          <Text style={styles.sectionTitle}>Ready when you are</Text>
          <TouchableOpacity onPress={() => Linking.openURL('mailto:support@serenest.in')} style={styles.contactRow}>
            <Text style={styles.contactLink}>✉ support@serenest.in</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL('tel:7777936367')} style={styles.contactRow}>
            <Text style={styles.contactLink}>📞 7777936367</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => Linking.openURL('https://wa.me/917777936367?text=Hi%2C%20I%27d%20like%20to%20book%20a%20session%20with%20Serenest')}
            style={styles.waBtn}
          >
            <Text style={styles.waBtnText}>💬 WhatsApp us</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.legalNote}>
          Not for emergencies. If you or someone else is at immediate risk, contact local emergency services or a crisis helpline.
        </Text>
        <View style={{ height: 28 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 18, paddingTop: 14, borderBottomWidth: 1, borderBottomColor: '#eee',
  },
  brand: { fontSize: 22, fontWeight: '800', color: BRAND },
  tagline: { fontSize: 11, color: '#999', marginTop: 1 },
  signInChip: { borderWidth: 1.5, borderColor: BRAND, borderRadius: 20, paddingVertical: 6, paddingHorizontal: 14 },
  signInChipText: { color: BRAND, fontWeight: '700', fontSize: 13 },

  hero: { backgroundColor: BRAND_LIGHT, margin: 16, borderRadius: 18, padding: 22 },
  eyebrow: { fontSize: 10, fontWeight: '800', letterSpacing: 1, color: BRAND, textTransform: 'uppercase', marginBottom: 10 },
  heroTitle: { fontSize: 22, fontWeight: '800', color: '#1a1a1a', lineHeight: 30, marginBottom: 10 },
  heroBody: { fontSize: 14, color: '#555', lineHeight: 21, marginBottom: 20 },

  primaryBtn: { backgroundColor: BRAND, paddingVertical: 14, paddingHorizontal: 20, borderRadius: 12, alignItems: 'center' },
  primaryBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  secondaryBtn: { borderWidth: 1.5, borderColor: BRAND, paddingVertical: 14, paddingHorizontal: 20, borderRadius: 12, alignItems: 'center' },
  secondaryBtnText: { color: BRAND, fontWeight: '700', fontSize: 15 },

  portalCard: { margin: 16, padding: 20, backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#e5e7eb', borderRadius: 16 },
  sectionEyebrow: { fontSize: 10, fontWeight: '800', letterSpacing: 1, color: BRAND, textTransform: 'uppercase', marginBottom: 6 },
  portalTitle: { fontSize: 18, fontWeight: '800', color: '#1a1a1a', marginBottom: 8 },
  portalBody: { fontSize: 14, color: '#666', lineHeight: 20, marginBottom: 16 },
  portalBtns: { flexDirection: 'row', gap: 10 },

  section: { paddingHorizontal: 16, paddingBottom: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#1a1a1a', marginBottom: 14, marginTop: 4 },
  pillar: { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  pillarTitle: { fontSize: 15, fontWeight: '700', color: '#1a1a1a', marginBottom: 4 },
  pillarBody: { fontSize: 13, color: '#666', lineHeight: 18 },

  strip: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, padding: 16, paddingTop: 20 },
  stripChip: { backgroundColor: BRAND_LIGHT, borderRadius: 99, paddingVertical: 6, paddingHorizontal: 14 },
  stripChipText: { fontSize: 12, color: BRAND, fontWeight: '600' },

  contactSection: { padding: 16, paddingTop: 8 },
  contactRow: { paddingVertical: 8 },
  contactLink: { fontSize: 14, color: BRAND, fontWeight: '600' },
  waBtn: { marginTop: 10, backgroundColor: '#25D366', borderRadius: 12, paddingVertical: 13, alignItems: 'center' },
  waBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },

  legalNote: { fontSize: 11, color: '#bbb', textAlign: 'center', paddingHorizontal: 24, lineHeight: 16 },
});
