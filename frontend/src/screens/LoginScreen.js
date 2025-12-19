import React, { useState } from 'react';
import { View, Text, Button, TextInput, Alert, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithRedirect, GoogleAuthProvider } from 'firebase/auth';

export default function LoginScreen({ auth, onSignedIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const doEmailSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Validation Error', 'Please enter both email and password');
      return;
    }
    
    setLoading(true);
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      onSignedIn(res.user);
    } catch (e) {
      // If sign in fails, try to create account
      try {
        const r2 = await createUserWithEmailAndPassword(auth, email, password);
        onSignedIn(r2.user);
      } catch (e2) {
        console.error('Email authentication error:', e2);
        let errorMessage = 'Authentication failed. Please check your credentials.';
        
        if (e2.code === 'auth/invalid-email') {
          errorMessage = 'Invalid email address format.';
        } else if (e2.code === 'auth/user-not-found' || e2.code === 'auth/wrong-password') {
          errorMessage = 'Incorrect email or password.';
        } else if (e2.code === 'auth/email-already-in-use') {
          errorMessage = 'An account with this email already exists.';
        } else if (e2.code === 'auth/weak-password') {
          errorMessage = 'Password should be at least 8 characters.';
        }
        
        Alert.alert('Authentication Error', errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const doGoogleSignIn = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithRedirect(auth, provider);
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      Alert.alert('Google Sign-In Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Benedwe AI</Text>
      
      {loading ? (
        <ActivityIndicator size="large" color="#4285F4" style={{ marginVertical: 20 }} />
      ) : (
        <>
          <TouchableOpacity 
            style={styles.googleButton} 
            onPress={doGoogleSignIn}
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
            placeholder="Enter your email"
            editable={!loading}
          />
          
          <Text>Password</Text>
          <TextInput 
            value={password} 
            onChangeText={setPassword} 
            secureTextEntry 
            style={styles.input} 
            placeholder="Enter your password"
            editable={!loading}
          />
          
          <Button 
            title="Sign in / Sign up" 
            onPress={doEmailSignIn} 
            disabled={loading}
          />
        </>
      )}
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