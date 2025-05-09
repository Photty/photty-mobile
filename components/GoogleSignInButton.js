import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View, Platform, Alert } from 'react-native';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { useAuth } from '../context/AuthContext';

const GoogleSignInButton = () => {
  const [loading, setLoading] = useState(false);
  const { loginWithGoogle } = useAuth();

  useEffect(() => {
    // Configure Google Sign In
    try {
      const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
      const iosClientId = process.env.EXPO_PUBLIC_IOS_CLIENT_ID;
      
      console.log('Configuring GoogleSignin with:', { 
        webClientId: webClientId ? '(set)' : '(not set)', 
        iosClientId: iosClientId ? '(set)' : '(not set)',
        platform: Platform.OS
      });
      
      GoogleSignin.configure({
        webClientId,
        iosClientId: Platform.OS === 'ios' ? iosClientId : undefined,
        offlineAccess: true,
      });
      
      console.log('GoogleSignin configured successfully');
    } catch (error) {
      console.error('Failed to configure GoogleSignin:', error);
    }
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      console.log('Starting Google Sign In process');
      
      // Check if Google Play Services are available
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      console.log('Google Play Services are available');
      
      // Perform sign in
      await loginWithGoogle();
      console.log('Google Sign In successful');
    } catch (error) {
      console.error('Error during Google sign in:', error);
      
      let message = 'An error occurred during sign in. Please try again.';
      
      if (error.code) {
        switch (error.code) {
          case statusCodes.SIGN_IN_CANCELLED:
            message = 'Sign in was cancelled';
            break;
          case statusCodes.IN_PROGRESS:
            message = 'Sign in is already in progress';
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            message = 'Play services not available or outdated';
            break;
          default:
            message = `Error: ${error.message}`;
            break;
        }
      }
      
      Alert.alert('Google Sign In Error', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity 
      style={styles.googleButton}
      onPress={handleGoogleSignIn}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color="#fff" size="small" />
      ) : (
        <View style={styles.buttonContent}>
          <Text style={styles.googleButtonText}>Continue with Google</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  googleButton: {
    backgroundColor: '#4285F4',
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    flexDirection: 'row',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
});

export default GoogleSignInButton; 