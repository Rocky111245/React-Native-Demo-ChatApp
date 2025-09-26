// TestFirebase.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { app,auth } from './src/services/firebaseConfig';

export default function TestFirebase() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Firebase Test</Text>
      <Text style={styles.status}>
        {auth ? '✅ Firebase Connected!' : '❌ Firebase Failed'}
      </Text>
         <Text style={styles.info}>
       Project ID: {app?.options?.projectId || 'Not found'}
      </Text>
      <Text style={styles.info}>
        Auth Domain: {app?.options?.authDomain || 'Not found'}
      </Text>
      <Text style={styles.info}>
        Current user: {auth?.currentUser?.email || 'none'}
      </Text>
      <Text style={styles.ready}>🚀 Ready for Authentication!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  status: {
    fontSize: 16,
    marginBottom: 10,
  },
  info: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  ready: {
    fontSize: 18,
    color: '#007AFF',
  },
});