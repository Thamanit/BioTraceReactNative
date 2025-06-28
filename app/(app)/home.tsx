// app/(app)/home.tsx

import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
  ScrollView,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AuthContext, useAuth } from '@/context/AuthContext';

export default function HomePage() {
  const { username } = useLocalSearchParams<{ username: string }>();
  const router = useRouter();
  const name = username?.toString().toLowerCase();
  const authContext = useContext(AuthContext);
  const { user } = useAuth();
  const [showSettings, setShowSettings] = useState(false);

  const handleLogout = async () => {
    setShowSettings(false);
    await authContext?.logout();
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#0fa36b" barStyle="light-content" />


      <View style={styles.header}>
        <View style={styles.menuGroup}>

          <Text style={styles.menuItem}>HOME</Text>

          <View style={styles.rightMenuGroup}>
            {user.isAdmin && (
              <TouchableOpacity
                style={styles.dashboardButton}
                onPress={() => router.push(`/Dashboard?username=${username}`)}
              >
                <Text style={styles.dashboardText}>DASHBOARD</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.settingsButton}
              onPress={() => setShowSettings(!showSettings)}
            >
              <Text style={styles.settingsText}>⚙ SETTINGS {showSettings ? '▲' : '▼'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {showSettings && (
          <View style={{ zIndex: 10 }}>
            <TouchableOpacity onPress={handleLogout}>
              <Text>LOGOUT</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>


      <ScrollView contentContainerStyle={styles.content}>
        <Image
          source={require('@/assets/images/icon.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.slogan}>
          “Detecting diabetes right at your fingertips and vision.”
        </Text>

        <Text style={styles.subtitle}>
          Painless. Accurate. Non-invasive Detection.
        </Text>

        {/* Card with buttons */}
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.uploadBtn}
            onPress={() => router.push(`/UploadPage?username=${username}`)}
          >
            <Text style={styles.btnText}>📤 Upload Image</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.viewBtn}
            onPress={() => router.push(`/PastRecords?username=${username}`)}
          >
            <Text style={styles.btnText}>📁 View Past Records</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4fdf9',
  },
  header: {
    backgroundColor: '#0fa36b',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 10,
    paddingHorizontal: 20,
    position: 'relative',
  },
  menuGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rightMenuGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  menuItem: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  dashboardButton: {
    backgroundColor: '#0077b6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  dashboardText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  settingsButton: {
    backgroundColor: '#ffffff33',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffffff66',
  },
  settingsText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  settingsMenu: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 100 : 80,
    right: 20,
    backgroundColor: '#ffffffdd',
    borderRadius: 10,
    borderColor: '#fff',
    borderWidth: 1,
    padding: 10,
    zIndex: 10,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 10,
  },
  menuUser: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 6,
  },
  logoutText: {
    color: '#d62828',
    fontWeight: 'bold',
    fontSize: 14,
  },
  content: {
    alignItems: 'center',
    padding: 24,
  },
  logo: {
    width: 140,
    height: 140,
    marginVertical: 20,
  },
  slogan: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1b4332',
    textAlign: 'center',
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  subtitle: {
    color: '#6c757d',
    fontSize: 15,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 30,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 30,
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
    gap: 20,
  },
  uploadBtn: {
    backgroundColor: '#1ca06f',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    width: '100%',
  },
  viewBtn: {
    backgroundColor: '#d62828',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    width: '100%',
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
