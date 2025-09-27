// src/components/OnlineIndicator.js
import React, { memo } from 'react';
import { View } from 'react-native';
import styles from './OnlineIndicator.styles';

const OnlineIndicator = memo(({ isOnline = false, size = 16 }) => {
  const indicatorStyle = [
    styles.indicator,
    {
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: isOnline ? '#28a745' : '#6c757d',
    },
  ];

  const pulseStyle = [
    styles.pulse, 
    { 
      width: size * 2, 
      height: size * 2, 
      borderRadius: size 
    }
  ];

  return (
    <View style={styles.container}>
      <View style={indicatorStyle} />
      {isOnline && <View style={pulseStyle} />}
    </View>
  );
});

OnlineIndicator.displayName = 'OnlineIndicator';

export default OnlineIndicator;