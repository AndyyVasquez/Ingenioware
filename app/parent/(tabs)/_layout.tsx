import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { ParentDataProvider } from '../parentDataContext';

export default function ParentTabLayout() {
  const colorActivo = '#4B0082';
  const colorInactivo = '#666';

  return (
    <ParentDataProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colorActivo,
          tabBarInactiveTintColor: colorInactivo,
          tabBarStyle: {
            backgroundColor: '#FFF',
            borderTopWidth: 0,
            elevation: 10,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Resumen',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? 'home' : 'home-outline'}
                size={26}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="progreso"
          options={{
            title: 'Progreso',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? 'stats-chart' : 'stats-chart-outline'}
                size={26}
                color={color}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="bienestar"
          options={{
            title: 'Bienestar',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? 'heart' : 'heart-outline'}
                size={26}
                color={color}
              />
            ),
          }}
        />
         <Tabs.Screen
          name="crearMomento"
          options={{
            title: 'Momentos',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? 'sparkles' : 'sparkles-outline'}
                size={26}
                color={color}
              />
            ),
          }}
        />
        
      </Tabs>
      
    </ParentDataProvider>
  );
}