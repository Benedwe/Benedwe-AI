import axios from 'axios';

const API_BASE = process.env.API_BASE_URL || 'http://localhost:8000';

export async function sendChat(idToken, userId, message) {
  const res = await axios.post(
    `${API_BASE}/api/chat`,
    { user_id: userId, message },
    { headers: { Authorization: `Bearer ${idToken}` } }
  );
  return res.data;
}

export async function resetMemory(idToken, userId) {
  const res = await axios.post(
    `${API_BASE}/api/reset`,
    { user_id: userId },
    { headers: { Authorization: `Bearer ${idToken}` } }
  );
  return res.data;
}
