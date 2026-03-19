import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DailyIframe from '@daily-co/daily-js';
import { supabase } from '../lib/supabase';
import { createDailyRoom } from '../lib/daily';

export default function ConsultationPage() {
  const { appointmentId } = useParams();
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

  // Load or create room
  useEffect(() => {
    async function setupRoom() {
      setLoading(true);
      try {
        // Check if appointment already has a room
        const { data: appt } = await supabase
          .from('appointments')
          .select('*')
          .eq('appointment_id', appointmentId)
          .single();

        if (appt?.daily_room_url) {
          setRoomUrl(appt.daily_room_url);
        } else {
          // Create new Daily room
          const room = await createDailyRoom(appointmentId);
          if (room?.url) {
            setRoomUrl(room.url);
            // Save to appointments table
            await supabase.from('appointments').upsert({
              appointment_id: appointmentId,
              patient_name: 'Patient',
              daily_room_name: room.name,
              daily_room_url: room.url,
            }, { onConflict: 'appointment_id' });
          } else {
            setError('Could not create video room. Please check your Daily.co API key.');
          }
        }
      } catch (e) {
        setError('Failed to load consultation room.');
      }
      setLoading(false);
    }
    if (appointmentId) setupRoom();
  }, [appointmentId]);

  // Load chat messages + subscribe to realtime
  useEffect(() => {
    if (!appointmentId || !joined) return;
    const fetchMessages = async () => {
      const { data } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('appointment_id', appointmentId)
        .order('created_at', { ascending: true });
      if (data) setMessages(data);
    };
    fetchMessages();

    const channel = supabase
      .channel(`chat-${appointmentId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages',
        filter: `appointment_id=eq.${appointmentId}`,
      }, (payload) => {
        setMessages((prev) => [...prev, payload.new]);
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [appointmentId, joined]);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const joinCall = useCallback(async () => {
    if (!roomUrl || !nameInput.trim()) return;
    setUserName(nameInput.trim());
    setJoined(true);
    setCallState('joining');

    const call = DailyIframe.createFrame(videoRef.current, {
      showLeaveButton: true,
      showFullscreenButton: true,
      iframeStyle: { width: '100%', height: '100%', border: 'none', borderRadius: '12px' },
    });
    callRef.current = call;

    call.on('joined-meeting', () => setCallState('joined'));
    call.on('left-meeting', () => { setCallState('idle'); navigate('/'); });
    call.on('error', () => setCallState('error'));

    await call.join({ url: roomUrl, userName: nameInput.trim() });
  }, [roomUrl, nameInput, navigate]);

  const leaveCall = () => {
    callRef.current?.leave();
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !userName) return;
    await supabase.from('chat_messages').insert({
      appointment_id: appointmentId,
      sender_name: userName,
      sender_role: 'participant',
      message: newMessage.trim(),
    });
    setNewMessage('');
  };

  if (loading) return (
    <div style={styles.center}>
      <div className="spinner" />
      <p>Setting up your consultation room...</p>
    </div>
  );

  if (error) return (
    <div style={styles.center}>
      <p style={{ color: 'red' }}>{error}</p>
      <button onClick={() => navigate('/')} style={styles.btn}>Go Home</button>
    </div>
  );

  if (!joined) return (
    <div style={styles.center}>
      <div style={styles.joinCard}>
        <h2 style={{ marginBottom: 8 }}>Join Consultation</h2>
        <p style={{ color: '#666', marginBottom: 24 }}>Appointment ID: <strong>{appointmentId}</strong></p>
        <input
          style={styles.input}
          placeholder="Your name"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && joinCall()}
        />
        <button style={styles.btn} onClick={joinCall} disabled={!nameInput.trim()}>
          Join Video Call
        </button>
      </div>
    </div>
  );

  return (
    <div style={styles.consultRoom}>
      {/* Video */}
      <div style={styles.videoSection}>
        <div style={styles.videoWrapper} ref={videoRef} />
        {callState === 'joined' && (
          <button style={styles.leaveBtn} onClick={leaveCall}>Leave Call</button>
        )}
      </div>

      {/* Chat */}
      <div style={styles.chatSection}>
        <div style={styles.chatHeader}>
          <span>Session Chat</span>
          <span style={{ fontSize: 12, color: '#888' }}>Appointment: {appointmentId}</span>
        </div>
        <div style={styles.chatMessages}>
          {messages.length === 0 && (
            <p style={{ color: '#aaa', textAlign: 'center', marginTop: 40 }}>No messages yet</p>
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
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button type="submit" style={styles.sendBtn}>Send</button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  center: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: 20 },
  joinCard: { background: '#fff', borderRadius: 16, padding: 40, boxShadow: '0 4px 24px rgba(0,0,0,0.1)', maxWidth: 400, width: '100%', display: 'flex', flexDirection: 'column', gap: 16 },
  input: { padding: '12px 16px', borderRadius: 8, border: '1px solid #ddd', fontSize: 16, outline: 'none' },
  btn: { background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 24px', fontSize: 16, cursor: 'pointer' },
  consultRoom: { display: 'flex', height: '100vh', background: '#0f172a' },
  videoSection: { flex: 1, position: 'relative', padding: 12 },
  videoWrapper: { width: '100%', height: 'calc(100vh - 24px)', borderRadius: 12, overflow: 'hidden', background: '#1e293b' },
  leaveBtn: { position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)', background: '#ef4444', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', cursor: 'pointer', fontSize: 15 },
  chatSection: { width: 320, background: '#fff', display: 'flex', flexDirection: 'column', borderLeft: '1px solid #e2e8f0' },
  chatHeader: { padding: '16px 20px', borderBottom: '1px solid #e2e8f0', fontWeight: 600, display: 'flex', flexDirection: 'column', gap: 4 },
  chatMessages: { flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 10 },
  msgBubble: { maxWidth: '80%', padding: '8px 12px', borderRadius: 12, fontSize: 14, lineHeight: 1.5 },
  chatInputRow: { padding: 12, borderTop: '1px solid #e2e8f0', display: 'flex', gap: 8 },
  chatInput: { flex: 1, padding: '8px 12px', borderRadius: 8, border: '1px solid #ddd', fontSize: 14, outline: 'none' },
  sendBtn: { background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', cursor: 'pointer', fontSize: 14 },
};
