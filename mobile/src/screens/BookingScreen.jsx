import React, { useState, useMemo } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, SafeAreaView, Alert, ActivityIndicator,
} from 'react-native';
import { bookings } from '../lib/api';

const BRAND = '#3c4a2c';
const BRAND_LIGHT = '#f4f6f0';

const TYPES = [
  { id: 'psychiatrist', label: 'Psychiatrist', desc: 'For medication, diagnosis, and complex conditions' },
  { id: 'psychologist', label: 'Psychologist', desc: 'For assessment, therapy, and psychological testing' },
  { id: 'therapist', label: 'Therapist', desc: 'For talk therapy and emotional support' },
  { id: 'counsellor', label: 'Counsellor', desc: 'For guidance on life challenges and stress' },
];

const MODES = [
  { id: 'video', label: '🎥 Video' },
  { id: 'audio', label: '🎙 Audio' },
  { id: 'chat', label: '💬 Chat' },
];

const TIMES = ['10:00', '11:30', '13:00', '15:30', '17:00', '19:00'];

function makeDays() {
  const days = [];
  const now = new Date();
  for (let d = 0; d < 7; d++) {
    const dt = new Date(now);
    dt.setDate(now.getDate() + d);
    days.push({
      key: dt.toISOString().slice(0, 10),
      label: dt.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short' }),
    });
  }
  return days;
}

const STEPS = ['Choose', 'Slot', 'Details'];

