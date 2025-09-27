// src/components/OnlineIndicator.styles.js
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicator: {
    borderWidth: 2,
    borderColor: '#ffffff',
    zIndex: 2,
  },
  pulse: {
    position: 'absolute',
    backgroundColor: '#28a745',
    opacity: 0.3,
    zIndex: 1,
  },
});