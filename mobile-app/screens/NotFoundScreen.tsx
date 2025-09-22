import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Button from '../components/common/Button';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';

type NavigationProp = StackNavigationProp<RootStackParamList, 'NotFound'>;

const NotFoundScreen = () => {
    const navigation = useNavigation<NavigationProp>();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>404</Text>
            <Text style={styles.subtitle}>Page Not Found</Text>
            <Text style={styles.description}>Sorry, the page you are looking for does not exist.</Text>
            <Button onPress={() => navigation.navigate('Home')}>Go Home</Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f9fafb',
    },
    title: {
        fontSize: 60,
        fontWeight: 'bold',
        color: '#3b82f6',
    },
    subtitle: {
        fontSize: 24,
        fontWeight: '600',
        marginTop: 16,
        color: '#1f2937',
    },
    description: {
        fontSize: 16,
        color: '#6b7280',
        textAlign: 'center',
        marginTop: 8,
        marginBottom: 24,
    },
});

export default NotFoundScreen;