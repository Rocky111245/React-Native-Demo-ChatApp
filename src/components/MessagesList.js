// src/components/MessagesList.js
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
    View,
    Text,
    FlatList,
    ActivityIndicator
} from 'react-native';
import { subscribeMessagesByConversationAsc, registerListener, cleanupListener } from '../services/firestoreApi';
import styles from './MessagesList.styles';

const MessageBubble = React.memo(({ message, isCurrentUser }) => {
    const formatTime = useCallback((timestamp) => {
        if (!timestamp) return '';

        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
    }, []);

    const formattedTime = useMemo(() => formatTime(message.timestamp), [message.timestamp, formatTime]);

    return (
        <View style={[
            styles.messageContainer,
            isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage
        ]}>
            <View style={[
                styles.messageBubble,
                isCurrentUser ? styles.currentUserBubble : styles.otherUserBubble
            ]}>
                <Text style={[
                    styles.messageText,
                    isCurrentUser ? styles.currentUserText : styles.otherUserText
                ]}>
                    {message.text}
                </Text>
                <Text style={[
                    styles.timestamp,
                    isCurrentUser ? styles.currentUserTimestamp : styles.otherUserTimestamp
                ]}>
                    {formattedTime}
                </Text>
            </View>
        </View>
    );
});

MessageBubble.displayName = 'MessageBubble';

const MessagesList = ({ conversationId, currentUserId }) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const flatListRef = useRef(null);

    useEffect(() => {
        if (!conversationId) {
            setLoading(false);
            return;
        }

        const unsub = subscribeMessagesByConversationAsc(
            conversationId,
            (items) => {
                setMessages(items);
                setLoading(false);
            },
            (err) => {
                setError(err?.message || 'Subscription error');
                setLoading(false);
            }
        );

        registerListener(`messages_${conversationId}`, unsub);

        return () => {
            cleanupListener(`messages_${conversationId}`);
        };
    }, [conversationId]);

    // Auto-scroll to bottom when messages update
    useEffect(() => {
        if (messages.length > 0 && flatListRef.current) {
            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
            }, 100);
        }
    }, [messages.length]);

    const renderMessage = useCallback(({ item }) => {
        const isCurrentUser = item.senderId === currentUserId;
        return (
            <MessageBubble
                message={item}
                isCurrentUser={isCurrentUser}
            />
        );
    }, [currentUserId]);

    const keyExtractor = useCallback((item) => item.id, []);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3b82f6" />
                <Text style={styles.loadingText}>Loading messages...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.errorText}>Error loading messages</Text>
                <Text style={styles.emptySubtext}>{error}</Text>
            </View>
        );
    }

    if (messages.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No messages yet</Text>
                <Text style={styles.emptySubtext}>Start the conversation!</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderMessage}
                keyExtractor={keyExtractor}
                contentContainerStyle={styles.messagesList}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                removeClippedSubviews={true}
                maxToRenderPerBatch={10}
                updateCellsBatchingPeriod={50}
                initialNumToRender={15}
                windowSize={10}
                getItemLayout={null}
            />
        </View>
    );
};

export default React.memo(MessagesList);