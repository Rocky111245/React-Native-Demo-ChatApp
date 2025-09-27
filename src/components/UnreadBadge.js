// src/components/UnreadBadge.js
import React from 'react';
import { View, Text } from 'react-native';
import styles from './UnreadBadge.styles';

const UnreadBadge = ({ count, size = 'default' }) => {
  if (!count || count === 0) return null;

  // Format count (99+ for large numbers)
  const displayCount = count > 99 ? '99+' : count.toString();
  
  const badgeStyle = [
    styles.badge,
    size === 'small' ? styles.badgeSmall : styles.badgeDefault
  ];
  
  const textStyle = [
    styles.badgeText,
    size === 'small' ? styles.badgeTextSmall : styles.badgeTextDefault
  ];

  return (
    <View style={badgeStyle}>
      <Text style={textStyle}>{displayCount}</Text>
    </View>
  );
};

export default UnreadBadge;