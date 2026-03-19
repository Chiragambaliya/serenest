const DAILY_API_KEY = import.meta.env.VITE_DAILY_API_KEY;
const DAILY_API_URL = 'https://api.daily.co/v1';

export async function createDailyRoom(appointmentId) {
  if (!DAILY_API_KEY) {
    console.warn('VITE_DAILY_API_KEY not set');
    return null;
  }
  const res = await fetch(`${DAILY_API_URL}/rooms`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${DAILY_API_KEY}`,
    },
    body: JSON.stringify({
      name: `serenest-${appointmentId}`,
      properties: {
        max_participants: 2,
        enable_chat: true,
        enable_screenshare: false,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 2,
      },
    }),
  });
  if (!res.ok) return null;
  return res.json();
}

export async function getDailyRoom(roomName) {
  if (!DAILY_API_KEY) return null;
  const res = await fetch(`${DAILY_API_URL}/rooms/${roomName}`, {
    headers: { Authorization: `Bearer ${DAILY_API_KEY}` },
  });
  if (!res.ok) return null;
  return res.json();
}
