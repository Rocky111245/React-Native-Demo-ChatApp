// src/screens/GroupChatListScreen.styles.js
import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const isSmallScreen = width < 375;

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: isSmallScreen ? 16 : 20,
        paddingVertical: isSmallScreen ? 12 : 16,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#f1f3f4',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 4,
    },
    backButton: {
        color: '#4a90e2',
        fontSize: isSmallScreen ? 15 : 16,
        fontWeight: '600',
    },
    headerTitle: {
        fontSize: isSmallScreen ? 17 : 18,
        fontWeight: '700',
        color: '#1a1d29',
    },
    createButton: {
        color: '#4a90e2',
        fontSize: isSmallScreen ? 15 : 16,
        fontWeight: '600',
    },
    spacer: {
        width: 50,
    },
    listContainer: {
        paddingHorizontal: isSmallScreen ? 12 : 16,
        paddingTop: 16,
    },
    groupCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        padding: isSmallScreen ? 12 : 16,
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#f1f3f4',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    avatarContainer: {
        marginRight: 12,
    },
    avatarText: {
        width: isSmallScreen ? 44 : 48,
        height: isSmallScreen ? 44 : 48,
        borderRadius: isSmallScreen ? 22 : 24,
        backgroundColor: '#ff6b6b',
        color: '#ffffff',
        fontSize: isSmallScreen ? 16 : 18,
        fontWeight: '700',
        textAlign: 'center',
        textAlignVertical: 'center',
        lineHeight: isSmallScreen ? 44 : 48,
        shadowColor: '#ff6b6b',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    groupInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    groupName: {
        fontSize: isSmallScreen ? 15 : 16,
        fontWeight: '700',
        color: '#1a1d29',
        marginBottom: 2,
        lineHeight: isSmallScreen ? 18 : 20,
    },
    memberCount: {
        fontSize: isSmallScreen ? 11 : 12,
        color: '#6c757d',
        marginBottom: 4,
        fontWeight: '500',
    },
    lastMessage: {
        fontSize: isSmallScreen ? 13 : 14,
        color: '#6c757d',
        fontWeight: '400',
        lineHeight: isSmallScreen ? 16 : 18,
    },
    rightSection: {
        alignItems: 'center',
        position: 'relative',
    },
    chevron: {
        fontSize: isSmallScreen ? 16 : 18,
        color: '#adb5bd',
        marginTop: 4,
        fontWeight: '600',
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