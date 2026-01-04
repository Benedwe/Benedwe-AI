import React, { useState } from 'react';
import { View, Text, Button, TextInput, Alert, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { createUserWithEmailAndPassword, signInWithRedirect, GoogleAuthProvider } from 'firebase/auth';

export default function SignupScreen({ auth, onSignedIn, onNavigateToLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const doEmailSignUp = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Validation Error', 'Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      Alert.alert('Validation Error', 'Passwords do not match');
      return;
    }
    
    if (password.length < 8) {
      Alert.alert('Validation Error', 'Password should be at least 8 characters');
      return;
    }
    
    setLoading(true);
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      onSignedIn(res.user);
    } catch (e) {
      console.error('Email signup error:', e);
      let errorMessage = 'Signup failed. Please try again.';
      
      if (e.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address format.';
      } else if (e.code === 'auth/email-already-in-use') {
        errorMessage = 'An account with this email already exists.';
      } else if (e.code === 'auth/weak-password') {
        errorMessage = 'Password should be at least 8 characters.';
      }
      
      Alert.alert('Signup Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const doGoogleSignUp = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithRedirect(auth, provider);
    } catch (error) {
      console.error('Google Sign-Up Error:', error);
      Alert.alert('Google Sign-Up Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      
      {loading ? (
        <ActivityIndicator size="large" color="#4285F4" style={{ marginVertical: 20 }} />
      ) : (
        <>
          <TouchableOpacity 
            style={styles.googleButton} 
            onPress={doGoogleSignUp}
          >
            <Text style={styles.googleButtonText}>Sign up with Google</Text>
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
            placeholder="Create a password"
            editable={!loading}
          />
          
          <Text>Confirm Password</Text>
          <TextInput 
            value={confirmPassword} 
            onChangeText={setConfirmPassword} 
            secureTextEntry 
            style={styles.input} 
            placeholder="Confirm your password"
            editable={!loading}
          />
          
          <Button 
            title="Sign Up" 
            onPress={doEmailSignUp} 
            disabled={loading}
          />
          
          <View style={styles.footer}>
            <Text>Already have an account? </Text>
            <TouchableOpacity onPress={onNavigateToLogin}>
              <Text style={styles.link}>Sign In</Text>
            </TouchableOpacity>
          </View>
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  link: {
    color: '#4285F4',
    fontWeight: 'bold',
  },
});