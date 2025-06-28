// app/(app)/(tabs)/_layout.tsx

import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import CustomTabBar from '../CustomTabBar';

export default function TabLayout() {

  return (
    <Tabs
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: '#1976d2'
      }}
    >
      <Tabs.Screen name="home" options={{
        title: 'Home',
        tabBarIcon: ({ color, size }) => (
          <Ionicons name='home' size={size} color={color} />
        )
      }} />

      <Tabs.Screen name='profile' options={{
        title: 'Profile',
        tabBarIcon: ({ color, size }) => (
          <Ionicons name='person' size={size} color={color} />
        )
      }} />

      <Tabs.Screen name='settings' options={{
        title: 'settings',
        tabBarIcon: ({ color, size }) => (
          <Ionicons name='settings' size={size} color={color} />
        )
      }} />
    </Tabs>
  );
}