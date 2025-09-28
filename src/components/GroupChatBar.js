// src/components/GroupChatBar.js
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from './GroupChatBar.styles';

const GroupChatBar = ({ onPress, unreadGroupCount = 0 }) => {
    return (
        <TouchableOpacity
            style={styles.container}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.content}>
                <View style={styles.leftSection}>
                    <Text style={styles.icon}>💬</Text>
                    <View style={styles.textContainer}>
                        <Text style={styles.title}>Group Chats</Text>
                        <Text style={styles.subtitle}>Create or join group conversations</Text>
                    </View>
                </View>

                <View style={styles.rightSection}>
                    {unreadGroupCount > 0 && (
                        <View style={styles.unreadBadge}>
                            <Text style={styles.unreadText}>
                                {unreadGroupCount > 99 ? '99+' : unreadGroupCount}
                            </Text>
                        </View>
                    )}
                    <Text style={styles.chevron}>›</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default GroupChatBar;