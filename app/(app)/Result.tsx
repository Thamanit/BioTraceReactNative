import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Image, Platform, Dimensions
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getApiURL } from '@/lib/route';
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

const { height } = Dimensions.get('window');

export default function Result() {
  const router = useRouter();
  const { username } = useLocalSearchParams();
  const [results, setResults] = useState<any[]>([]);

  const fetchResults = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(getApiURL() + "/ml/results", {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      setResults(response.data.results);
    } catch (error) {
      console.error("Error fetching results:", error);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const handleLogout = () => {
    router.replace('/LoginScreen');
  };

  const handleGoHome = () => {
    router.replace({ pathname: '/home', params: { username } });
  };

  const handleYes = () => router.replace('/Appointment');
  const handleNo = () => router.replace('/home');

  return (
    <View style={{ flex: 1, backgroundColor: '#d4f1ec' }}>
      <StatusBar backgroundColor="#0fa36b" barStyle="light-content" translucent={false} />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.leftMenu}>
            <TouchableOpacity style={styles.backButton} onPress={handleGoHome}>
              <Text style={styles.backText}>Home</Text>
            </TouchableOpacity>
            <Image source={require('@/assets/images/icon.png')} style={styles.logo} />
          </View>

          <View style={styles.rightMenu}>
            <Text style={styles.menuItem}>
              {username?.toString().toUpperCase() || 'USER'}
            </Text>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutText}>LOGOUT</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>🩺 Diabetes Detection Results</Text>

        {results.length > 0 ? results.map((item, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.label}>👤 Email</Text>
            <Text style={styles.value}>{item.userEmail}</Text>

            <Text style={styles.label}>🧪 Prediction</Text>
            <Text style={styles.value}>{item.prediction}%</Text>

            <Text style={styles.label}>📊 Risk Level</Text>
            <Text style={styles.value}>{item.level}</Text>

            <Text style={styles.label}>📝 Description</Text>
            <Text style={styles.value}>{item.description}</Text>

            <Text style={styles.label}>⏰ Timestamp</Text>
            <Text style={styles.value}>{new Date(item.timestamp).toLocaleString()}</Text>
          </View>
        )) : (
          <Text style={{ textAlign: 'center', marginTop: 40 }}>No results available.</Text>
        )}

        <Text style={styles.question}>Need doctor appointment?</Text>
        <View style={styles.buttonGroup}>
          <TouchableOpacity style={[styles.button, styles.yes]} onPress={handleYes}>
            <Text style={styles.buttonText}>Yes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.no]} onPress={handleNo}>
            <Text style={styles.buttonText}>No</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.greenBackground} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: {
    padding: 20,
    paddingBottom: 60,
  },
  header: {
    backgroundColor: '#0fa36b',
    paddingTop: Platform.OS === 'android' ? 40 : 60,
    paddingBottom: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  leftMenu: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  backButton: {
    padding: 5,
    paddingRight: 10,
  },
  backText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  logo: {
    width: 60,
    height: 50,
    resizeMode: 'contain',
  },
  rightMenu: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  menuItem: {
    color: '#fff',
    fontWeight: 'bold',
    marginRight: 10,
  },
  logoutButton: {
    backgroundColor: '#d62828',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 8,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0fa36b',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 4,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 15,
    marginTop: 8,
    color: '#1c6758',
  },
  value: {
    fontSize: 15,
    color: '#333',
    marginBottom: 4,
  },
  question: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
    marginBottom: 30,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  yes: {
    backgroundColor: '#3498db',
  },
  no: {
    backgroundColor: '#e74c3c',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  greenBackground: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: height / 2,
    backgroundColor: '#1ca06f',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    elevation: -1,
    zIndex: -1,
  },
});
