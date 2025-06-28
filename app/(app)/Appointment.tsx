// app/(app)/Appointment.tsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function Appointment() {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const router = useRouter();
  const { username } = useLocalSearchParams();
  const usernameStr = Array.isArray(username) ? username[0] : username;
  const upperUsername = usernameStr ? usernameStr.toUpperCase() : 'USER';

  const handleConfirm = () => {
    if (selectedDate) {
      router.replace({ pathname: '/home', params: { username: usernameStr } });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello, {upperUsername}</Text>
      <Text style={styles.subtitle}>Book your appointment</Text>

      <View style={styles.card}>
        <Calendar
          onDayPress={(day) => setSelectedDate(day.dateString)}
          markedDates={{
            [selectedDate]: {
              selected: true,
              selectedColor: '#0077b6',
            },
          }}
          theme={{
            todayTextColor: '#0fa36b',
            arrowColor: '#0fa36b',
          }}
        />
      </View>

      <TouchableOpacity
        style={[
          styles.confirmButton,
          { opacity: selectedDate ? 1 : 0.5 },
        ]}
        disabled={!selectedDate}
        onPress={handleConfirm}
      >
        <Text style={styles.confirmText}>Confirm</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1ca06f',
    alignItems: 'center',
    paddingTop: 60,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 18,
    color: '#ffffff',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 10,
    width: '90%',
    borderWidth: 2,
    borderColor: '#000',
  },
  confirmButton: {
    backgroundColor: '#0077b6',
    marginTop: 30,
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#000',
  },
  confirmText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
