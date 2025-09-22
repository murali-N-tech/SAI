import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../hooks/useAuth';

import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import TestScreen from '../screens/TestScreen';
import NotFoundScreen from '../screens/NotFoundScreen';
import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import TabNavigator from './TabNavigator'; // <-- Import the new TabNavigator

import { RootStackParamList } from '../types/navigation';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
    const { isAuthenticated, user, loading } = useAuth();

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator>
                {isAuthenticated ? (
                    <>
                        {/* Main app is now the TabNavigator */}
                        <Stack.Screen name="Main" component={TabNavigator} options={{ headerShown: false }} />
                        <Stack.Screen name="Test" component={TestScreen} options={({ route }) => ({ title: route.params.testName })} />
                        {user?.role === 'admin' && (
                            <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} options={{ title: 'Admin Dashboard' }} />
                        )}
                    </>
                ) : (
                    <>
                        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
                        <Stack.Screen name="Login" component={LoginScreen} />
                        <Stack.Screen name="Register" component={RegisterScreen} />
                    </>
                )}
                 <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;