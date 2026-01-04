// Firebase configuration for Benedwe AI
// Try to get values from environment variables first, fallback to app.json
const expoConfig = require('./app.json');

const getFirebaseConfig = () => {
  // Check if environment variables are available
  if (process.env.FIREBASE_API_KEY) {
    return {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID,
    };
  }

  const webConfig = expoConfig.expo.web.config.firebase;
  return {
    apiKey: webConfig.apiKey,
    authDomain: webConfig.authDomain,
    projectId: webConfig.projectId,
    storageBucket: webConfig.storageBucket,
    messagingSenderId: webConfig.messagingSenderId,
    appId: webConfig.appId,
  };
};

export const firebaseConfig = getFirebaseConfig();

const requiredEnvVars = [
  'FIREBASE_API_KEY',
  'FIREBASE_AUTH_DOMAIN',
  'FIREBASE_PROJECT_ID',
  'FIREBASE_STORAGE_BUCKET',
  'FIREBASE_MESSAGING_SENDER_ID',
  'FIREBASE_APP_ID'
];

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.warn('Missing required Firebase environment variables:', missingEnvVars);
  console.warn('Using values from app.json instead');
}