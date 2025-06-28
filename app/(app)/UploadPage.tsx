import React, { useState } from 'react';
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { getApiURL } from '@/lib/route';
import * as FileSystem from 'expo-file-system';
import * as mime from 'react-native-mime-types'; // You might need to install this


const { height } = Dimensions.get('window');

export default function UploadPage() {
  const router = useRouter();
  const { username } = useLocalSearchParams();
  const { user } = useAuth();

  const usernameStr = Array.isArray(username) ? username[0] : username;
  const upperUsername = usernameStr ? usernameStr.toUpperCase() : 'USER';

  const [showSettings, setShowSettings] = useState(false);

  const [eyes, setEyes] = useState<(string | null)[]>([null, null]);
  const [fingers, setFingers] = useState<(string | null)[]>(Array(10).fill(null));

  const handleLogout = () => {
    setShowSettings(false);
    router.replace('./LoginScreen');
  };
  const handleGoHome = () => {
    setShowSettings(false);
    router.replace({ pathname: '/home', params: { username: usernameStr } });
  };

  const pickImage = async (index: number, isEye: boolean) => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert('ต้องอนุญาตให้เข้าถึงคลังภาพนะ!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, quality: 1 });
    if (!result.canceled) {
      const updated = isEye ? [...eyes] : [...fingers];
      updated[index] = result.assets[0].uri;
      isEye ? setEyes(updated) : setFingers(updated);
    }
  };

  const eyeNames = ['EyeR', 'EyeL'];
  const fingerNames = [
    'FingerR1', 'FingerR2', 'FingerR3', 'FingerR4', 'FingerR5',
    'FingerL1', 'FingerL2', 'FingerL3', 'FingerL4', 'FingerL5',
  ];

  const renderUploadBox = (img: string | null, label: string, onPress: () => void) => (
    <TouchableOpacity style={styles.uploadBox} onPress={onPress} activeOpacity={0.7}>
      {img ? (
        <Image source={{ uri: img }} style={styles.imagePreview} />
      ) : (
        <Text style={styles.uploadBoxText}>{label}</Text>
      )}
    </TouchableOpacity>
  );

  // …inside UploadPage component
  const handleUpload = async () => {
    if (!user) {
      Alert.alert('Login required', 'Please log in to upload images.');
      return;
    }

    if (fingers.every(f => !f) && eyes.every(e => !e)) {
      Alert.alert('No images', 'Please select at least one image.');
      return;
    }

    const formData = new FormData();

    const appendFile = async (uri: string, fieldName: string) => {
      const fileName = uri.split('/').pop() || `${fieldName}.jpg`;
      const type = mime.lookup(uri) || 'image/jpeg';

      if (Platform.OS === 'web') {
        const response = await fetch(uri);
        const blob = await response.blob();
        const file = new File([blob], fileName, { type }); // 👈 real filename here
        formData.append(fieldName, file);
      } else {
        formData.append(fieldName, {
          uri,
          name: fileName,
          type,
        } as any);
      }
    };


    // Eyes
    for (let i = 0; i < eyes.length; i++) {
      if (eyes[i]) await appendFile(eyes[i]!, `eye_${i}`);
    }

    // Fingers
    for (let i = 0; i < fingers.length; i++) {
      if (fingers[i]) await appendFile(fingers[i]!, `finger_${i}`);
    }

    formData.append('userEmail', user.email);

    try {
      await axios.post(`${getApiURL()}/ml/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: evt => {
          const pct = Math.round((evt.loaded * 100) / (evt.total || 1));
          console.log('upload %', pct);
        },
      });

      Alert.alert('Success', 'Images uploaded!');
      setFingers(Array(10).fill(null));
      setEyes([null, null]);
      router.replace('/Result');
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Upload failed, please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.leftMenu}>
            <TouchableOpacity style={styles.backButton} onPress={handleGoHome} activeOpacity={0.7}>
              <Text style={styles.backText}>Home</Text>
            </TouchableOpacity>
            <Image source={require('@/assets/images/icon.png')} style={styles.logo} />
          </View>

          <View style={styles.rightMenu}>
            <TouchableOpacity
              style={styles.settingsButton}
              onPress={() => setShowSettings(!showSettings)}
              activeOpacity={0.7}
            >
              <Text style={styles.settingsText}>⚙ SETTINGS {showSettings ? '▲' : '▼'}</Text>
            </TouchableOpacity>

            {showSettings && (
              <View style={styles.settingsMenu}>
                <Text style={styles.menuUser}>👤 {user.email}</Text>
                <TouchableOpacity onPress={handleLogout} activeOpacity={0.7}>
                  <Text style={styles.logoutText}>LOGOUT</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </View>

      <Text style={styles.headerText}>Upload Images</Text>

      <View style={styles.inputContainer}>
        <ScrollView contentContainerStyle={styles.content} style={{ maxHeight: 500 }}>
          <Text style={styles.sectionTitle}>2 Eyes</Text>
          <View style={styles.row}>
            {eyes.map((img, index) => (
              <View key={index} style={styles.imageWrapper}>
                {renderUploadBox(img, eyeNames[index], () => pickImage(index, true))}
              </View>
            ))}
          </View>

          <Text style={styles.sectionTitle}>10 Fingers</Text>
          <View style={styles.fingerGrid}>
            {fingers.map((img, index) => (
              <View key={index} style={styles.imageWrapper}>
                {renderUploadBox(img, fingerNames[index], () => pickImage(index, false))}
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={styles.uploadButton}
            onPress={handleUpload}
            activeOpacity={0.8}
          >
            <Text style={styles.uploadButtonText}>Upload</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <View style={styles.greenBackground} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4fdf9',
    overflow: 'hidden',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 15,
    backgroundColor: '#0fa36b',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    position: 'relative',
  },
  leftMenu: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    padding: 6,
    paddingRight: 12,
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
  },
  settingsButton: {
    backgroundColor: '#ffffff33',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ffffffaa',
    marginLeft: 10,
  },
  settingsText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  settingsMenu: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 50,
    right: 0,
    backgroundColor: '#ffffffdd',
    borderRadius: 10,
    borderColor: '#0b5e33',
    borderWidth: 1,
    padding: 12,
    zIndex: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 12,
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
  headerText: {
    color: '#1b4332',
    fontWeight: 'bold',
    fontSize: 22,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 15,
  },
  inputContainer: {
    backgroundColor: '#319773',
    padding: 15,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#000000',
    width: '90%',
    alignSelf: 'center',
    marginBottom: 25,
    maxHeight: height * 0.75,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginVertical: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  fingerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  imageWrapper: {
    margin: 6,
  },
  uploadBox: {
    borderWidth: 2,
    borderColor: '#0077b6',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderStyle: 'dashed',
    backgroundColor: '#f0f9ff',
    width: 70,
    height: 70,
  },
  uploadBoxText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#0077b6',
    textAlign: 'center',
  },
  imagePreview: {
    width: 62,
    height: 62,
    borderRadius: 10,
  },
  uploadButton: {
    backgroundColor: '#1ca06f',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    width: '100%',
    marginTop: 25,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 6,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  greenBackground: {
    position: 'absolute',
    bottom: 0,
    height: height / 2,
    width: '100%',
    backgroundColor: '#1ca06f',
    zIndex: -1,
    borderRadius: 12,
  },
});
