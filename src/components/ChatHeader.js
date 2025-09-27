// src/components/ChatHeader.js
import { View, Text, TouchableOpacity } from 'react-native';
import OnlineIndicator from './OnlineIndicator';
import styles from './ChatHeader.styles';

const ChatHeader = ({ user, onClose }) => {
  const displayName = user.displayName || user.email?.split('@')[0] || 'Unknown';
  const avatarLetter = displayName.charAt(0).toUpperCase();

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.closeButton}
        onPress={onClose}
        activeOpacity={0.7}
      >
        <Text style={styles.closeIcon}>←</Text>
      </TouchableOpacity>

      <View style={styles.userInfo}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>{avatarLetter}</Text>
          <OnlineIndicator isOnline={user.isOnline} size={10} />
        </View>

        <View style={styles.userDetails}>
          <Text style={styles.userName}>{displayName}</Text>
          <Text style={styles.userStatus}>
            {user.isOnline ? 'Online' : 'Offline'}
          </Text>
        </View>
      </View>

      <View style={styles.spacer} />
    </View>
  );
};

export default ChatHeader;