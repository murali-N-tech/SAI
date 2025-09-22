import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import api from '../lib/axios';
import { Submission, Test } from '../types/api';
import { RootStackParamList } from '../types/navigation';
import ProgressChart from '../components/dashboard/ProgressChart';
import TestCard from '../components/tests/TestCard';
import Spinner from '../components/common/Spinner';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/common/Button';

type DashboardScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;

const DashboardScreen = () => {
    const navigation = useNavigation<DashboardScreenNavigationProp>();
    const { user, logout } = useAuth();
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [tests, setTests] = useState<Test[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchData = async () => {
        try {
            const [submissionsRes, testsRes] = await Promise.all([
                api.get('/submissions'),
                api.get('/tests')
            ]);
            setSubmissions(submissionsRes.data.data);
            setTests(testsRes.data.data);
        } catch (error) {
            console.error("Failed to fetch dashboard data", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            setLoading(true);
            fetchData();
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchData();
    };

    if (loading && !refreshing) {
        return <Spinner />;
    }

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
            <View style={styles.header}>
                <Text style={styles.title}>Welcome, {user?.name}!</Text>
                {user?.role === 'admin' &&
                    <Button onPress={() => navigation.navigate('AdminDashboard')} style={{ width: 120, paddingVertical: 8 }}>Admin</Button>
                }
                <Button onPress={logout} variant="danger" style={{width: 100, paddingVertical: 8}}>Logout</Button>
            </View>

            <ProgressChart submissions={submissions} />

            <View style={styles.testsSection}>
                <Text style={styles.sectionTitle}>Available Tests</Text>
                {tests.map(test => (
                    <TestCard
                        key={test._id}
                        test={test}
                        // Corrected prop name and passing _id
                        onPress={() => navigation.navigate('Test', { testId: test._id, testName: test.name })}
                    />
                ))}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f3f4f6',
    },
    contentContainer: {
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1f2937',
    },
    testsSection: {
        marginTop: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 16,
    },
});

export default DashboardScreen;