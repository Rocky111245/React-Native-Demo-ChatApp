// src/components/MessagesInput.js
import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import styles from './MessagesInput.styles';

const MessagesInput = ({ onSendMessage }) => {
  const [messageText, setMessageText] = useState('');

  const handleSend = () => {
    const trimmedText = messageText.trim();
    if (trimmedText.length > 0) {
      onSendMessage(trimmedText);
      setMessageText('');
    }
  };

  const isDisabled = messageText.trim().length === 0;

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      style={styles.keyboardContainer}
    >
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Type a message..."
            placeholderTextColor="#9ca3af"
            value={messageText}
            onChangeText={setMessageText}
            multiline
            maxLength={1000}
            returnKeyType="send"
            onSubmitEditing={handleSend}
            blurOnSubmit={false}
          />
          
          <TouchableOpacity
            style={[
              styles.sendButton,
              isDisabled ? styles.sendButtonDisabled : styles.sendButtonEnabled
            ]}
            onPress={handleSend}
            disabled={isDisabled}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.sendIcon,
              isDisabled ? styles.sendIconDisabled : styles.sendIconEnabled
            ]}>
              ↑
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default MessagesInput;