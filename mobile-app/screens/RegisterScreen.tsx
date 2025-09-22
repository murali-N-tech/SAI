import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import Toast from 'react-native-toast-message';
import { useAuth } from '../hooks/useAuth';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { RootStackParamList } from '../types/navigation';

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;

interface Props {
  navigation: RegisterScreenNavigationProp;
}

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    height: '',
    weight: '',
    state: '',
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    const registrationData = {
        ...formData,
        age: Number(formData.age),
        height: Number(formData.height),
        weight: Number(formData.weight),
        location: { state: formData.state }
    };

    try {
        await register(registrationData);
        Toast.show({ type: 'success', text1: 'Registration successful! Please log in.' });
        navigation.navigate('Login');
    } catch (error: any) {
        Toast.show({
            type: 'error',
            text1: 'Registration Failed',
            text2: error.response?.data?.message || 'Please try again.'
        });
    } finally {
        setLoading(false);
    }
  };

  return (
     <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Create a new account</Text>
            <Input label="Full Name" value={formData.name} onChangeText={(val) => handleChange('name', val)} />
            <Input label="Email" value={formData.email} onChangeText={(val) => handleChange('email', val)} keyboardType="email-address" autoCapitalize="none" />
            <Input label="Password" value={formData.password} onChangeText={(val) => handleChange('password', val)} secureTextEntry />
            <View style={styles.row}>
                <Input label="Age" value={formData.age} onChangeText={(val) => handleChange('age', val)} keyboardType="numeric" containerStyle={{ flex: 1 }} />
                <Input label="Height (cm)" value={formData.height} onChangeText={(val) => handleChange('height', val)} keyboardType="numeric" containerStyle={{ flex: 1 }}/>
            </View>
             <View style={styles.row}>
                <Input label="Weight (kg)" value={formData.weight} onChangeText={(val) => handleChange('weight', val)} keyboardType="numeric" containerStyle={{ flex: 1 }}/>
                <Input label="State" value={formData.state} onChangeText={(val) => handleChange('state', val)} containerStyle={{ flex: 1 }}/>
            </View>
            <Button onPress={handleSubmit} loading={loading} disabled={loading}>
                Register
            </Button>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.linkText}>
                    Already have an account? <Text style={styles.link}>Sign In</Text>
                </Text>
            </TouchableOpacity>
        </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 32,
        color: '#1f2937',
    },
    row: {
        flexDirection: 'row',
        gap: 16,
    },
    linkText: {
        marginTop: 20,
        textAlign: 'center',
        color: '#6b7280',
    },
    link: {
        color: '#3b82f6',
        fontWeight: '600',
    },
});

export default RegisterScreen;