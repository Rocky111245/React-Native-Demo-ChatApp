// src/screens/GroupCreationScreen.styles.js
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
    },
    backButton: {
        color: '#3b82f6',
        fontSize: 16,
        fontWeight: '500',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#212529',
    },
    createButton: {
        color: '#3b82f6',
        fontSize: 16,
        fontWeight: '600',
    },
    disabledButton: {
        color: '#9ca3af',
    },
    spacer: {
        width: 70,
    },

    // Group Name Section
    groupNameSection: {
        backgroundColor: '#ffffff',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#212529',
        marginBottom: 8,
    },
    groupNameInput: {
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 12,
        fontSize: 16,
        backgroundColor: '#ffffff',
    },

    // Selected Users Section
    selectedSection: {
        backgroundColor: '#ffffff',
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
    },
    chipsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#3b82f6',
        borderRadius: 16,
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginBottom: 8,
    },
    chipText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '500',
    },
    chipRemove: {
        marginLeft: 6,
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    chipRemoveText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '600',
        lineHeight: 16,
    },

    // Users Section
    usersSection: {
        flex: 1,
        backgroundColor: '#ffffff',
        paddingHorizontal: 20,
        paddingTop: 16,
    },
    usersList: {
        paddingBottom: 20,
    },

    // User Card
    userCard: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderRadius: 8,
        marginBottom: 8,
    },
    selectedUserCard: {
        backgroundColor: '#f0f9ff',
    },
    checkboxContainer: {
        marginRight: 12,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#d1d5db',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
    },
    checkedBox: {
        borderColor: '#3b82f6',
        backgroundColor: '#3b82f6',
    },
    checkmark: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '600',
    },
    avatarContainer: {
        position: 'relative',
        marginRight: 12,
    },
    avatarText: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#3b82f6',
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
        textAlignVertical: 'center',
        lineHeight: 40,
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#212529',
        marginBottom: 2,
    },
    userEmail: {
        fontSize: 14,
        color: '#6c757d',
        marginBottom: 6,
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginRight: 6,
    },
    statusText: {
        fontSize: 12,
        color: '#6c757d',
        fontWeight: '500',
    },

    // Loading & Error States
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#6c757d',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
        paddingHorizontal: 20,
    },
    errorText: {
        fontSize: 16,
        color: '#dc3545',
        textAlign: 'center',
        marginBottom: 8,
    },
    errorSubtext: {
        fontSize: 14,
        color: '#6c757d',
        textAlign: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyText: {
        fontSize: 16,
        color: '#6c757d',
    },
});