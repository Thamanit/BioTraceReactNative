// app/(auth)/LoginScreen.tsx

import React, { useContext, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Image, Dimensions
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '@/context/AuthContext';

const { height } = Dimensions.get('window');

export default function SignInScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const authContext = useContext(AuthContext);
  const router = useRouter();

  const handleLogin = async () => {
    if (username && password) {
      await authContext?.login({ username, password });
    } else {
      alert('กรุณากรอกชื่อผู้ใช้และรหัสผ่าน');
    }
  };

  const handleRegisterNav = () => {
    router.push('/RegisterScreen');
  };

  const handleGoBack = () => {
    router.push('/');
  };

  return (
    <View style={styles.container}>
      <View style={styles.greenBackground} />

      <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      <View style={styles.content}>
        <Image source={require('@/assets/images/icon.png')} style={styles.logo} resizeMode="contain" />
        <Text style={styles.title}>Sign In</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#333"
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#333"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity style={styles.registerButton} onPress={handleLogin}>
          <Text style={styles.registerText}>Login</Text>
          <button > </button>router.push('/home');
        </TouchableOpacity>

        <TouchableOpacity style={styles.linkButton} onPress={handleRegisterNav}>
          <Text style={styles.linkText}>Don’t have an account? Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  greenBackground: {
    position: 'absolute',
    bottom: 0,
    height: height / 2,
    width: '100%',
    backgroundColor: '#1ca06f',
    zIndex: -1,
    borderRadius: 12,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 20,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
    marginTop: 150,
  },
  logo: { width: 100, height: 100, marginBottom: 10 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#0a8a50', marginBottom: 20 },
  inputContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#000',
    width: '100%',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#43d3a8',
    padding: 12,
    borderRadius: 6,
    marginBottom: 15,
    color: '#000',
  },
  registerButton: {
    backgroundColor: '#0077b6',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  registerText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  linkButton: {
    marginTop: 15,
  },
  linkText: {
    color: '#0077b6',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});
