import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar, View, Text, TouchableOpacity, Alert } from 'react-native';
import { AuthProvider, useAuth } from './context/AuthContext';

// Screens
import LoginScreen from './screens/LoginScreen';

// Create a Home screen placeholder
const HomeScreen = () => {
  const { logout, currentUser } = useAuth();
  
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>Welcome to SnapQuest!</Text>
      {currentUser && (
        <Text style={{ marginBottom: 20 }}>
          User: {currentUser.email}
        </Text>
      )}
      <TouchableOpacity 
        style={{ marginTop: 20, padding: 10, backgroundColor: '#007BFF', borderRadius: 5 }}
        onPress={logout}
      >
        <Text style={{ color: 'white' }}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

// Navigation component that checks auth state
const AppNavigator = () => {
  const { currentUser, loading } = useAuth();
  const Stack = createStackNavigator();

  if (loading) {
    return null; // Or a loading screen
  }

  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" />
      
      <Stack.Navigator>
        {currentUser ? (
          // User is logged in
          <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{ headerShown: false }}
          />
        ) : (
          // No user logged in
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// Main App component
export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
} 