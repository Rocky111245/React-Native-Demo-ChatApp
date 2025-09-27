// src/screens/ChatScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StatusBar } from 'react-native';
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
} from '../services/firestoreApi';
import styles from './ChatScreen.styles';

/**
 * Props:
 * - otherUser: { uid, displayName, ... }
 * - currentUserId: string
 * - currentUserName: string          <-- passed from parent
 * - onClose: () => void
 * - onConversationRead?: (otherUserId: string) => void
 */
const ChatScreen = ({ otherUser, currentUserId, currentUserName, onClose, onConversationRead }) => {
  const [conversation, setConversation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeConversation = async () => {
      try {
        const conv = await getExistingDirectConversationOrCreateNew(currentUserId, otherUser.uid);
        setConversation(conv);

        // Mark as read on open
        await markConversationReadForUser(conv.id, currentUserId);
        onConversationRead?.(otherUser.uid);
      } catch (error) {
        console.error('Error initializing conversation:', error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUserId && otherUser?.uid) {
      initializeConversation();
    }
  }, [currentUserId, otherUser?.uid, onConversationRead]);

  const handleSendMessage = async (messageText) => {
    if (!conversation) return;
    const text = String(messageText).trim();
    if (!text) return;

    try {
      // Client-side throttle (UX guard)
      if (!canSendMessageNow(currentUserId)) {
        alert('Please wait a moment before sending another message');
        return;
      }

      // Build message + atomic append & unread bump
      const msgRef = createNewMessageDocRef();
      const payload = buildPlainTextMessagePayload({
        conversationId: conversation.id,
        senderId: currentUserId,
        senderName: currentUserName || 'Unknown',
        text,
      });

      // Find recipient for unread++
      const recipientId = conversation.participants?.find((id) => id !== currentUserId);
      await appendMessageAndBumpUnreadTxn(msgRef, conversation.id, payload, recipientId);
    } catch (error) {
      console.error('Error sending message:', error);
      const msg = (error?.message || '').toLowerCase();
      if (msg.includes('rate')) alert('Please wait a moment before sending another message');
      else if (msg.includes('long')) alert('Message is too long. Please keep it under 1000 characters');
      else if (msg.includes('empty')) alert('Please enter a message');
      else alert('Failed to send message. Please try again');
    }
  };

  const handleCloseChat = () => onClose?.();

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
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <ChatHeader user={otherUser} onClose={handleCloseChat} />
      <MessagesList conversationId={conversation?.id} currentUserId={currentUserId} />
      <MessagesInput onSendMessage={handleSendMessage} />
    </SafeAreaView>
  );
};

export default ChatScreen;
