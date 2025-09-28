// src/screens/GroupCreationScreen.js
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import OnlineIndicator from '../components/OnlineIndicator';
import {
    listUsersOrderedByName,
    participantsKey,
    findGroupByParticipantsKey,
    createGroupConversation,
} from '../services/firestoreApi';
import styles from './GroupCreationScreen.styles';

const SelectableUserCard = ({ user, isSelected, onToggle }) => {
    const displayName = user.displayName || user.email?.split('@')[0] || 'Unknown';
    const avatarLetter = displayName.charAt(0).toUpperCase();

    return (
        <TouchableOpacity
            style={[styles.userCard, isSelected && styles.selectedUserCard]}
            onPress={() => onToggle(user)}
            activeOpacity={0.7}
        >
            <View style={styles.checkboxContainer}>
                <View style={[styles.checkbox, isSelected && styles.checkedBox]}>
                    {isSelected ? <Text style={styles.checkmark}>✓</Text> : null}
                </View>
            </View>

            <View style={styles.avatarContainer}>
                <Text style={styles.avatarText}>{avatarLetter}</Text>
                <OnlineIndicator isOnline={user.isOnline} size={10} />
            </View>

            <View style={styles.userInfo}>
                <Text style={styles.userName} numberOfLines={1} ellipsizeMode="tail">
                    {displayName}
                </Text>
                <Text style={styles.userEmail} numberOfLines={1} ellipsizeMode="tail">
                    {user.email}
                </Text>

                <View style={styles.statusContainer}>
                    <View
                        style={[
                            styles.statusDot,
                            { backgroundColor: user.isOnline ? '#10b981' : '#6b7280' },
                        ]}
                    />
                    <Text style={styles.statusText}>
                        {user.isOnline ? 'Online' : 'Offline'}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const SelectedUserChip = ({ user, onRemove }) => {
    const displayName = user.displayName || user.email?.split('@')[0] || 'Unknown';
    return (
        <View style={styles.chip}>
            <Text style={styles.chipText} numberOfLines={1} ellipsizeMode="tail">
                {displayName}
            </Text>
            <TouchableOpacity
                style={styles.chipRemove}
                onPress={() => onRemove(user)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
                <Text style={styles.chipRemoveText}>×</Text>
            </TouchableOpacity>
        </View>
    );
};

const GroupCreationScreen = ({ currentUserId, onBack, onCreateGroup }) => {
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [groupName, setGroupName] = useState('');
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState(null);

    // Fetch users
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const allUsers = await listUsersOrderedByName();
                const otherUsers = allUsers.filter((u) => u.uid !== currentUserId && u.id !== currentUserId);
                setUsers(otherUsers);
            } catch (err) {
                setError(err.message || 'Failed to load users');
            } finally {
                setLoading(false);
            }
        };
        if (currentUserId) fetchUsers();
    }, [currentUserId]);

    const handleToggleUser = (user) => {
        setSelectedUsers((prev) => {
            const exists = prev.some((u) => u.uid === user.uid);
            return exists ? prev.filter((u) => u.uid !== user.uid) : [...prev, user];
        });
    };

    const handleRemoveUser = (user) => {
        setSelectedUsers((prev) => prev.filter((u) => u.uid !== user.uid));
    };

    const handleCreateGroup = async () => {
        // Require at least 2 others → group size >= 3 including me
        if (selectedUsers.length < 2) {
            Alert.alert('Select more people', 'Pick at least two members to start a group.');
            return;
        }
        if (!groupName.trim()) {
            Alert.alert('Name required', 'Please enter a group name.');
            return;
        }

        setCreating(true);
        try {
            const participantUids = [currentUserId, ...selectedUsers.map((u) => u.uid)];
            const pKey = participantsKey(participantUids);

            // De-duplicate by participant set
            const existing = await findGroupByParticipantsKey(pKey);
            const group =
                existing ||
                (await createGroupConversation({
                    title: groupName.trim(),
                    participants: participantUids,
                    createdBy: currentUserId,
                }));

            // Hand back to parent (it can navigate to list or open the chat)
            onCreateGroup?.(group);
        } catch (e) {
            console.error('Error creating group:', e);
            Alert.alert('Error', e?.message || 'Failed to create group. Please try again.');
        } finally {
            setCreating(false);
        }
    };

    const suggestedName = React.useMemo(() => {
        if (selectedUsers.length === 0) return '';
        const names = selectedUsers
            .map((u) => u.displayName || u.email?.split('@')[0] || 'User')
            .slice(0, 3);
        return names.join(', ') + (selectedUsers.length > 3 ? '...' : '');
    }, [selectedUsers]);

    const renderUser = ({ item }) => (
        <SelectableUserCard
            user={item}
            isSelected={selectedUsers.some((u) => u.uid === item.uid)}
            onToggle={handleToggleUser}
        />
    );

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={onBack}>
                        <Text style={styles.backButton}>← Cancel</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Create Group</Text>
                    <View style={styles.spacer} />
                </View>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#3b82f6" />
                    <Text style={styles.loadingText}>Loading users...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={onBack}>
                        <Text style={styles.backButton}>← Cancel</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Create Group</Text>
                    <View style={styles.spacer} />
                </View>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>Error: {error}</Text>
                    <Text style={styles.errorSubtext}>Unable to load users</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack}>
                    <Text style={styles.backButton}>← Cancel</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Create Group</Text>
                <TouchableOpacity
                    onPress={handleCreateGroup}
                    disabled={selectedUsers.length < 2 || !groupName.trim() || creating}
                >
                    <Text
                        style={[
                            styles.createButton,
                            (selectedUsers.length < 2 || !groupName.trim() || creating) && styles.disabledButton,
                        ]}
                    >
                        {creating ? 'Creating...' : 'Create'}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Group Name Input */}
            <View style={styles.groupNameSection}>
                <Text style={styles.sectionTitle}>Group Name</Text>
                <TextInput
                    style={styles.groupNameInput}
                    placeholder={suggestedName || 'Enter group name'}
                    value={groupName}
                    onChangeText={setGroupName}
                    maxLength={50}
                    editable={!creating}
                />
            </View>

            {/* Selected Users */}
            {selectedUsers.length > 0 && (
                <View style={styles.selectedSection}>
                    <Text style={styles.sectionTitle}>
                        Selected ({selectedUsers.length})
                    </Text>
                    <View style={styles.chipsContainer}>
                        {selectedUsers.map((user) => (
                            <SelectedUserChip key={user.uid} user={user} onRemove={handleRemoveUser} />
                        ))}
                    </View>
                </View>
            )}

            {/* Users List */}
            <View style={styles.usersSection}>
                <Text style={styles.sectionTitle}>Select Users</Text>
                {users.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No users found</Text>
                    </View>
                ) : (
                    <FlatList
                        data={users}
                        renderItem={renderUser}
                        keyExtractor={(item) => item.uid || item.id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.usersList}
                    />
                )}
            </View>
        </SafeAreaView>
    );
};

export default GroupCreationScreen;
