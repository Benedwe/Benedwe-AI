import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen({ auth, onSignedIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then((result) => {
          onSignedIn(result.user);
        })
        .catch((error) => {
          console.error(error);
          Alert.alert('Authentication error', error.message);
        });
    }
  }, [response]);

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

  const doGoogleSignIn = async () => {
    try {
      await promptAsync();
    } catch (error) {
      console.error(error);
      Alert.alert('Google Sign-In Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Benedwe AI</Text>
      
      <TouchableOpacity 
        style={styles.googleButton} 
        onPress={doGoogleSignIn}
        disabled={!request}
      >
        <Text style={styles.googleButtonText}>Continue with Google</Text>
      </TouchableOpacity>

      <View style={styles.divider}>
        <Text style={styles.dividerText}>or</Text>
      </View>

      <Text>Email</Text>
      <TextInput 
        value={email} 
        onChangeText={setEmail} 
        style={styles.input} 
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <Text>Password</Text>
      <TextInput 
        value={password} 
        onChangeText={setPassword} 
        secureTextEntry 
        style={styles.input} 
      />
      <Button title="Sign in / Sign up" onPress={doEmailSignIn} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    marginBottom: 30,
    textAlign: 'center',
  },
  googleButton: {
    backgroundColor: '#4285F4',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  googleButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerText: {
    paddingHorizontal: 10,
    color: 'gray',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
});