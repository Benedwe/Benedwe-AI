import React, { useState } from 'react';
import { View, Text, Button, TextInput } from 'react-native';
import { signInAnonymously, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

export default function LoginScreen({ auth, onSignedIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const doAnonymous = async () => {
    try {
      const res = await signInAnonymously(auth);
      onSignedIn(res.user);
    } catch (e) {
      console.error(e);
      alert('Unable to sign in anonymously');
    }
  };

  const doEmailSignIn = async () => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      onSignedIn(res.user);
    } catch (e) {
      console.warn(e);
      // fallback: create account
      try {
        const r2 = await createUserWithEmailAndPassword(auth, email, password);
        onSignedIn(r2.user);
      } catch (e2) {
        console.error(e2);
        alert('Email sign-in failed');
      }
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: 'center' }}>
      <Text style={{ fontSize: 22, marginBottom: 20 }}>Welcome to Benedwe AI</Text>
      <Button title="Continue anonymously" onPress={doAnonymous} />

      <View style={{ height: 20 }} />

      <Text>Email</Text>
      <TextInput value={email} onChangeText={setEmail} style={{ borderWidth: 1, padding: 8, marginBottom: 10 }} />
      <Text>Password</Text>
      <TextInput value={password} onChangeText={setPassword} secureTextEntry style={{ borderWidth: 1, padding: 8, marginBottom: 10 }} />
      <Button title="Sign in / Create" onPress={doEmailSignIn} />
    </View>
  );
}
