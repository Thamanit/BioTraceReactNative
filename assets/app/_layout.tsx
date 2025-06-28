import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { Pressable } from 'react-native';

export default function RootLayout() {

  return <Stack>
    <Stack.Screen name="index" options={{
      title: 'หน้าแรก',
      headerStyle: { backgroundColor: '#1976d2' },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: 'bold', fontSize: 22 },
      headerLeft: () => (
        <Ionicons name='home' size={28} color='#fff' style={{ marginLeft: 16, marginRight: 5 }} />
      ),
      headerRight: () => (
        <Pressable onPress={() => alert('เมนูเพิ่มเติม')}>
          <Ionicons name='menu' size={28} color='#fff' style={{ marginRight: 10 }} />
        </Pressable>
      )
    }} />
    <Stack.Screen name="screen/HomeScreen" options={{
      title: 'หน้าหลัก',
      headerStyle: { backgroundColor: '#388e3c' },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: 'bold', fontSize: 22 },
      headerLeft: () => (
        <Ionicons name='person' size={28} color='#fff' style={{ marginLeft: 16, marginRight: 5 }} />
      ),
    }} />
    <Stack.Screen name="screen/DetailScreen" options={{
      title: 'รายละเอียด',
      headerStyle: { backgroundColor: '#d32f2f' },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: 'bold', fontSize: 22 },
      headerRight: () => (
        <Ionicons name='ellipsis-vertical' size={28} color='#fff' style={{ marginLeft: 16, marginRight: 5 }} />
      ),
    }} />
  </Stack>
}