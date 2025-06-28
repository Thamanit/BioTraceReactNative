// app/(auth)/RegisterScreen.tsx

import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Dimensions, Image, Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { height } = Dimensions.get('window');

type FormFields = {
  username: string;
  email: string;
  country: string;
  city: string;
  phone: string;
  password: string;
};

export default function RegisterMockup() {
  const [form, setForm] = useState<FormFields>({
    username: '', email: '', country: '',
    city: '', phone: '', password: '',
  });

  const router = useRouter();

  const handleChange = (field: keyof FormFields, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleRegister = () => {

    const allFilled = Object.values(form).every(value => value.trim() !== '');
    if (!allFilled) {
      Alert.alert('ข้อผิดพลาด', 'กรุณากรอกข้อมูลให้ครบทุกช่อง');
      return;
    }
  
    router.replace({ pathname: '/LoginScreen', params: { username: form.username } });
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

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Image source={require('@/assets/images/icon.png')} style={styles.logo} resizeMode="contain" />
        <Text style={styles.title}>Create an Account</Text>
        <View style={styles.formBox}>
          {Object.keys(form).map((key) => (
            <TextInput
              key={key}
              style={styles.input}
              placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
              placeholderTextColor="#333"
              value={form[key as keyof FormFields]}
              onChangeText={(text) => handleChange(key as keyof FormFields, text)}
              secureTextEntry={key === 'password'}
              keyboardType={
                key === 'email'
                  ? 'email-address'
                  : key === 'phone'
                  ? 'phone-pad'
                  : 'default'
              }
            />
          ))}
        </View>
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </ScrollView>
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
  content: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
    paddingTop: 80,
  },
  logo: { width: 100, height: 100, marginBottom: 10 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#0a8a50', marginBottom: 20 },
  formBox: {
    backgroundColor: '#fff',
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
  button: {
    backgroundColor: '#0077b6',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
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
});
