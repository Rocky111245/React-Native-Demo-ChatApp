// src/components/ChatHeader.js
import { View, Text, TouchableOpacity } from 'react-native';
import OnlineIndicator from './OnlineIndicator';
import styles from './ChatHeader.styles';

const ChatHeader = ({ user, onClose }) => {
    // Detect group objects coming from the group list
    const isGroup = !!user && (user.type === 'group' || Array.isArray(user?.participants));

    // Title + subtitle
    const displayName = isGroup
        ? (user.title || 'Group')
        : (user.displayName || user.email?.split('@')[0] || 'Unknown');

    const subtitle = isGroup
        ? `${user?.participants?.length || 0} members`
        : (user?.isOnline ? 'Online' : 'Offline');

    // Avatar letter taken from the resolved title
    const avatarLetter = (displayName || 'U').charAt(0).toUpperCase();

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.closeButton}
                onPress={onClose}
                activeOpacity={0.7}
            >
                <Text style={styles.closeIcon}>←</Text>
            </TouchableOpacity>

            <View style={styles.userInfo}>
                <View style={styles.avatarContainer}>
                    <Text style={styles.avatarText}>{avatarLetter}</Text>
                    {/* Show presence only for direct chats */}
                    {!isGroup && <OnlineIndicator isOnline={!!user?.isOnline} size={10} />}
                </View>

                <View style={styles.userDetails}>
                    <Text style={styles.userName} numberOfLines={1} ellipsizeMode="tail">
                        {displayName}
                    </Text>
                    <Text style={styles.userStatus} numberOfLines={1} ellipsizeMode="tail">
                        {subtitle}
                    </Text>
                </View>
            </View>

            <View style={styles.spacer} />
        </View>
    );
};

export default ChatHeader;
