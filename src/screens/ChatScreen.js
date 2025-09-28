// src/screens/ChatScreen.js
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { View, Text, StatusBar, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ChatHeader from '../components/ChatHeader';
import MessagesList from '../components/MessagesList';
import MessagesInput from '../components/MessagesInput';
import {
    getExistingDirectConversationOrCreateNew,
    markConversationReadForUser,
    createNewMessageDocRef,
    buildPlainTextMessagePayload,
    appendMessageAndBumpUnreadTxn,
    canSendMessageNow,
    markGroupConversationReadForUser,
    appendGroupMessageAndBumpUnreadTxn,
} from '../services/firestoreApi';
import styles from './ChatScreen.styles';

/**
 * Props:
 * - otherUser:
 *     DIRECT: { uid, displayName, email, ... }
 *     GROUP:  { id, type:'group', title?, participants: string[], ... }
 * - currentUserId: string
 * - currentUserName: string
 * - onClose: () => void
 * - onConversationRead?: (id: string) => void
 */
const ChatScreen = ({ otherUser, currentUserId, currentUserName, onClose, onConversationRead }) => {
    const isGroup = useMemo(
        () => !!otherUser && (otherUser.type === 'group' || Array.isArray(otherUser?.participants)),
        [otherUser]
    );

    const [conversation, setConversation] = useState(null);
    const [loading, setLoading] = useState(true);

    const openDirect = useCallback(async () => {
        try {
            const conv = await getExistingDirectConversationOrCreateNew(currentUserId, otherUser.uid);
            setConversation(conv);
            await markConversationReadForUser(conv.id, currentUserId);
            onConversationRead?.(otherUser.uid);
        } catch (error) {
            console.error('Error initializing direct conversation:', error);
        } finally {
            setLoading(false);
        }
    }, [currentUserId, otherUser.uid, onConversationRead]);

    const openGroup = useCallback(async () => {
        try {
            const conv = {
                id: otherUser.id,
                participants: otherUser.participants || [],
                type: 'group'
            };
            setConversation(conv);
            await markGroupConversationReadForUser(conv.id, currentUserId);
            onConversationRead?.(conv.id);
        } catch (error) {
            console.error('Error marking group read:', error);
        } finally {
            setLoading(false);
        }
    }, [otherUser.id, otherUser.participants, currentUserId, onConversationRead]);

    useEffect(() => {
        let cancelled = false;

        const initializeConversation = async () => {
            if (!currentUserId || !otherUser) return;

            setLoading(true);

            if (cancelled) return;

            if (isGroup) {
                await openGroup();
            } else if (otherUser?.uid) {
                await openDirect();
            } else {
                setLoading(false);
            }
        };

        initializeConversation();

        return () => {
            cancelled = true;
        };
    }, [currentUserId, otherUser, isGroup, openDirect, openGroup]);

    const handleSendMessage = useCallback(async (messageText) => {
        if (!conversation?.id) return;
        const text = String(messageText || '').trim();
        if (!text) return;

        try {
            if (!canSendMessageNow(currentUserId)) {
                alert('Please wait a moment before sending another message');
                return;
            }

            const payload = buildPlainTextMessagePayload({
                conversationId: conversation.id,
                senderId: currentUserId,
                senderName: currentUserName || 'Unknown',
                text,
            });

            if (isGroup) {
                await appendGroupMessageAndBumpUnreadTxn(conversation.id, payload, currentUserId);
            } else {
                const msgRef = createNewMessageDocRef();
                const recipientId = conversation.participants?.find((id) => id !== currentUserId) || otherUser?.uid;
                await appendMessageAndBumpUnreadTxn(msgRef, conversation.id, payload, recipientId);
            }
        } catch (error) {
            console.error('Error sending message:', error);
            const msg = (error?.message || '').toLowerCase();
            if (msg.includes('rate')) alert('Please wait a moment before sending another message');
            else if (msg.includes('long')) alert('Message is too long. Please keep it under 1000 characters');
            else if (msg.includes('empty')) alert('Please enter a message');
            else alert('Failed to send message. Please try again');
        }
    }, [conversation?.id, currentUserId, currentUserName, isGroup, otherUser?.uid]);

    const handleCloseChat = useCallback(() => {
        onClose?.();
    }, [onClose]);

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
                <ChatHeader user={otherUser} onClose={handleCloseChat} />
                <View style={styles.loadingContainer}>
                    <Text>Loading conversation...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
                <ChatHeader user={otherUser} onClose={handleCloseChat} />
                <MessagesList conversationId={conversation?.id} currentUserId={currentUserId} />
                <MessagesInput onSendMessage={handleSendMessage} />
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
};

export default React.memo(ChatScreen);