export default function BookingScreen() {
  const days = useMemo(() => makeDays(), []);

  const [step, setStep] = useState(1);
  const [type, setType] = useState('psychiatrist');
  const [mode, setMode] = useState('video');
  const [dayKey, setDayKey] = useState(days[0].key);
  const [time, setTime] = useState(TIMES[0]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [note, setNote] = useState('');
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState(null);

  const phoneClean = phone.replace(/[^\d]/g, '');
  const isPhoneValid = phoneClean.length === 10 && /^[6-9]/.test(phoneClean);
  const canSubmit = name.trim().length >= 2 && isPhoneValid && consent;

  async function handleSubmit() {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      const res = await bookings.create({
        patient_name: name.trim(),
        patient_phone: phoneClean,
        patient_email: email.trim() || undefined,
        practitioner_type: type,
        mode,
        preferred_date: dayKey,
        preferred_time: time,
        notes: note.trim(),
      });
      setConfirmation(res.booking);
    } catch (err) {
      Alert.alert('Booking failed', err.message || 'Could not complete your booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  function reset() {
    setStep(1); setType('psychiatrist'); setMode('video');
    setDayKey(days[0].key); setTime(TIMES[0]);
    setName(''); setPhone(''); setEmail(''); setNote('');
    setConsent(false); setConfirmation(null);
  }

  if (confirmation) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.confirmContainer}>
          <Text style={styles.confirmIcon}>✓</Text>
          <Text style={styles.confirmTitle}>Booking received!</Text>
          <Text style={styles.confirmBody}>
            We'll confirm your {confirmation.mode} session with a{' '}
            {confirmation.practitioner_type} and reach out on{' '}
            {confirmation.patient_phone}.
          </Text>
          <TouchableOpacity style={styles.primaryBtn} onPress={reset}>
            <Text style={styles.primaryBtnText}>Book another appointment</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* Step indicator */}
      <View style={styles.stepsRow}>
        {STEPS.map((label, i) => (
          <React.Fragment key={label}>
            <View style={styles.stepItem}>
              <View style={[
                styles.stepDot,
                step === i + 1 && styles.stepDotActive,
                step > i + 1 && styles.stepDotDone,
              ]}>
                <Text style={[styles.stepDotText, (step === i + 1 || step > i + 1) && styles.stepDotTextActive]}>
                  {step > i + 1 ? '✓' : i + 1}
                </Text>
              </View>
              <Text style={[styles.stepLabel, step === i + 1 && styles.stepLabelActive]}>{label}</Text>
            </View>
            {i < STEPS.length - 1 && <View style={[styles.stepLine, step > i + 1 && styles.stepLineDone]} />}
          </React.Fragment>
        ))}
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">

        {/* Step 1: Type & mode */}
        {step === 1 && (
          <>
            <Text style={styles.sectionTitle}>Who do you want to see?</Text>
            {TYPES.map((t) => (
              <TouchableOpacity
                key={t.id}
                style={[styles.typeBtn, type === t.id && styles.typeBtnActive]}
                onPress={() => setType(t.id)}
              >
                <Text style={[styles.typeBtnLabel, type === t.id && styles.typeBtnLabelActive]}>{t.label}</Text>
                <Text style={[styles.typeBtnDesc, type === t.id && styles.typeBtnDescActive]}>{t.desc}</Text>
              </TouchableOpacity>
            ))}

            <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Consultation format</Text>
            <View style={styles.modesRow}>
              {MODES.map((m) => (
                <TouchableOpacity
                  key={m.id}
                  style={[styles.modeBtn, mode === m.id && styles.modeBtnActive]}
                  onPress={() => setMode(m.id)}
                >
                  <Text style={[styles.modeBtnText, mode === m.id && styles.modeBtnTextActive]}>{m.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={[styles.primaryBtn, { marginTop: 28 }]} onPress={() => setStep(2)}>
              <Text style={styles.primaryBtnText}>Continue →</Text>
            </TouchableOpacity>
          </>
        )}

        {/* Step 2: Date & time */}
        {step === 2 && (
          <>
            <Text style={styles.sectionTitle}>Preferred date</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.daysScroll}>
              {days.map((d) => (
                <TouchableOpacity
                  key={d.key}
                  style={[styles.dayBtn, dayKey === d.key && styles.dayBtnActive]}
                  onPress={() => setDayKey(d.key)}
                >
                  <Text style={[styles.dayBtnText, dayKey === d.key && styles.dayBtnTextActive]}>{d.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Preferred time</Text>
            <View style={styles.timesGrid}>
              {TIMES.map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[styles.timeBtn, time === t && styles.timeBtnActive]}
                  onPress={() => setTime(t)}
                >
                  <Text style={[styles.timeBtnText, time === t && styles.timeBtnTextActive]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.navRow}>
              <TouchableOpacity style={styles.backBtn} onPress={() => setStep(1)}>
                <Text style={styles.backBtnText}>← Back</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.primaryBtn, styles.navNextBtn]} onPress={() => setStep(3)}>
                <Text style={styles.primaryBtnText}>Continue →</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* Step 3: Patient details */}
        {step === 3 && (
          <>
            <Text style={styles.sectionTitle}>Your details</Text>

            <Text style={styles.label}>Full name *</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Your name"
              autoCapitalize="words"
            />

            <Text style={styles.label}>Mobile number *</Text>
            <TextInput
              style={[styles.input, phone.length > 0 && !isPhoneValid && styles.inputError]}
              value={phone}
              onChangeText={setPhone}
              placeholder="10-digit Indian mobile"
              keyboardType="phone-pad"
            />
            {phone.length > 0 && !isPhoneValid && (
              <Text style={styles.fieldError}>Enter a valid 10-digit Indian mobile number</Text>
            )}

            <Text style={styles.label}>Email <Text style={styles.optional}>(optional)</Text></Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.label}>Notes <Text style={styles.optional}>(optional)</Text></Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={note}
              onChangeText={setNote}
              placeholder="Anything you'd like us to know before the session"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />

            <TouchableOpacity
              style={styles.consentRow}
              onPress={() => setConsent((v) => !v)}
              activeOpacity={0.7}
            >
              <View style={[styles.checkbox, consent && styles.checkboxChecked]}>
                {consent && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.consentText}>
                I understand this is not an emergency service and that Serenest will contact me to confirm the booking.
              </Text>
            </TouchableOpacity>

            <View style={styles.navRow}>
              <TouchableOpacity style={styles.backBtn} onPress={() => setStep(2)}>
                <Text style={styles.backBtnText}>← Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.primaryBtn, styles.navNextBtn, (!canSubmit || submitting) && styles.primaryBtnDisabled]}
                onPress={handleSubmit}
                disabled={!canSubmit || submitting}
              >
                {submitting
                  ? <ActivityIndicator color="#fff" size="small" />
                  : <Text style={styles.primaryBtnText}>Confirm booking</Text>
                }
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },

  stepsRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 14, paddingHorizontal: 24,
    borderBottomWidth: 1, borderBottomColor: '#eee',
  },
  stepItem: { alignItems: 'center', gap: 4 },
  stepDot: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: '#eee', alignItems: 'center', justifyContent: 'center',
  },
  stepDotActive: { backgroundColor: BRAND },
  stepDotDone: { backgroundColor: '#c8d8b0' },
  stepDotText: { fontSize: 13, fontWeight: '700', color: '#aaa' },
  stepDotTextActive: { color: '#fff' },
  stepLabel: { fontSize: 11, color: '#aaa' },
  stepLabelActive: { color: BRAND, fontWeight: '700' },
  stepLine: { width: 28, height: 2, backgroundColor: '#eee', marginHorizontal: 4, marginBottom: 16 },
  stepLineDone: { backgroundColor: '#c8d8b0' },

  scroll: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 48 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1a1a1a', marginBottom: 14 },

  typeBtn: {
    borderWidth: 1.5, borderColor: '#e5e7eb', borderRadius: 12,
    padding: 15, marginBottom: 10,
  },
  typeBtnActive: { borderColor: BRAND, backgroundColor: BRAND_LIGHT },
  typeBtnLabel: { fontSize: 15, fontWeight: '700', color: '#444', marginBottom: 3 },
  typeBtnLabelActive: { color: BRAND },
  typeBtnDesc: { fontSize: 12, color: '#999', lineHeight: 16 },
  typeBtnDescActive: { color: '#5a7040' },

  modesRow: { flexDirection: 'row', gap: 10 },
  modeBtn: {
    flex: 1, borderWidth: 1.5, borderColor: '#e5e7eb', borderRadius: 12,
    paddingVertical: 13, alignItems: 'center',
  },
  modeBtnActive: { borderColor: BRAND, backgroundColor: BRAND_LIGHT },
  modeBtnText: { fontSize: 14, color: '#555', fontWeight: '500' },
  modeBtnTextActive: { color: BRAND, fontWeight: '700' },

  daysScroll: { marginBottom: 4 },
  dayBtn: {
    borderWidth: 1.5, borderColor: '#e5e7eb', borderRadius: 11,
    paddingVertical: 10, paddingHorizontal: 14, marginRight: 8,
  },
  dayBtnActive: { borderColor: BRAND, backgroundColor: BRAND_LIGHT },
  dayBtnText: { fontSize: 13, color: '#555' },
  dayBtnTextActive: { color: BRAND, fontWeight: '700' },

  timesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  timeBtn: {
    borderWidth: 1.5, borderColor: '#e5e7eb', borderRadius: 11,
    paddingVertical: 10, paddingHorizontal: 20,
  },
  timeBtnActive: { borderColor: BRAND, backgroundColor: BRAND_LIGHT },
  timeBtnText: { fontSize: 14, color: '#555' },
  timeBtnTextActive: { color: BRAND, fontWeight: '700' },

  primaryBtn: { backgroundColor: BRAND, paddingVertical: 15, borderRadius: 13, alignItems: 'center' },
  primaryBtnDisabled: { opacity: 0.45 },
  primaryBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },

  navRow: { flexDirection: 'row', gap: 10, marginTop: 28 },
  backBtn: {
    borderWidth: 1.5, borderColor: '#e0e0e0', borderRadius: 13,
    paddingVertical: 15, paddingHorizontal: 18, alignItems: 'center', justifyContent: 'center',
  },
  backBtnText: { color: '#666', fontWeight: '600', fontSize: 15 },
  navNextBtn: { flex: 1 },

  label: { fontSize: 13, fontWeight: '600', color: '#444', marginBottom: 7 },
  optional: { fontWeight: '400', color: '#aaa', fontSize: 12 },
  input: {
    borderWidth: 1.5, borderColor: '#e0e0e0', borderRadius: 11,
    padding: 14, fontSize: 15, marginBottom: 16, backgroundColor: '#fafafa',
  },
  inputError: { borderColor: '#e74c3c' },
  textArea: { height: 90, paddingTop: 12 },
  fieldError: { fontSize: 12, color: '#c0392b', marginTop: -12, marginBottom: 14 },

  consentRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 8 },
  checkbox: {
    width: 22, height: 22, borderWidth: 2, borderColor: '#ccc', borderRadius: 6,
    alignItems: 'center', justifyContent: 'center', marginTop: 1, flexShrink: 0,
  },
  checkboxChecked: { backgroundColor: BRAND, borderColor: BRAND },
  checkmark: { color: '#fff', fontSize: 12, fontWeight: '800' },
  consentText: { flex: 1, fontSize: 13, color: '#666', lineHeight: 19 },

  confirmContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 36 },
  confirmIcon: { fontSize: 60, color: BRAND, marginBottom: 20 },
  confirmTitle: { fontSize: 26, fontWeight: '800', color: '#1a1a1a', marginBottom: 14, textAlign: 'center' },
  confirmBody: { fontSize: 15, color: '#666', textAlign: 'center', lineHeight: 23, marginBottom: 36 },
});
