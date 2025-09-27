// src/components/UnreadBadge.styles.js
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  badge: {
    backgroundColor: '#dc3545',
    borderRadius: 10,
    minWidth: 20,
    paddingHorizontal: 4,
    paddingVertical: 2,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: -4,
    right: -4,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  badgeDefault: {
    height: 20,
    minWidth: 20,
  },
  badgeSmall: {
    height: 16,
    minWidth: 16,
    borderRadius: 8,
    paddingHorizontal: 3,
    paddingVertical: 1,
  },
  badgeText: {
    color: '#ffffff',
    fontWeight: '700',
    textAlign: 'center',
  },
  badgeTextDefault: {
    fontSize: 12,
    lineHeight: 16,
  },
  badgeTextSmall: {
    fontSize: 10,
    lineHeight: 12,
  },
});