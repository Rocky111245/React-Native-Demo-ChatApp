// src/screens/UserProfileScreen.js
import React, { Suspense, useCallback, useMemo, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StatusBar,
    ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import OnlineIndicator from '../components/OnlineIndicator';
import UsersList from '../components/UsersList';
import GroupChatBar from '../components/GroupChatBar';
import styles from './UserProfileScreen.styles';

// Lazy load heavy screen components
const ChatScreen = React.lazy(() => import('./ChatScreen'));
const GroupChatListScreen = React.lazy(() => import('./GroupChatListScreen'));
const GroupCreationScreen = React.lazy(() => import('./GroupCreationScreen'));

// Loading fallback component
const ScreenLoader = React.memo(() => (
    <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color="#007AFF" />
    </View>
));

ScreenLoader.displayName = 'ScreenLoader';

const UserProfileScreen = () => {
    const { user, logout } = useAuth();
    const [currentScreen, setCurrentScreen] = useState('profile');
    const [selectedUser, setSelectedUser] = useState(null);
    const [unreadGroupCount, setUnreadGroupCount] = useState(0);

    const displayName = useMemo(() => {
        if (!user?.email) return '';
        return user.email.split('@')[0];
    }, [user?.email]);

    const avatarLetter = useMemo(() =>
            displayName.charAt(0).toUpperCase(),
        [displayName]
    );


//console logs are added just for debugging,they are useful.
    const handleUserChatPress = useCallback((otherUser) => {
        console.log('Opening chat with:', otherUser.displayName);
        setSelectedUser(otherUser);
        setCurrentScreen('chat');
    }, []);

    const handleGroupChatBarPress = useCallback(() => {
        console.log('Opening group chats');
        setCurrentScreen('groupList');
    }, []);

    const handleGroupChatPress = useCallback((groupConversation) => {
        console.log('Opening group chat conversation:', groupConversation.id);
        setSelectedUser(groupConversation);
        setCurrentScreen('groupChat');
    }, []);

    const handleCreateGroupPress = useCallback(() => {
        console.log('Opening group creation');
        setCurrentScreen('groupCreation');
    }, []);

    const handleCreateGroup = useCallback(async (groupData) => {
        console.log('Creating group with data:', groupData);
        setCurrentScreen('groupList');
    }, []);

    const handleBackToGroupList = useCallback(() => {
        setCurrentScreen('groupList');
    }, []);

    const handleCloseGroupChat = useCallback(() => {
        console.log('Closing group chat');
        setCurrentScreen('groupList');
        setSelectedUser(null);
    }, []);

    const handleConversationRead = useCallback((otherUserId) => {
        console.log('Conversation read with user:', otherUserId);
    }, []);

    const handleCloseChat = useCallback(() => {
        console.log('Closing chat');
        setCurrentScreen('profile');
        setSelectedUser(null);
    }, []);

    const handleBackToProfile = useCallback(() => {
        setCurrentScreen('profile');
    }, []);

    const handleLogout = useCallback(() => {
        logout();
    }, [logout]);

    if (currentScreen === 'chat' && selectedUser) {
        return (
            <Suspense fallback={<ScreenLoader />}>
                <ChatScreen
                    otherUser={selectedUser}
                    currentUserId={user?.uid}
                    currentUserName={displayName}
                    onClose={handleCloseChat}
                    onConversationRead={handleConversationRead}
                />
            </Suspense>
        );
    }

    if (currentScreen === 'groupList') {
        return (
            <Suspense fallback={<ScreenLoader />}>
                <GroupChatListScreen
                    currentUserId={user?.uid}
                    onBack={handleBackToProfile}
                    onGroupChatPress={handleGroupChatPress}
                    onCreateGroup={handleCreateGroupPress}
                />
            </Suspense>
        );
    }

    if (currentScreen === 'groupCreation') {
        return (
            <Suspense fallback={<ScreenLoader />}>
                <GroupCreationScreen
                    currentUserId={user?.uid}
                    onBack={handleBackToGroupList}
                    onCreateGroup={handleCreateGroup}
                />
            </Suspense>
        );
    }

    if (currentScreen === 'groupChat' && selectedUser) {
        return (
            <Suspense fallback={<ScreenLoader />}>
                <ChatScreen
                    otherUser={selectedUser}
                    currentUserId={user?.uid}
                    currentUserName={displayName}
                    onClose={handleCloseGroupChat}
                    onConversationRead={handleConversationRead}
                />
            </Suspense>
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
                        {avatarLetter}
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

            <GroupChatBar
                onPress={handleGroupChatBarPress}
                unreadGroupCount={unreadGroupCount}
            />

            <View style={styles.usersListContainer}>
                <UsersList
                    currentUserId={user?.uid}
                    onUserChatPress={handleUserChatPress}
                />
            </View>

            <View style={styles.actionsContainer}>
                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={handleLogout}
                    activeOpacity={0.8}
                >
                    <Text style={styles.logoutText}>Sign Out</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default React.memo(UserProfileScreen);