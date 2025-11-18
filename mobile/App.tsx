import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { initializeFirebase } from './src/config/firebase';
import { AppNavigator } from './src/navigation/AppNavigator';
import { useUserStore } from '../src/platform/store/userStore';

export default function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  const initializeAuth = useUserStore((state) => state.initialize);

  useEffect(() => {
    const initialize = async () => {
      try {
        await initializeFirebase();
        await initializeAuth?.();
      } catch (error) {
        console.error('Initialization error:', error);
      } finally {
        setIsInitialized(true);
      }
    };

    initialize();
  }, [initializeAuth]);

  if (!isInitialized) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7c3aed" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <AppNavigator />
        <StatusBar style="light" />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f0f23',
  },
});
