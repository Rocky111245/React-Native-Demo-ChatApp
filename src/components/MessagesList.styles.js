// src/components/MessagesList.styles.js
import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const isSmallScreen = width < 375;

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    messagesList: {
        paddingHorizontal: isSmallScreen ? 12 : 16,
        paddingVertical: 8,
    },
    messageContainer: {
        marginVertical: 4,
    },
    currentUserMessage: {
        alignItems: 'flex-end',
    },
    otherUserMessage: {
        alignItems: 'flex-start',
    },
    messageBubble: {
        maxWidth: '80%',
        paddingHorizontal: isSmallScreen ? 12 : 16,
        paddingVertical: isSmallScreen ? 8 : 12,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    currentUserBubble: {
        backgroundColor: '#4a90e2',
        borderBottomRightRadius: 8,
        shadowColor: '#4a90e2',
        shadowOpacity: 0.2,
    },
    otherUserBubble: {
        backgroundColor: '#f8f9fa',
        borderBottomLeftRadius: 8,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    messageText: {
        fontSize: isSmallScreen ? 15 : 16,
        lineHeight: isSmallScreen ? 20 : 22,
        marginBottom: 4,
        fontWeight: '400',
    },
    currentUserText: {
        color: '#ffffff',
    },
    otherUserText: {
        color: '#2c3e50',
    },
    timestamp: {
        fontSize: isSmallScreen ? 11 : 12,
        fontWeight: '500',
        opacity: 0.8,
    },
    currentUserTimestamp: {
        color: 'rgba(255, 255, 255, 0.8)',
        textAlign: 'right',
    },
    otherUserTimestamp: {
        color: '#6c757d',
        textAlign: 'left',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    loadingText: {
        marginTop: 16,
        fontSize: isSmallScreen ? 15 : 16,
        color: '#6c757d',
        fontWeight: '500',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
        backgroundColor: '#ffffff',
    },
    emptyText: {
        fontSize: isSmallScreen ? 17 : 18,
        fontWeight: '600',
        color: '#2c3e50',
        marginBottom: 8,
        textAlign: 'center',
    },
    emptySubtext: {
        fontSize: isSmallScreen ? 14 : 15,
        color: '#6c757d',
        textAlign: 'center',
        lineHeight: 20,
    },
});