import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import api from '../lib/axios';
import { Submission, Test } from '../types/api';
import { RootStackParamList } from '../types/navigation';
import StatCard from '../components/dashboard/StatCard';
import ProgressChart from '../components/dashboard/ProgressChart';
import TestCard from '../components/tests/TestCard';
import Spinner from '../components/common/Spinner';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/common/Button';

const MOCK_TESTS: Test[] = [
    { id: '60d0fe4f5311236168a109ca', name: 'Vertical Jump', description: 'Test your explosive leg power.' },
    { id: '60d0fe4f5311236168a109cb', name: 'Sit-ups', description: 'Measure your core muscular endurance.' },
    { id: '60d0fe4f5311236168a109cc', name: 'Endurance Run', description: 'A proxy test for cardiovascular fitness.' },
    { id: '60d0fe4f5311236168a109cd', name: 'Shuttle Run', description: 'Test your agility and speed.' },
];

type DashboardScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Dashboard'>;

const DashboardScreen = () => {
    const navigation = useNavigation<DashboardScreenNavigationProp>();
    const { user, logout } = useAuth();
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ total: 0, bestScore: 0 });
    const [refreshing, setRefreshing] = useState(false);

    const fetchData = async () => {
        try {
            const response = await api.get('/submissions/me');
            const userSubmissions: Submission[] = response.data.data;
            setSubmissions(userSubmissions);

            if (userSubmissions.length > 0) {
                const best = userSubmissions.reduce((max, s) => s.score > max ? s.score : max, 0);
                setStats({ total: userSubmissions.length, bestScore: best });
            } else {
                setStats({ total: 0, bestScore: 0 });
            }
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
                <Button onPress={logout} variant="danger" style={{width: 100, paddingVertical: 8}}>Logout</Button>
            </View>

            <View style={styles.statsSection}>
                <StatCard title="Tests Taken" value={stats.total} />
                <StatCard title="Best Score" value={stats.bestScore.toFixed(2)} />
            </View>

            <ProgressChart submissions={submissions} />

            <View style={styles.testsSection}>
                <Text style={styles.sectionTitle}>Available Tests</Text>
                {MOCK_TESTS.map(test => (
                    <TestCard
                        key={test.id}
                        test={test}
                        onPress={() => navigation.navigate('Test', { testId: test.id, testName: test.name })}
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
    statsSection: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        gap: 16,
        marginBottom: 24,
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