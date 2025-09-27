import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width } = Dimensions.get('window');

// Blue-based palette: sleek, light but rich
const COLORS = {
    bgTop: '#e0f2fe',        // light sky blue (top gradient start)
    bgBottom: '#f8fafc',     // soft neutral (bottom gradient fade)
    card: '#ffffff',         // card surface
    primary: '#2563eb',      // bright blue
    primaryDark: '#1e40af',  // navy blue
    primaryLight: '#3b82f6', // softer blue for hover/focus
    text: '#0f172a',         // dark navy-gray
    textDim: '#475569',      // muted gray-blue
    inputBg: '#f1f5f9',      // light slate background
    inputBorder: '#cbd5e1',  // slate-300
    inputFocus: '#3b82f6',   // bright focus ring
    error: '#ef4444',        // red-500
};

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.bgBottom,
    },
    keyboardContainer: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingVertical: 32,
    },
    header: {
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 30,
        fontWeight: '800',
        color: COLORS.primaryDark,
        marginBottom: 6,
        textAlign: 'center',
        letterSpacing: 0.5,
    },
    subtitle: {
        fontSize: 15,
        color: COLORS.textDim,
        textAlign: 'center',
        lineHeight: 22,
    },

    card: {
        width: '100%',
        backgroundColor: COLORS.card,
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        shadowColor: COLORS.primaryDark,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: Platform.OS === 'ios' ? 0.12 : 0.2,
        shadowRadius: 12,
        elevation: 4,
        marginBottom: 20,
    },

    inputContainer: {
        marginBottom: 18,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: 6,
    },
    input: {
        height: 52,
        backgroundColor: COLORS.inputBg,
        borderWidth: 1,
        borderColor: COLORS.inputBorder,
        borderRadius: 12,
        paddingHorizontal: 14,
        fontSize: 16,
        color: COLORS.text,
    },
    inputFocus: {
        borderColor: COLORS.inputFocus,
        shadowColor: COLORS.inputFocus,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 2,
    },
    inputError: {
        borderColor: COLORS.error,
    },
    errorText: {
        marginTop: 6,
        color: COLORS.error,
        fontSize: 13,
        fontWeight: '500',
    },

    submitButton: {
        height: 52,
        backgroundColor: COLORS.primary,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 4,
    },
    disabledButton: {
        backgroundColor: COLORS.primaryDark,
        opacity: 0.7,
        shadowOpacity: 0,
        elevation: 0,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.5,
    },

    toggleContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 18,
    },
    toggleText: {
        fontSize: 14,
        color: COLORS.textDim,
        marginRight: 6,
    },
    toggleLink: {
        fontSize: 14,
        color: COLORS.primaryLight,
        fontWeight: '700',
    },
});
