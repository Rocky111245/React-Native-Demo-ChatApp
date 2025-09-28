// src/screens/GroupChatListScreen.js
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import UnreadBadge from '../components/UnreadBadge';
import {
    subscribeUserGroupsOrdered,
    registerListener,
    cleanupListener
} from '../services/firestoreApi';
import styles from './GroupChatListScreen.styles';

const GroupChatCard = React.memo(({ conversation, onPress, unreadCount = 0 }) => {
    const groupName = useMemo(() =>
            conversation.title || 'Group Chat',
        [conversation.title]
    );

    const lastMessage = useMemo(() =>
            conversation.lastMessage?.text || 'No messages yet',
        [conversation.lastMessage?.text]
    );

    const avatarLetter = useMemo(() =>
            groupName.charAt(0).toUpperCase(),
        [groupName]
    );

    const memberCount = useMemo(() =>
            conversation.participants?.length || 0,
        [conversation.participants?.length]
    );

    const handlePress = useCallback(() => {
        onPress(conversation);
    }, [onPress, conversation]);

    return (
        <TouchableOpacity
            style={styles.groupCard}
            onPress={handlePress}
            activeOpacity={0.7}
        >
            <View style={styles.avatarContainer}>
                <Text style={styles.avatarText}>{avatarLetter}</Text>
            </View>

            <View style={styles.groupInfo}>
                <Text style={styles.groupName} numberOfLines={1} ellipsizeMode="tail">
                    {groupName}
                </Text>
                <Text style={styles.memberCount}>
                    {memberCount} members
                </Text>
                <Text style={styles.lastMessage} numberOfLines={1} ellipsizeMode="tail">
                    {lastMessage}
                </Text>
            </View>

            <View style={styles.rightSection}>
                <UnreadBadge count={unreadCount} size="small" />
                <Text style={styles.chevron}>›</Text>
            </View>
        </TouchableOpacity>
    );
});

GroupChatCard.displayName = 'GroupChatCard';

const GroupChatListScreen = ({ currentUserId, onBack, onGroupChatPress, onCreateGroup }) => {
    const [groupChats, setGroupChats] = useState([]);
    const [unreadCounts, setUnreadCounts] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!currentUserId) return;

        const key = `groups_${currentUserId}`;
        const unsub = subscribeUserGroupsOrdered(
            currentUserId,
            (conversations) => {
                const unreadMap = {};
                conversations.forEach((c) => {
                    const cnt = (c.unreadCount && c.unreadCount[currentUserId]) || 0;
                    if (cnt > 0) unreadMap[c.id] = cnt;
                });

                setGroupChats(conversations);
                setUnreadCounts(unreadMap);
                setLoading(false);
            },
            (err) => {
                console.error('Error in group conversations subscription:', err);
                setError(err?.message || 'Subscription error');
                setLoading(false);
            }
        );

        registerListener(key, unsub);
        return () => cleanupListener(key);
    }, [currentUserId]);

    const handleGroupPress = useCallback((groupConversation) => {
        setUnreadCounts((prev) => {
            const next = { ...prev };
            delete next[groupConversation.id];
            return next;
        });
        onGroupChatPress(groupConversation);
    }, [onGroupChatPress]);

    const renderGroup = useCallback(({ item }) => (
        <GroupChatCard
            conversation={item}
            onPress={handleGroupPress}
            unreadCount={unreadCounts[item.id] || 0}
        />
    ), [handleGroupPress, unreadCounts]);

    const keyExtractor = useCallback((item) => item.id, []);

    const handleBack = useCallback(() => {
        onBack();
    }, [onBack]);

    const handleCreateGroup = useCallback(() => {
        onCreateGroup();
    }, [onCreateGroup]);

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleBack}>
                        <Text style={styles.backButton}>← Back</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Group Chats</Text>
                    <View style={styles.spacer} />
                </View>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#3b82f6" />
                    <Text style={styles.loadingText}>Loading group chats...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleBack}>
                        <Text style={styles.backButton}>← Back</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Group Chats</Text>
                    <View style={styles.spacer} />
                </View>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>Error: {error}</Text>
                    <Text style={styles.errorSubtext}>
                        Unable to load group chats
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack}>
                    <Text style={styles.backButton}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Group Chats</Text>
                <TouchableOpacity onPress={handleCreateGroup}>
                    <Text style={styles.createButton}>Create</Text>
                </TouchableOpacity>
            </View>

            {groupChats.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyIcon}>💬</Text>
                    <Text style={styles.emptyText}>No group chats yet</Text>
                    <Text style={styles.emptySubtext}>
                        Create a group to start chatting with multiple people
                    </Text>
                    <TouchableOpacity
                        style={styles.createGroupButton}
                        onPress={handleCreateGroup}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.createGroupButtonText}>Create Group Chat</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={groupChats}
                    renderItem={renderGroup}
                    keyExtractor={keyExtractor}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContainer}
                    removeClippedSubviews={true}
                    maxToRenderPerBatch={10}
                    updateCellsBatchingPeriod={50}
                    initialNumToRender={10}
                    windowSize={5}
                    getItemLayout={null}
                />
            )}
        </SafeAreaView>
    );
};

export default React.memo(GroupChatListScreen);