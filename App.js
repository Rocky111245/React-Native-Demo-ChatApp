// App.js
import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import LoginScreen from './src/screens/auth/LoginScreen';
import UserProfileScreen from './src/screens/UserProfileScreen';
import { cleanupAllListeners } from './src/utils/listeners';

// Main Router that decides which screen to show
const AppNavigator = () => {
  const { user } = useAuth();
  return user ? <UserProfileScreen /> : <LoginScreen />;
};

export default function App() {
  useEffect(() => {
    // Cleanup Firestore listeners when the app unmounts
    return () => {
      cleanupAllListeners();
    };
  }, []);

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
