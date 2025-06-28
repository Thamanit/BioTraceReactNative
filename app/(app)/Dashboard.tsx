// app/(app)/Dashboard.tsx

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
  Platform,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { getApiURL } from '@/lib/route';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { height } = Dimensions.get('window');

export default function Dashboard() {
  const { username } = useLocalSearchParams();
  const router = useRouter();
  const usernameStr = Array.isArray(username) ? username[0] : username;
  const upperUsername = usernameStr ? usernameStr.toUpperCase() : 'USER';

  const [showSettings, setShowSettings] = useState(false);

  const [eyeResults, setEyeResults] = useState([]);
  const [fingerprintResults, setFingerprintResults] = useState([]);
  const [diabeteResults, setDiabetesResults] = useState<{email: string, prediction: number}[]>([]);

  useEffect(() => {
    const newDiabetesResults = [];
    for (let i=0; i < eyeResults.length; i++) {
      const eye = eyeResults[i] as any;
      const eyeConfidence = eye?.confidence || 0;
      const fingerprint = fingerprintResults[i] as any;
      const fingerprintConfidence = fingerprint?.confidence || 0;

      newDiabetesResults.push({
        email: eye?.userEmail || fingerprint?.userEmail || "unknown",
        prediction: (eyeConfidence + fingerprintConfidence) / 2,
      });
    }
    setDiabetesResults(newDiabetesResults);
  }, [eyeResults, fingerprintResults]);

  const fetchResults = async () => {
    try {
      let token = await AsyncStorage.getItem('token');
      const response = await axios.get(getApiURL() + "/ml/results/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      const data = response.data;
      setEyeResults(data.eyes);
      setFingerprintResults(data.fingers);
    } catch (error) {
      console.error("Error fetching eye results:", error);
    }
  }

  // ใช้ useEffect เพื่อดึงข้อมูลจาก Firebase เมื่อโหลดเพจ
  useEffect(() => {
    fetchResults();

    // ตั้งเวลาให้ดึงข้อมูลใหม่ทุกๆ 5 วินาที
    const interval = setInterval(() => {
      fetchResults();
    }, 5000);

    // ล้างการตั้งเวลาเมื่อ component นี้ถูกลบ
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    setShowSettings(false);
    router.replace('/LoginScreen');
  };

  const handleGoHome = () => {
    setShowSettings(false);
    router.replace({ pathname: '/home', params: { username: usernameStr } });
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#0fa36b" barStyle="light-content" translucent={false} />
      <View style={styles.greenBackground} />
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.leftMenu}>
            <TouchableOpacity style={styles.backButton} onPress={handleGoHome}>
              <Ionicons name="arrow-back" size={22} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.titleText}>DASHBOARD</Text>
          </View>

          <View style={styles.rightMenu}>
            <TouchableOpacity
              style={styles.settingsButton}
              onPress={() => setShowSettings(!showSettings)}
            >
              <Text style={styles.settingsText}>⚙ SETTINGS {showSettings ? '▲' : '▼'}</Text>
            </TouchableOpacity>

            {showSettings && (
              <View style={styles.settingsMenu}>
                <Text style={styles.menuUser}>👤 {upperUsername}</Text>
                <TouchableOpacity onPress={handleLogout}>
                  <Text style={styles.logoutText}>LOGOUT</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </View>
      <View style={styles.body}>

        <ScrollView style={styles.scrollBox} contentContainerStyle={styles.scrollContent}>
          {diabeteResults.map((result, index) => (
            <View key={index} style={styles.card}>
              <Image
                source={require('@/assets/images/icon.png')}
                style={styles.avatar}
              />
              <View style={styles.userInfo}>
                <Text style={styles.userText}>Email: {result.email}</Text>
                <Text style={styles.userText}>Name {index + 1}</Text>
                <Text style={styles.userText}>Prediction: {result.prediction}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#fff',
  },
  greenBackground: {
    position: 'absolute',
    bottom: 0,
    height: height * 0.55,
    width: '100%',
    backgroundColor: '#d7fbe8',
    zIndex: -1,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  header: {
    backgroundColor: '#0fa36b',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 40 : 60,
    paddingBottom: 15,
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
    gap: 12,
  },
  backButton: {
    padding: 5,
    backgroundColor: '#ffffff22',
    borderRadius: 20,
  },
  titleText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  rightMenu: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  settingsButton: {
    backgroundColor: '#ffffff33',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ffffffaa',
  },
  settingsText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  settingsMenu: {
    position: 'absolute',
    top: 45,
    right: 0,
    backgroundColor: '#ffffffee',
    borderRadius: 10,
    borderColor: '#0b5e33',
    borderWidth: 1,
    padding: 12,
    zIndex: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 10,
  },
  menuUser: {
    color: '#0b5e33',
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 8,
  },
  logoutText: {
    color: '#d62828',
    fontWeight: 'bold',
    fontSize: 14,
  },
  body: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0fa36b',
    marginBottom: 15,
  },
  scrollBox: {
    width: '100%',
    maxHeight: height * 0.75,
    borderRadius: 20,
    backgroundColor: '#f0fdf4',
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(46, 168, 123, 0.1)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#0fa36b',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userText: {
    color: '#333',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },
});
