// app/(auth)/index.tsx

import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>WELCOME</Text>

      <Image
        source={require('@/assets/images/icon.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.sloganRed}>
        “Detecting diabetes right at your{'\n'}fingertips and vision.”
      </Text>
      <Text style={styles.subSlogan}>
        Painless. Diabetes Detection with Biotrace
      </Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.loginButton]}
          onPress={() => router.push('/LoginScreen')}
        >
          <Text style={styles.buttonText}>LOGIN</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.registerButton]}
          onPress={() => router.push('/RegisterScreen')}
        >
          <Text style={styles.buttonText}>REGISTER</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#2E9466',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  sloganRed: {
    color: '#D43A3A',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 14,
    marginBottom: 6,
  },
  subSlogan: {
    fontSize: 13,
    color: '#555',
    textAlign: 'center',
    marginBottom: 24,
  },
  buttonContainer: {
    gap: 12,
    width: '80%',
  },
  button: {
    paddingVertical: 14,
    borderRadius: 50,
    alignItems: 'center',
  },
  loginButton: {
    backgroundColor: '#2E9466',
  },
  registerButton: {
    backgroundColor: '#E45353',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
