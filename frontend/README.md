# Benedwe AI — Frontend (React Native / Expo)

This is a minimal React Native (Expo) client for Benedwe AI. It demonstrates:
- Firebase Authentication (anonymous or email)
- Sending ID token to backend `/api/chat`
- Simple chat UI

Setup
1. Install Expo CLI (if you don't have it):

```bash
npm install --global expo-cli
```

2. Copy `.env.example` to `.env` and fill in your Firebase config and `API_BASE_URL`.
3. Install dependencies:

```bash
cd frontend
npm install
```

4. Start the app:

```bash
npm start
# or
expo start
```

Important notes
- Update `firebaseConfig.js` with your Firebase project values or set them via your preferred environment injection for Expo.
- The client requests an ID token from Firebase and attaches it as `Authorization: Bearer <token>` to backend requests.
- Do NOT include `OPENAI_API_KEY` or any secret in this repo's client-side code.
