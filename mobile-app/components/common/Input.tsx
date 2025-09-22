import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps, ViewStyle } from 'react-native';

interface InputProps extends TextInputProps {
    label: string;
    containerStyle?: ViewStyle;
}

const Input: React.FC<InputProps> = ({ label, containerStyle, ...props }) => {
    return (
        <View style={[styles.container, containerStyle]}>
            <Text style={styles.label}>{label}</Text>
            <TextInput style={styles.input} placeholderTextColor="#9ca3af" {...props} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16
    },
    label: {
        marginBottom: 8,
        fontSize: 14,
        color: '#374151',
        fontWeight: '500'
    },
    input: {
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#fff',
    },
});

export default Input;