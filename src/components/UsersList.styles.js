// src/components/UsersList.styles.js
import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const isSmallScreen = screenWidth < 375;
const isLargeScreen = screenWidth > 414;

export default StyleSheet.create({
    container: {
        flex: 1,
        alignSelf: 'center',
        width: '100%',
        maxWidth: 720,
        backgroundColor: '#f8f9fa',
        paddingHorizontal: 16,
        paddingTop: 8,
        minHeight: 0,
    },

    header: {
        marginBottom: isSmallScreen ? 12 : 16,
        paddingHorizontal: 4,
    },
    headerTitle: {
        fontSize: isSmallScreen ? 18 : isLargeScreen ? 22 : 20,
        fontWeight: '600',
        color: '#212529',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: isSmallScreen ? 13 : 14,
        color: '#6c757d',
        lineHeight: isSmallScreen ? 18 : 20,
    },

    // This gives the Flatlist some space at bottom so it doesn't collide with footer
    listContainer: {
        paddingBottom: 16,
    },

    userCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        padding: isSmallScreen ? 12 : isLargeScreen ? 18 : 16,
        borderRadius: 12,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOpacity: 0.08,
                shadowRadius: 4,
                shadowOffset: { width: 0, height: 2 },
            },
            android: { elevation: 3 },
            default: {
                shadowColor: '#000',
                shadowOpacity: 0.06,
                shadowRadius: 4,
                shadowOffset: { width: 0, height: 2 },
            },
        }),
        minHeight: isSmallScreen ? 72 : isLargeScreen ? 88 : 80,
    },

    avatarContainer: {
        position: 'relative',
        marginRight: isSmallScreen ? 10 : 12,
    },
    avatarText: {
        width: isSmallScreen ? 40 : isLargeScreen ? 52 : 48,
        height: isSmallScreen ? 40 : isLargeScreen ? 52 : 48,
        borderRadius: isSmallScreen ? 20 : isLargeScreen ? 26 : 24,
        backgroundColor: '#3b82f6',
        color: '#ffffff',
        fontSize: isSmallScreen ? 16 : isLargeScreen ? 20 : 18,
        fontWeight: '600',
        textAlign: 'center',
        textAlignVertical: 'center',
        lineHeight: isSmallScreen ? 40 : isLargeScreen ? 52 : 48,
    },

    // Allow text block to shrink and ellipsize without pushing the chat icon off-screen
    userInfo: {
        flex: 1,
        paddingRight: 8,
        minWidth: 0,        // enables ellipsize inside flex rows
    },
    userName: {
        fontSize: isSmallScreen ? 15 : isLargeScreen ? 17 : 16,
        fontWeight: '600',
        color: '#212529',
        marginBottom: 2,
    },
    userEmail: {
        fontSize: isSmallScreen ? 13 : 14,
        color: '#6c757d',
        marginBottom: isSmallScreen ? 4 : 6,
    },

    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusDot: {
        width: isSmallScreen ? 5 : 6,
        height: isSmallScreen ? 5 : 6,
        borderRadius: isSmallScreen ? 2.5 : 3,
        marginRight: 6,
    },
    statusText: {
        fontSize: isSmallScreen ? 11 : 12,
        color: '#6c757d',
        fontWeight: '500',
    },

    chatIconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: isSmallScreen ? 36 : isLargeScreen ? 44 : 40,
        height: isSmallScreen ? 36 : isLargeScreen ? 44 : 40,
        borderRadius: isSmallScreen ? 18 : isLargeScreen ? 22 : 20,
        backgroundColor: '#3b82f6',
        marginLeft: 8,
    },
    chatIcon: {
        fontSize: isSmallScreen ? 16 : isLargeScreen ? 20 : 18,
        color: '#ffffff',
    },

    separator: {
        height: isSmallScreen ? 8 : isLargeScreen ? 16 : 12,
    },

    // Loading / error / empty states sized to feel balanced on any screen
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: Math.max(screenHeight * 0.1, 80),
        minHeight: 150,
    },
    loadingText: {
        marginTop: 16,
        fontSize: isSmallScreen ? 15 : 16,
        color: '#6c757d',
        textAlign: 'center',
    },

    errorContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: Math.max(screenHeight * 0.08, 64),
        paddingHorizontal: Math.min(screenWidth * 0.08, 40),
        minHeight: 120,
    },
    errorText: {
        fontSize: isSmallScreen ? 15 : 16,
        color: '#dc3545',
        textAlign: 'center',
        marginBottom: 8,
        lineHeight: 22,
    },
    errorSubtext: {
        fontSize: isSmallScreen ? 13 : 14,
        color: '#6c757d',
        textAlign: 'center',
        lineHeight: 20,
    },

    emptyContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: Math.max(screenHeight * 0.08, 64),
        paddingHorizontal: Math.min(screenWidth * 0.1, 48),
        minHeight: 120,
    },
    emptyText: {
        fontSize: isSmallScreen ? 15 : 16,
        color: '#6c757d',
        marginBottom: 8,
        textAlign: 'center',
    },
    emptySubtext: {
        fontSize: isSmallScreen ? 13 : 14,
        color: '#9ca3af',
        textAlign: 'center',
        lineHeight: 20,
    },
});
