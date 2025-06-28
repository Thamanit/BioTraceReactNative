// app/(app)/Result.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { getApiURL } from '@/lib/route';
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Result() {
  const router = useRouter();

  const [eyeResults, setEyeResults] = useState([]);
  const [fingerprintResults, setFingerprintResults] = useState([]);

  const fetchResults = async () => {
    try {
      //get token from AsyncStorage
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

    // // ตั้งเวลาให้ดึงข้อมูลใหม่ทุกๆ 5 วินาที
    // const interval = setInterval(() => {
    //   fetchResults();
    // }, 5000);

    // // ล้างการตั้งเวลาเมื่อ component นี้ถูกลบ
    // return () => clearInterval(interval);
  }, []);


  const handleYes = () => {
    router.replace('/Appointment'); // ไปหน้า Appointment.tsx
  };

  const handleNo = () => {
    router.replace('/home'); // ไปหน้า HomePage.tsx
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Result</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Status</Text>
        <Text style={styles.value}>{((eyeResults[0] as any)?.confidence * 100).toFixed(2)}% Chances of having diabetes</Text>
        <Text style={styles.value}>
          {
            JSON.stringify(eyeResults[0])
          }
        </Text>

        <Text style={styles.label}>Recommendation</Text>
        <Text style={styles.value}>Advise a healthy diet and exercise</Text>

        <Text style={styles.question}>Need doctor appointment?</Text>

        <View style={styles.buttonGroup}>
          <TouchableOpacity style={[styles.button, styles.yes]} onPress={handleYes}>
            <Text style={styles.buttonText}>Yes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.no]} onPress={handleNo}>
            <Text style={styles.buttonText}>No</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d4f1ec',
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#0fa36b',
  },
  card: {
    backgroundColor: '#1ca06f',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#fff',
    marginTop: 10,
  },
  value: {
    fontSize: 15,
    color: '#fff',
    marginBottom: 10,
  },
  question: {
    marginTop: 20,
    fontWeight: 'bold',
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
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
});
