import { StyleSheet, Dimensions } from 'react-native';

// Color palette based on two main colors
const colors = {
    // Primary color (main brand color)
    primary: '#6366F1', // Indigo
    primaryLight: '#818CF8',
    primaryDark: '#4F46E5',
    
    // Secondary color (accent color)
    secondary: '#10B981', // Emerald
    secondaryLight: '#34D399',
    secondaryDark: '#059669',
    
    // Neutral colors
    white: '#FFFFFF',
    gray50: '#F9FAFB',
    gray100: '#F3F4F6',
    gray200: '#E5E7EB',
    gray300: '#D1D5DB',
    gray400: '#9CA3AF',
    gray500: '#6B7280',
    gray600: '#4B5563',
    gray700: '#374151',
    gray800: '#1F2937',
    gray900: '#111827',
    
    // Semantic colors
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    info: '#3B82F6',
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    // Layout containers
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: "center",
        padding: 20,
        paddingTop: 80,
        paddingBottom: 60,
        width: '100%',
        backgroundColor: colors.white,
    },
    
    // Cover screen specific
    coverContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: "center",
        padding: 24,
        paddingTop: 80,
        width: '100%',
        backgroundColor: colors.white,
    },
    
    // Typography
    title: {
        fontSize: 32,
        fontWeight: "700",
        marginBottom: 32,
        color: colors.gray900,
        textAlign: 'center',
        letterSpacing: -0.5,
    },
    
    titleLarge: {
        fontSize: 36,
        fontWeight: "800",
        marginBottom: 24,
        color: colors.gray900,
        textAlign: 'center',
        letterSpacing: -1,
    },
    
    subtitleContainer: {
        width: '100%',
        paddingHorizontal: 8,
        marginBottom: 32,
        alignItems: 'center',
    },
    
    subtitle: {
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 16,
        textAlign: 'center',
        color: colors.gray600,
        fontWeight: '400',
    },
    
    subtitleLarge: {
        fontSize: 18,
        lineHeight: 28,
        marginBottom: 20,
        textAlign: 'center',
        color: colors.gray700,
        fontWeight: '500',
    },
    
    // Form elements
    input: {
        width: '100%',
        marginBottom: 16,
        backgroundColor: colors.white,
        borderColor: colors.gray200,
        borderRadius: 12,
    },
    
    inputFocused: {
        borderColor: colors.primary,
        backgroundColor: colors.white,
    },
    
    inputError: {
        borderColor: colors.danger,
        backgroundColor: colors.white,
    },
    
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
        gap: 12,
    },
    
    halfInput: {
        flex: 1,
    },
    
    multiLineInput: {
        width: '100%',
        marginBottom: 16,
        minHeight: 120,
        backgroundColor: colors.white,
        borderColor: colors.gray200,
        borderRadius: 12,
    },
    
    // Select components
    selectContainer: {
        width: '100%',
        marginBottom: 16,
    },
    
    select: {
        width: "100%",
        height: 48,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: colors.gray200,
        borderRadius: 12,
        padding: 12,
        backgroundColor: colors.white,
    },
    
    // Buttons
    button: {
        width: '100%',
        marginTop: 16,
        marginBottom: 8,
        borderRadius: 12,
        height: 52,
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    
    buttonDisabled: {
        width: '100%',
        marginTop: 16,
        marginBottom: 8,
        borderRadius: 12,
        height: 52,
        backgroundColor: colors.gray300,
        borderColor: colors.gray300,
    },
    
    buttonSecondary: {
        width: '100%',
        marginTop: 12,
        marginBottom: 8,
        borderRadius: 12,
        height: 52,
        backgroundColor: colors.secondary,
        borderColor: colors.secondary,
    },
    
    buttonSecondaryDisabled: {
        width: '100%',
        marginTop: 12,
        marginBottom: 8,
        borderRadius: 12,
        height: 52,
        backgroundColor: colors.gray300,
        borderColor: colors.gray300,
    },
    
    buttonOutline: {
        width: '100%',
        marginTop: 12,
        marginBottom: 8,
        borderRadius: 12,
        height: 52,
        backgroundColor: 'transparent',
        borderColor: colors.primary,
        borderWidth: 2,
    },
    
    buttonOutlineDisabled: {
        width: '100%',
        marginTop: 12,
        marginBottom: 8,
        borderRadius: 12,
        height: 52,
        backgroundColor: colors.gray100,
        borderColor: colors.gray300,
        borderWidth: 2,
    },
    
    buttonGhost: {
        width: '100%',
        marginTop: 12,
        marginBottom: 8,
        borderRadius: 12,
        height: 52,
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        borderWidth: 0,
    },
    
    buttonGhostDisabled: {
        width: '100%',
        marginTop: 12,
        marginBottom: 8,
        borderRadius: 12,
        height: 52,
        backgroundColor: 'transparent',
        borderColor: 'transparent',
    },
    
    // Special buttons
    micButton: {
        backgroundColor: colors.primary,
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: colors.primary,
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
    },
    
    micButtonDisabled: {
        backgroundColor: colors.gray300,
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: colors.gray300,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    
    // Cards and containers
    card: {
        backgroundColor: colors.white,
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        shadowColor: colors.gray900,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    
    // Spacing utilities
    /*
    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
        xxl: 48,
    },
    */
    
    // Margins and paddings
    marginBottom: {
        marginBottom: 16,
    },
    
    marginTop: {
        marginTop: 16,
    },
    
    padding: {
        padding: 20,
    },
    
    // Avatar styles
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 4,
        borderColor: colors.primaryLight,
        backgroundColor: colors.gray100,
    },
    
    // Status indicators
    statusSuccess: {
        backgroundColor: colors.success,
    },
    
    statusWarning: {
        backgroundColor: colors.warning,
    },
    
    statusDanger: {
        backgroundColor: colors.danger,
    },
    
    statusInfo: {
        backgroundColor: colors.info,
    },
});

// Export colors for use in components
export { colors };

export default styles;