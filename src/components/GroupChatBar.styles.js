import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
    container: {
        alignSelf: 'center',
        width: '100%',
        maxWidth: 720,
        marginHorizontal: 16,
        marginTop: 12,
        marginBottom: 12,
        borderRadius: 12,
        backgroundColor: '#ffffff',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOpacity: 0.06,
                shadowRadius: 6,
                shadowOffset: { width: 0, height: 3 },
            },
            android: { elevation: 3 },
            default: {
                shadowColor: '#000',
                shadowOpacity: 0.05,
                shadowRadius: 6,
                shadowOffset: { width: 0, height: 3 },
            },
        }),
    },

    // Let content size itself; no fixed height
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 12,
        justifyContent: 'space-between',
        gap: 8,
    },

    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flexShrink: 1,
        gap: 10,
    },

    icon: {
        fontSize: 22,
        lineHeight: 24,
    },

    textContainer: {
        flexShrink: 1,
        minWidth: 0,
    },

    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#212529',
        marginBottom: 2,
    },

    subtitle: {
        fontSize: 12,
        color: '#6c757d',
    },

    rightSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 8,
    },

    unreadBadge: {
        backgroundColor: '#dc3545',
        borderRadius: 10,
        minWidth: 20,
        paddingHorizontal: 6,
        paddingVertical: 2,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 6,
    },

    unreadText: {
        color: '#ffffff',
        fontSize: 12,
        fontWeight: '700',
    },

    chevron: {
        fontSize: 20,
        color: '#6c757d',
        fontWeight: '300',
        lineHeight: 20,
    },
});
