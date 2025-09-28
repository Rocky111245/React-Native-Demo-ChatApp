// src/components/OnlineIndicator.styles.js
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: -1,
        right: -1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    indicator: {
        borderWidth: 2,
        borderColor: '#ffffff',
        zIndex: 2,
        backgroundColor: '#28a745',
        shadowColor: '#28a745',
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 2,
    },
    pulse: {
        position: 'absolute',
        backgroundColor: '#28a745',
        opacity: 0.4,
        zIndex: 1,
        borderRadius: 999,
    },
});