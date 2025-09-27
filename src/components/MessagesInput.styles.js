// src/components/MessageInput.styles.js
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#f8f9fa',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#212529',
    maxHeight: 100,
    paddingVertical: 8,
    paddingRight: 12,
    textAlignVertical: 'top',
  },
  sendButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonEnabled: {
    backgroundColor: '#3b82f6',
  },
  sendButtonDisabled: {
    backgroundColor: '#e5e7eb',
  },
  sendIcon: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 18,
    textAlign: 'center',
  },
  sendIconEnabled: {
    color: '#ffffff',
  },
  sendIconDisabled: {
    color: '#9ca3af',
  },
});