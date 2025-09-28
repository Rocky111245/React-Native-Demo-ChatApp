// src/components/MessagesInput.styles.js
import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const isSmallScreen = width < 375;

export default StyleSheet.create({
    keyboardContainer: {
        backgroundColor: '#ffffff',
    },
    container: {
        backgroundColor: '#ffffff',
        borderTopWidth: 1,
        borderTopColor: '#f1f3f4',
        paddingHorizontal: isSmallScreen ? 12 : 16,
        paddingVertical: isSmallScreen ? 8 : 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 4,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        backgroundColor: '#f8f9fa',
        borderRadius: 24,
        paddingHorizontal: isSmallScreen ? 12 : 16,
        paddingVertical: isSmallScreen ? 6 : 8,
        borderWidth: 1,
        borderColor: '#e9ecef',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    textInput: {
        flex: 1,
        fontSize: isSmallScreen ? 15 : 16,
        color: '#2c3e50',
        maxHeight: 100,
        paddingVertical: isSmallScreen ? 6 : 8,
        paddingRight: 12,
        textAlignVertical: 'top',
        fontWeight: '400',
    },
    sendButton: {
        width: isSmallScreen ? 30 : 32,
        height: isSmallScreen ? 30 : 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    sendButtonEnabled: {
        backgroundColor: '#4a90e2',
        shadowColor: '#4a90e2',
    },
    sendButtonDisabled: {
        backgroundColor: '#e9ecef',
    },
    sendIcon: {
        fontSize: isSmallScreen ? 16 : 18,
        fontWeight: '600',
        lineHeight: isSmallScreen ? 16 : 18,
        textAlign: 'center',
    },
    sendIconEnabled: {
        color: '#ffffff',
    },
    sendIconDisabled: {
        color: '#adb5bd',
    },
});