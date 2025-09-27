// src/screens/UserProfileScreen.js
import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StatusBar 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import OnlineIndicator from '../components/OnlineIndicator';
import UsersList from '../components/UsersList';
import ChatScreen from './ChatScreen';
import styles from './UserProfileScreen.styles';

const UserProfileScreen = () => {
  const { user, logout } = useAuth();
  const [currentScreen, setCurrentScreen] = React.useState('profile');
  const [selectedUser, setSelectedUser] = React.useState(null);

  const displayName = React.useMemo(() => {
    if (!user?.email) return '';
    return user.email.split('@')[0];
  }, [user?.email]);

  const handleUserChatPress = (otherUser) => {
    console.log('Opening chat with:', otherUser.displayName);
    setSelectedUser(otherUser);
    setCurrentScreen('chat');
  };

  const handleConversationRead = (otherUserId) => {
    console.log('Conversation read with user:', otherUserId);
    // Force immediate badge update by setting unread count to 0
    // This will be passed to UsersList to update the badge immediately
  };

  const handleCloseChat = () => {
    console.log('Closing chat');
    setCurrentScreen('profile');
    setSelectedUser(null);
  };

   if (currentScreen === 'chat' && selectedUser) {
    return (
      <ChatScreen 
        otherUser={selectedUser}
        currentUserId={user?.uid}
       currentUserName={displayName}
        onClose={handleCloseChat}
        onConversationRead={handleConversationRead}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <View style={styles.userCard}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {displayName.charAt(0).toUpperCase()}
          </Text>
          <OnlineIndicator isOnline={true} />
        </View>

        <View style={styles.userDetails}>
          <Text style={styles.displayName}>{displayName}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          
          <View style={styles.statusContainer}>
            <View style={styles.onlineIndicator} />
            <Text style={styles.statusText}>Online</Text>
          </View>
        </View>
      </View>

      <UsersList 
        currentUserId={user?.uid} 
        onUserChatPress={handleUserChatPress}
      />

      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={logout}
          activeOpacity={0.8}
        >
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default UserProfileScreen;