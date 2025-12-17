import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import LoginScreen from './src/screens/LoginScreen';
import ChatScreen from './src/screens/ChatScreen';
import { firebaseConfig } from './firebaseConfig';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!user) {
    return <LoginScreen auth={auth} onSignedIn={(u) => setUser(u)} />;
  }

  return <ChatScreen auth={auth} user={user} />;
}
