import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import DailyIframe from '@daily-co/daily-js';
import { supabase } from '../lib/supabase';
import { rooms as roomsApi } from '../lib/api';
import { CONSULTATION_MODES, normalizeSessionMode } from '../lib/consultationModes';

/** Create or fetch a Daily room via the secure server endpoint (key stays server-side). */
async function makeRoom(appointmentId) {
  try {
    const res = await roomsApi.create(appointmentId);
    return res.room ?? null;
  } catch {
    return null;
  }
}

async function fetchAppointmentByRouteId(client, routeId) {
  if (!client || !routeId) return { data: null };
  let { data, error } = await client
    .from('appointments')
    .select('*')
    .eq('appointment_id', routeId)
    .maybeSingle();
  if (error) console.error('[consultation]', error);
  if (data) return { data };
  ({ data, error } = await client
    .from('appointments')
    .select('*')
    .eq('id', routeId)
    .maybeSingle());
  if (error) console.error('[consultation]', error);
  return { data };
}

export default function ConsultationPage() {
  const { appointmentId: routeAppointmentId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const callRef = useRef(null);
  const chatEndRef = useRef(null);

  const [userName, setUserName] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [joined, setJoined] = useState(false);
  const [roomUrl, setRoomUrl] = useState('');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [callState, setCallState] = useState('idle');

  /** From booking row (`video` | `audio` | `chat`) */
  const [sessionMode, setSessionMode] = useState(() => normalizeSessionMode('video'));
  /** Stable key for chat_messages + realtime filter */
  const [threadKey, setThreadKey] = useState(routeAppointmentId ?? '');

  const modeMeta = useMemo(
    () => CONSULTATION_MODES.find((m) => m.id === sessionMode) ?? CONSULTATION_MODES[0],
    [sessionMode],
  );

  const needsDailyCall = sessionMode === 'video' || sessionMode === 'audio';

  // Load appointment + room (Daily only for video / audio)
  useEffect(() => {
    async function setupRoom() {
      setLoading(true);
      setError(null);
      try {
        if (!supabase) {
          const qp = normalizeSessionMode(searchParams.get('mode'));
          const m = qp || 'video';
          setSessionMode(m);
          setThreadKey(routeAppointmentId ?? '');
          if (m === 'chat') {
            setRoomUrl('');
            setLoading(false);
            return;
          }
          const room = await makeRoom(routeAppointmentId);
          if (room?.url) setRoomUrl(room.url);
          else setError('Video sessions are not available yet — the team is setting them up. Please use chat or contact us on WhatsApp.');
          setLoading(false);
          return;
        }

        const { data: appt } = await fetchAppointmentByRouteId(supabase, routeAppointmentId);
        const modeFromQuery = normalizeSessionMode(searchParams.get('mode'));
        const modeFromRow = normalizeSessionMode(appt?.mode);
        const effectiveMode = appt ? modeFromRow : modeFromQuery;
        setSessionMode(effectiveMode);

        const key = appt?.appointment_id || appt?.id || routeAppointmentId;
        setThreadKey(key || routeAppointmentId || '');

        if (effectiveMode === 'chat') {
          setRoomUrl('');
          setLoading(false);
          return;
        }

        if (appt?.daily_room_url) {
          setRoomUrl(appt.daily_room_url);
        } else {
          const roomKey = appt?.appointment_id || routeAppointmentId;
          const room = await makeRoom(roomKey);
          if (room?.url) {
            setRoomUrl(room.url);
            if (appt?.id) {
              await supabase.from('appointments').upsert({
                id: appt.id,
                appointment_id: appt.appointment_id,
                patient_name: appt.patient_name || 'Patient',
                daily_room_name: room.name,
                daily_room_url: room.url,
              }, { onConflict: 'id' });
            }
          } else {
            setError('Video sessions are not available yet — the team is setting them up. Please use chat or contact us on WhatsApp.');
          }
        }
      } catch (e) {
        setError('Failed to load consultation room.');
      }
      setLoading(false);
    }
    if (routeAppointmentId) setupRoom();
  }, [routeAppointmentId, searchParams]);

  useEffect(() => {
    return () => {
      try {
        callRef.current?.destroy?.();
      } finally {
        callRef.current = null;
      }
    };
  }, []);

  // Load chat messages + subscribe (runs for all modes once joined)
  useEffect(() => {
    if (!threadKey || !joined || !supabase) return;

    async function fetchMessages() {
      const { data } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('appointment_id', threadKey)
        .order('created_at', { ascending: true });
      if (data) setMessages(data);
    }
    fetchMessages();

    const channel = supabase
      .channel(`chat-${threadKey}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages',
        filter: `appointment_id=eq.${threadKey}`,
      }, (payload) => {
        setMessages((prev) => [...prev, payload.new]);
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [threadKey, joined]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Stores the name chosen in the lobby so the Daily effect can read it
  // synchronously without depending on a state value that may not have
  // propagated yet when the effect first fires.
  const pendingNameRef = useRef('');

  const joinSession = useCallback(() => {
    const name = nameInput.trim();
    if (!name) return;
    if (needsDailyCall && !roomUrl) return;

    pendingNameRef.current = name;
    setUserName(name);

    if (!needsDailyCall) {
      setJoined(true);
      setCallState('joined');
      return;
    }

    // For video/audio: just set joined=true. The useEffect below starts the
    // Daily call once the video container is in the DOM (after the re-render).
    setJoined(true);
    setCallState('joining');
  }, [needsDailyCall, roomUrl, nameInput]);

  // Start the Daily call after the video wrapper div has mounted.
  useEffect(() => {
    if (!joined || !needsDailyCall || !roomUrl || callRef.current) return;

    const name = pendingNameRef.current || userName;
    if (!name || !videoRef.current) return;

    let call;
    async function startCall() {
      try {
        call = DailyIframe.createFrame(videoRef.current, {
          showLeaveButton: true,
          showFullscreenButton: true,
          iframeStyle: { width: '100%', height: '100%', border: 'none', borderRadius: '12px' },
        });
        callRef.current = call;

        call.on('joined-meeting', () => setCallState('joined'));
        call.on('left-meeting', () => {
          try { call.destroy?.(); } finally { callRef.current = null; }
          setCallState('idle');
          navigate('/');
        });
        call.on('error', () => setCallState('error'));

        await call.join({
          url: roomUrl,
          userName: name,
          startVideoOff: sessionMode === 'audio',
        });
      } catch {
        try { callRef.current?.destroy?.(); } finally { callRef.current = null; }
        setCallState('error');
        setJoined(false);
      }
    }

    startCall();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [joined, needsDailyCall, roomUrl]);

  const joinBlockedHint = useMemo(() => {
    if (!nameInput.trim()) return null;
    if (sessionMode === 'chat') {
      if (!supabase) return 'Chat needs the app database to be configured.';
      return null;
    }
    if (!roomUrl) return 'Session link is still loading or the room failed to open. Refresh and try again.';
    return null;
  }, [nameInput, sessionMode, roomUrl]);

  const leaveSession = () => {
    callRef.current?.leave();
    if (!needsDailyCall) navigate('/');
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !userName || !supabase) return;
    await supabase.from('chat_messages').insert({
      appointment_id: threadKey,
      sender_name: userName,
      sender_role: 'participant',
      message: newMessage.trim(),
    });
    setNewMessage('');
  };

  const lobbyHint = sessionMode === 'chat'
    ? 'This is a text-only session — no microphone or camera.'
    : modeMeta.hint;

  const joinLabel = sessionMode === 'chat'
    ? 'Join chat session'
    : sessionMode === 'audio'
      ? 'Join voice call'
      : 'Join video call';

  const canJoinLobby = sessionMode === 'chat'
    ? Boolean(nameInput.trim() && threadKey && supabase)
    : Boolean(nameInput.trim() && roomUrl && threadKey);

  if (!threadKey && !loading) {
    return (
      <div style={styles.center}>
        <p style={{ color: 'red' }}>Missing consultation link.</p>
        <button type="button" onClick={() => navigate('/')} style={styles.btn}>Go Home</button>
      </div>
    );
  }

  if (loading) return (
    <div style={styles.center}>
      <div className="spinner" />
      <p>Setting up your consultation room...</p>
    </div>
  );

  if (error) return (
    <div style={styles.center}>
      <p style={{ color: 'red' }}>{error}</p>
      <button type="button" onClick={() => navigate('/')} style={styles.btn}>Go Home</button>
    </div>
  );

  if (!joined) return (
    <div style={styles.center}>
      <div style={styles.joinCard}>
        <div style={{ fontSize: '1.85rem', lineHeight: 1, marginBottom: 12 }} aria-hidden>{modeMeta.icon}</div>
        <h2 style={{ marginBottom: 8 }}>Join session</h2>
        <p style={{ marginBottom: 6, fontWeight: 700, color: '#334155' }}>
          {modeMeta.label}{' '}consultation
        </p>
        <p style={{ color: '#64748b', marginBottom: 20, fontSize: 14, lineHeight: 1.5 }}>{lobbyHint}</p>
        <p style={{ color: '#666', marginBottom: 16, fontSize: 13 }}>
          Reference:{' '}
          <strong>{threadKey}</strong>
        </p>
        <label htmlFor="consult-name" className="sr-only">Your name</label>
        <input
          id="consult-name"
          style={styles.input}
          placeholder="Your name"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && canJoinLobby && joinSession()}
        />
        {joinBlockedHint && nameInput.trim() && (
          <p style={{ color: '#b45309', fontSize: 13, margin: 0 }}>{joinBlockedHint}</p>
        )}
        <button style={styles.btn} type="button" onClick={joinSession} disabled={!canJoinLobby}>
          {joinLabel}
        </button>
      </div>
    </div>
  );

  const isChatPrimary = sessionMode === 'chat';

  return (
    <div style={isChatPrimary ? styles.consultRoomChat : styles.consultRoom}>
      {!isChatPrimary && (
        <div style={styles.videoSection}>
          <div style={{
            ...styles.videoWrapper,
            ...(sessionMode === 'audio' ? styles.audioSessionBanner : {}),
          }} ref={videoRef}
          >
            {sessionMode === 'audio' && callState === 'joining' && (
              <div style={styles.audioPlaceholder}>Connecting voice session…</div>
            )}
          </div>
          {callState === 'joined' && (
            <button type="button" style={styles.leaveBtn} onClick={leaveSession}>Leave session</button>
          )}
        </div>
      )}

      <div style={isChatPrimary ? styles.chatSectionFull : styles.chatSection}>
        <div style={styles.chatHeader}>
          <span>{isChatPrimary ? 'Consultation chat' : 'Session chat'}</span>
          <span style={{ fontSize: 12, color: '#888' }}>
            Mode:{' '}{modeMeta.label} ·{' '}{threadKey}
          </span>
          <Link to={`/consultation/${threadKey}/prescription`} style={{ fontSize: 12, color: '#4f46e5', fontWeight: 600 }}>
            📋 View prescription
          </Link>
        </div>
        <div style={styles.chatMessages}>
          {messages.length === 0 && (
            <p style={{ color: '#aaa', textAlign: 'center', marginTop: 40 }}>
              No messages yet — say hello below.
            </p>
          )}
          {messages.map((msg) => (
            <div key={msg.id} style={{
              ...styles.msgBubble,
              alignSelf: msg.sender_name === userName ? 'flex-end' : 'flex-start',
              background: msg.sender_name === userName ? '#4f46e5' : '#f3f4f6',
              color: msg.sender_name === userName ? '#fff' : '#111',
            }}>
              <div style={{ fontSize: 11, marginBottom: 3, opacity: 0.7 }}>{msg.sender_name}</div>
              <div>{msg.message}</div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
        <form onSubmit={sendMessage} style={styles.chatInputRow}>
          <input
            style={styles.chatInput}
            placeholder={supabase ? 'Type a message…' : 'Connect database to enable chat'}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={!supabase}
          />
          <button type="submit" style={styles.sendBtn} disabled={!supabase}>Send</button>
        </form>
      </div>

      {isChatPrimary && callState === 'joined' && (
        <footer style={styles.chatOnlyFooter}>
          <button type="button" style={styles.leaveBtnFlat} onClick={() => navigate('/')}>
            End session & leave
          </button>
        </footer>
      )}
    </div>
  );
}

const styles = {
  center: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: 20 },
  joinCard: { background: '#fff', borderRadius: 16, padding: 40, boxShadow: '0 4px 24px rgba(0,0,0,0.1)', maxWidth: 420, width: '100%', display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'stretch' },
  input: { padding: '12px 16px', borderRadius: 8, border: '1px solid #ddd', fontSize: 16, outline: 'none' },
  btn: { background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 24px', fontSize: 16, cursor: 'pointer' },
  consultRoom: { display: 'flex', height: '100vh', background: '#0f172a' },
  consultRoomChat: { display: 'flex', flexDirection: 'column', height: '100vh', background: '#0f172a' },
  videoSection: { flex: 1, position: 'relative', padding: 12, minWidth: 0 },
  videoWrapper: { width: '100%', height: 'calc(100vh - 24px)', borderRadius: 12, overflow: 'hidden', background: '#1e293b', position: 'relative' },
  audioSessionBanner: { minHeight: 200 },
  audioPlaceholder: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 24,
    textAlign: 'center',
    color: '#e2e8f0',
    fontSize: 14,
    lineHeight: 1.45,
    background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
    zIndex: 0,
  },
  leaveBtn: { position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)', background: '#ef4444', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', cursor: 'pointer', fontSize: 15, zIndex: 2 },
  leaveBtnFlat: { background: '#ef4444', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', cursor: 'pointer', fontSize: 15 },
  chatSection: { width: 320, flexShrink: 0, background: '#fff', display: 'flex', flexDirection: 'column', borderLeft: '1px solid #e2e8f0' },
  chatSectionFull: { flex: 1, minHeight: 0, width: '100%', maxWidth: 720, margin: '0 auto', background: '#fff', display: 'flex', flexDirection: 'column', borderRadius: 0 },
  chatHeader: { padding: '16px 20px', borderBottom: '1px solid #e2e8f0', fontWeight: 600, display: 'flex', flexDirection: 'column', gap: 4 },
  chatMessages: { flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 10 },
  msgBubble: { maxWidth: '80%', padding: '8px 12px', borderRadius: 12, fontSize: 14, lineHeight: 1.5 },
  chatInputRow: { padding: 12, borderTop: '1px solid #e2e8f0', display: 'flex', gap: 8 },
  chatInput: { flex: 1, padding: '8px 12px', borderRadius: 8, border: '1px solid #ddd', fontSize: 14, outline: 'none' },
  sendBtn: { background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', cursor: 'pointer', fontSize: 14 },
  chatOnlyFooter: { padding: '12px 16px 20px', display: 'flex', justifyContent: 'center', background: '#0f172a' },
};
