// src/components/MessagesList.js
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList,
  ActivityIndicator
} from 'react-native';
import { subscribeMessagesByConversationAsc, registerListener, cleanupListener } from '../services/firestoreApi';
import styles from './MessagesList.styles';

const MessageBubble = ({ message, isCurrentUser }) => {
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    
    // Handle Firestore timestamp
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

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
          {formatTime(message.timestamp)}
        </Text>
      </View>
    </View>
  );
};

const MessagesList = ({ conversationId, currentUserId }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
  if (!conversationId) { setLoading(false); return; }

  console.log('Setting up real-time message listener for:', conversationId);

  const unsub = subscribeMessagesByConversationAsc(
    conversationId,
    (items) => {
      setMessages(items);
      setLoading(false);
    },
    (err) => {
      console.error('Error in message subscription:', err);
      setError(err?.message || 'Subscription error');
      setLoading(false);
    }
  );

  
  registerListener(`messages_${conversationId}`, unsub);

  return () => {
    console.log('Cleaning up message subscription');
    cleanupListener(`messages_${conversationId}`); // calls unsub()
  };
}, [conversationId]);


  const renderMessage = ({ item }) => {
    const isCurrentUser = item.senderId === currentUserId;
    return (
      <MessageBubble 
        message={item} 
        isCurrentUser={isCurrentUser}
      />
    );
  };

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
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default MessagesList;