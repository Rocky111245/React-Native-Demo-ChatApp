import { StyleSheet, Platform, Dimensions } from 'react-native';

const { height: H } = Dimensions.get('window');
const isSmall = H < 700;

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        paddingHorizontal: 20,
        paddingVertical: isSmall ? 12 : 16,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 2, shadowOffset: { width: 0, height: 1 } },
            android: { elevation: 2 },
            default: {},
        }),
    },
    headerTitle: {
        fontSize: isSmall ? 20 : 24,
        fontWeight: '700',
        color: '#212529',
        textAlign: 'center',
    },

    userCard: {
        alignSelf: 'center',
        width: '100%',
        maxWidth: 720,
        backgroundColor: '#ffffff',
        marginHorizontal: 16,
        marginTop: 16,
        borderRadius: 12,
        padding: isSmall ? 16 : 20,
        alignItems: 'center',
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
            android: { elevation: 3 },
            default: {},
        }),
    },

    avatarContainer: { position: 'relative', marginBottom: isSmall ? 10 : 12 },
    avatarText: {
        width: isSmall ? 56 : 64,
        height: isSmall ? 56 : 64,
        borderRadius: isSmall ? 28 : 32,
        backgroundColor: '#007bff',
        color: '#ffffff',
        fontSize: isSmall ? 22 : 26,
        fontWeight: '600',
        textAlign: 'center',
        textAlignVertical: 'center',
        lineHeight: isSmall ? 56 : 64,
    },
    userDetails: { alignItems: 'center', width: '100%' },
    displayName: { fontSize: isSmall ? 18 : 20, fontWeight: '600', color: '#212529', marginBottom: 2, textAlign: 'center' },
    email: { fontSize: isSmall ? 13 : 14, color: '#6c757d', marginBottom: isSmall ? 6 : 8, textAlign: 'center' },
    statusContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#d4edda', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
    onlineIndicator: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#28a745', marginRight: 4 },
    statusText: { fontSize: 11, fontWeight: '500', color: '#155724' },

    usersListContainer: {
        flex: 1,
        minHeight: 0,
        alignSelf: 'center',
        width: '100%',
        maxWidth: 720,
        marginTop: 8,
        marginBottom: 8,
    },

    actionsContainer: {
        paddingHorizontal: 16,
        paddingVertical: isSmall ? 12 : 16,
        backgroundColor: '#f8f9fa',
        borderTopWidth: 1,
        borderTopColor: '#e9ecef',
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 3, shadowOffset: { width: 0, height: -2 } },
            android: { elevation: 3 },
            default: {},
        }),
    },
    logoutButton: {
        backgroundColor: '#dc3545',
        paddingVertical: isSmall ? 14 : 16,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoutText: { color: '#ffffff', fontSize: isSmall ? 15 : 16, fontWeight: '600' },
    loadingScreen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
    },
});
