import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';

interface ButtonProps {
    children: React.ReactNode;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'danger';
    disabled?: boolean;
    loading?: boolean;
    style?: ViewStyle;
}

const Button: React.FC<ButtonProps> = ({
    children,
    onPress,
    variant = 'primary',
    disabled = false,
    loading = false,
    style,
}) => {
    const variantStyle = styles[variant];
    const textVariantStyle = variant === 'secondary' ? styles.textSecondary : styles.textPrimary;

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || loading}
            style={[styles.base, variantStyle, (disabled || loading) && styles.disabled, style]}
        >
            {loading ? <ActivityIndicator color={variant === 'secondary' ? '#000' : '#fff'} /> : <Text style={textVariantStyle}>{children}</Text>}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    base: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        paddingVertical: 14,
        paddingHorizontal: 16,
    },
    primary: { backgroundColor: '#3b82f6' },
    secondary: { backgroundColor: '#e5e7eb', borderWidth: 1, borderColor: '#d1d5db' },
    danger: { backgroundColor: '#ef4444' },
    textPrimary: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
    textSecondary: { color: '#1f2937', fontSize: 16, fontWeight: '600' },
    disabled: { opacity: 0.6 },
});

export default Button;