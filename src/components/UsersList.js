// src/components/UsersList.js
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';
import OnlineIndicator from './OnlineIndicator';
import UnreadBadge from './UnreadBadge';
import {
    listUsersOrderedByName,
    subscribeUserConversationsOrdered,
    registerListener,
    cleanupListener
} from '../services/firestoreApi';
import styles from './UsersList.styles';

const UserCard = React.memo(({ user, onPress, unreadCount = 0 }) => {
    const displayName = useMemo(() =>
            user.displayName || user.email?.split('@')[0] || 'Unknown',
        [user.displayName, user.email]
    );

    const avatarLetter = useMemo(() =>
            displayName.charAt(0).toUpperCase(),
        [displayName]
    );

    const handlePress = useCallback(() => {
        onPress(user);
    }, [onPress, user]);

    const statusColor = useMemo(() =>
            user.isOnline ? '#10b981' : '#6b7280',
        [user.isOnline]
    );

    const statusText = useMemo(() =>
            user.isOnline ? 'Online' : 'Offline',
        [user.isOnline]
    );

    return (
        <TouchableOpacity
            style={styles.userCard}
            onPress={handlePress}
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
                    <View
                        style={[
                            styles.statusDot,
                            { backgroundColor: statusColor }
                        ]}
                    />
                    <Text style={styles.statusText}>
                        {statusText}
                    </Text>
                </View>
            </View>

            <View style={styles.chatIconContainer}>
                <Text style={styles.chatIcon}>💬</Text>
                <UnreadBadge count={unreadCount} size="small" />
            </View>
        </TouchableOpacity>
    );
});

UserCard.displayName = 'UserCard';

const UsersList = ({ currentUserId, onUserChatPress }) => {
    const [users, setUsers] = useState([]);
    const [unreadCounts, setUnreadCounts] = useState({});
    const [locallyReadConversations, setLocallyReadConversations] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUsers = useCallback(async () => {
        try {
            const allUsers = await listUsersOrderedByName();
            const otherUsers = allUsers.filter((u) => u.uid !== currentUserId && u.id !== currentUserId);
            setUsers(otherUsers);
        } catch (err) {
            setError(err.message);
        }
    }, [currentUserId]);

    useEffect(() => {
        if (currentUserId) fetchUsers();
    }, [currentUserId, fetchUsers]);

    useEffect(() => {
        if (!currentUserId) return;

        const key = `convos_${currentUserId}`;
        const unsub = subscribeUserConversationsOrdered(
            currentUserId,
            (conversations) => {
                const unreadMap = {};
                conversations.forEach((c) => {
                    if (c?.type !== 'direct') return;

                    const otherUserId = c.participants?.find((id) => id !== currentUserId);
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
                setError(err?.message || 'Subscription error');
                setLoading(false);
            }
        );

        registerListener(key, unsub);
        return () => cleanupListener(key);
    }, [currentUserId, locallyReadConversations]);

    const handleUserPress = useCallback((user) => {
        setLocallyReadConversations((prev) => new Set([...prev, user.uid]));
        setUnreadCounts((prev) => {
            const next = { ...prev };
            delete next[user.uid];
            return next;
        });
        onUserChatPress(user);
    }, [onUserChatPress]);

    const renderUser = useCallback(({ item }) => (
        <UserCard
            user={item}
            onPress={handleUserPress}
            unreadCount={unreadCounts[item.uid] || 0}
        />
    ), [handleUserPress, unreadCounts]);

    const keyExtractor = useCallback((item) => item.uid || item.id, []);

    const ItemSeparator = useCallback(() => <View style={styles.separator} />, []);

    const headerSubtitle = useMemo(() =>
            `${users.length} user${users.length !== 1 ? 's' : ''} available`,
        [users.length]
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
                    <Text style={styles.errorSubtext}>Make sure Firestore is properly configured</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Other Users</Text>
                <Text style={styles.headerSubtitle}>
                    {headerSubtitle}
                </Text>
            </View>

            {users.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No other users found</Text>
                    <Text style={styles.emptySubtext}>Try creating another account to test chat</Text>
                </View>
            ) : (
                <FlatList
                    data={users}
                    renderItem={renderUser}
                    keyExtractor={keyExtractor}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContainer}
                    ItemSeparatorComponent={ItemSeparator}
                    removeClippedSubviews={true}
                    maxToRenderPerBatch={10}
                    updateCellsBatchingPeriod={50}
                    initialNumToRender={10}
                    windowSize={5}
                    getItemLayout={null}
                />
            )}
        </View>
    );
};

export default React.memo(UsersList);