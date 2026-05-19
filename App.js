import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';
import { AuthProvider } from './context/AuthContext';

import Home from './pages/Home';
import HistoryScreen from './pages/HistoryScreen';
import DetailScreen from './pages/DetailScreen';
import AboutScreen from './pages/About';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HistoryStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="HistoryList" component={HistoryScreen} options={{ title: 'Riwayat Absensi' }} />
      <Stack.Screen name="Detail" component={DetailScreen} options={{ title: 'Detail Informasi' }} />
    </Stack.Navigator>
  );  
}

export default function App() {
  return (
    // AuthProvider membungkus seluruh aplikasi
    <AuthProvider>
      <NavigationContainer>
        <Tab.Navigator screenOptions={{ tabBarActiveTintColor: '#007AFF', headerShown: false }}>
          
          {/* Tab 1: Beranda */}
          <Tab.Screen 
            name="HomeTab" 
            component={Home} 
            options={{
              tabBarLabel: 'Beranda',
              tabBarIcon: ({ color }) => <MaterialIcons name="home" size={24} color={color} />
            }} 
          />
          
          {/* Tab 2: Riwayat */}
          <Tab.Screen 
            name="HistoryTab" 
            component={HistoryStack} 
            options={{
              tabBarLabel: 'Riwayat',
              tabBarIcon: ({ color }) => <MaterialIcons name="history" size={24} color={color} />
            }} 
          />
          
          {/* Tab 3: Profil / About */}
          <Tab.Screen 
            name="AboutTab" 
            component={AboutScreen} 
            options={{
              tabBarLabel: 'About', 
              tabBarIcon: ({ color }) => <MaterialIcons name="person" size={24} color={color} />
            }} 
          />

        </Tab.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}