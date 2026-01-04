import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, LogBox, Text } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { AppRegistry } from 'react-native';
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import ChatScreen from './src/screens/ChatScreen';
import { firebaseConfig } from './firebaseConfig';

// Ignore logs for now to focus on the main issue
LogBox.ignoreAllLogs(true);

console.log('Firebase config:', firebaseConfig);

let app;
try {
  app = initializeApp(firebaseConfig);
  console.log('Firebase app initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase app:', error);
}

let auth;
if (app) {
  try {
    auth = getAuth(app);
    console.log('Firebase auth initialized successfully');
  } catch (error) {
    console.error('Error initializing Firebase auth:', error);
  }
}

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initError, setInitError] = useState(null);
  const [showSignup, setShowSignup] = useState(false);

  useEffect(() => {
    if (!auth) {
      setInitError('Firebase auth not initialized');
      setLoading(false);
      return;
    }

    try {
      const unsub = onAuthStateChanged(auth, (u) => {
        setUser(u);
        setLoading(false);
      });
      return unsub;
    } catch (error) {
      console.error('Error in onAuthStateChanged:', error);
      setInitError(error.message);
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (initError) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <Text>Error: {initError}</Text>
      </View>
    );
  }

  if (!user) {
    if (showSignup) {
      return <SignupScreen 
        auth={auth} 
        onSignedIn={(u) => setUser(u)} 
        onNavigateToLogin={() => setShowSignup(false)} 
      />;
    } else {
      return <LoginScreen 
        auth={auth} 
        onSignedIn={(u) => setUser(u)} 
        onNavigateToSignup={() => setShowSignup(true)} 
      />;
    }
  }

  return <ChatScreen auth={auth} user={user} />;
}

// Register the app component with the name "main" to match MainActivity.java
AppRegistry.registerComponent('main', () => App);

export default App;