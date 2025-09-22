import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, Linking } from 'react-native';
import api from '../lib/axios';
import { Submission } from '../types/api';
import Spinner from '../components/common/Spinner';

const AdminDashboardScreen = () => {
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchSubmissions = async () => {
        try {
            const response = await api.get('/users/admin/submissions');
            setSubmissions(response.data.data);
        } catch (error) {
            console.error("Failed to fetch submissions", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchSubmissions();
    }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchSubmissions();
    }, []);

    const renderItem = ({ item }: { item: Submission }) => (
        <View style={styles.row}>
            <Text style={[styles.cell, styles.name]}>{item.athlete.name}</Text>
            <Text style={[styles.cell, styles.test]}>{item.test.name}</Text>
            <Text style={[styles.cell, styles.score]}>{item.score}</Text>
            <Text style={[styles.cell, styles.video]} onPress={() => Linking.openURL(item.videoUrl)}>View</Text>
        </View>
    );

    if (loading) {
        return <Spinner />;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>All Submissions</Text>
            <View style={styles.headerRow}>
                <Text style={[styles.headerCell, styles.name]}>Athlete</Text>
                <Text style={[styles.headerCell, styles.test]}>Test</Text>
                <Text style={[styles.headerCell, styles.score]}>Score</Text>
                <Text style={[styles.headerCell, styles.video]}>Video</Text>
            </View>
            <FlatList
                data={submissions}
                renderItem={renderItem}
                keyExtractor={(item) => item._id}
                ListEmptyComponent={<Text style={styles.emptyText}>No submissions found.</Text>}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f3f4f6',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    headerRow: {
        flexDirection: 'row',
        backgroundColor: '#e5e7eb',
        paddingVertical: 10,
        paddingHorizontal: 8,
    },
    row: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    headerCell: {
        fontWeight: 'bold',
        color: '#4b5563',
    },
    cell: {
        fontSize: 14,
        color: '#1f2937',
    },
    name: { flex: 0.3 },
    test: { flex: 0.3 },
    score: { flex: 0.2 },
    video: { flex: 0.2, color: '#3b82f6' },
    emptyText: {
        textAlign: 'center',
        marginTop: 50,
        color: '#6b7280',
    },
});

export default AdminDashboardScreen;