// src/components/UsersList.js
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity,
  ActivityIndicator 
} from 'react-native';
import OnlineIndicator from './OnlineIndicator';
import UnreadBadge from './UnreadBadge';
import { listUsersOrderedByName, subscribeUserConversationsOrdered, registerListener, cleanupListener } from '../services/firestoreApi';
import styles from './UsersList.styles';

const UserCard = ({ user, onPress, unreadCount = 0 }) => {
  const displayName = user.displayName || user.email?.split('@')[0] || 'Unknown';
  const avatarLetter = displayName.charAt(0).toUpperCase();

  return (
    <TouchableOpacity 
      style={styles.userCard}
      onPress={() => onPress(user)}
      activeOpacity={0.7}
    >
      <View style={styles.avatarContainer}>
        <Text style={styles.avatarText}>{avatarLetter}</Text>
        <OnlineIndicator isOnline={user.isOnline} size={12} />
      </View>

      <View style={styles.userInfo}>
        <Text style={styles.userName}>{displayName}</Text>
        <Text style={styles.userEmail}>{user.email}</Text>
        
        <View style={styles.statusContainer}>
          <View style={[
            styles.statusDot, 
            { backgroundColor: user.isOnline ? '#10b981' : '#6b7280' }
          ]} />
          <Text style={styles.statusText}>
            {user.isOnline ? 'Online' : 'Offline'}
          </Text>
        </View>
      </View>

      <View style={styles.chatIconContainer}>
        <Text style={styles.chatIcon}>💬</Text>
        <UnreadBadge count={unreadCount} size="small" />
      </View>
    </TouchableOpacity>
  );
};

const UsersList = ({ currentUserId, onUserChatPress }) => {
  const [users, setUsers] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [locallyReadConversations, setLocallyReadConversations] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Effect for fetching users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        console.log('Fetching users...');
        const allUsers = await listUsersOrderedByName();
        const otherUsers = allUsers.filter(user => {
          return user.uid !== currentUserId && user.id !== currentUserId;
        });
        
        console.log('Other users:', otherUsers.length);
        setUsers(otherUsers);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError(err.message);
      }
    };

    if (currentUserId) {
      fetchUsers();
    }
  }, [currentUserId]);

  // Effect for real-time unread counts
  useEffect(() => {
  if (!currentUserId) return;

  console.log('Setting up real-time unread counts listener...');
  const key = `convos_${currentUserId}`;

  const unsub = subscribeUserConversationsOrdered(
    currentUserId,
    (conversations) => {
      // In the repo, each conversation already contains `unreadCount` as a NUMBER for this user.
      const unreadMap = {};
      conversations.forEach((c) => {
        const otherUserId = c.participants?.find(id => id !== currentUserId);
        if (!otherUserId) return;

        const count = c.unreadCount || 0; 
        if (!locallyReadConversations.has(otherUserId) && count > 0) {
          unreadMap[otherUserId] = count;
        }
      });
      setUnreadCounts(unreadMap);
      setLoading(false);
    },
    (err) => {
      console.error('Error in conversations subscription:', err);
      setError(err?.message || 'Subscription error');
      setLoading(false);
    }
  );

  registerListener(key, unsub);
  return () => cleanupListener(key);
}, [currentUserId, locallyReadConversations]);


  const handleUserPress = (user) => {
    console.log('Start chat with:', user.displayName);
    
    setLocallyReadConversations(prev => new Set([...prev, user.uid]));
    
    setUnreadCounts(prev => {
      const newCounts = { ...prev };
      delete newCounts[user.uid];
      return newCounts;
    });
    
    onUserChatPress(user);
  };

  const renderUser = ({ item }) => (
    <UserCard 
      user={item} 
      onPress={handleUserPress}
      unreadCount={unreadCounts[item.uid] || 0}
    />
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Other Users</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={styles.loadingText}>Loading users...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Other Users</Text>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
          <Text style={styles.errorSubtext}>
            Make sure Firestore is properly configured
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Other Users</Text>
        <Text style={styles.headerSubtitle}>
          {users.length} user{users.length !== 1 ? 's' : ''} available
        </Text>
      </View>

      {users.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No other users found</Text>
          <Text style={styles.emptySubtext}>
            Try creating another account to test chat
          </Text>
        </View>
      ) : (
        <FlatList
          data={users}
          renderItem={renderUser}
          keyExtractor={(item) => item.uid || item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </View>
  );
};

export default UsersList;