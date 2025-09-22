import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import api from '../lib/axios';
import { LeaderboardEntry, Test } from '../types/api';
import { Picker } from '@react-native-picker/picker';

const MOCK_TESTS: Test[] = [
    { id: '60d0fe4f5311236168a109ca', name: 'Vertical Jump', description: 'Test your explosive leg power.' },
    { id: '60d0fe4f5311236168a109cb', name: 'Sit-ups', description: 'Measure your core muscular endurance.' },
    { id: '60d0fe4f5311236168a109cc', name: 'Endurance Run', description: 'A proxy test for cardiovascular fitness.' },
    { id: '60d0fe4f5311236168a109cd', name: 'Shuttle Run', description: 'Test your agility and speed.' },
];

const LeaderboardScreen = () => {
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [selectedTest, setSelectedTest] = useState<string>(MOCK_TESTS[0].id);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchLeaderboard = async (testId: string) => {
        setLoading(true);
        try {
            const response = await api.get(`/leaderboard/${testId}`);
            setLeaderboard(response.data.data);
        } catch (error) {
            console.error("Failed to fetch leaderboard data", error);
            setLeaderboard([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        if (selectedTest) {
            fetchLeaderboard(selectedTest);
        }
    }, [selectedTest]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchLeaderboard(selectedTest);
    }, [selectedTest]);


    const renderItem = ({ item, index }: { item: LeaderboardEntry, index: number }) => (
        <View style={styles.row}>
            <Text style={[styles.cell, styles.rank]}>{index + 1}</Text>
            <Text style={[styles.cell, styles.name]}>{item.name}</Text>
            <Text style={[styles.cell, styles.location]}>{item.location?.state || 'N/A'}</Text>
            <Text style={[styles.cell, styles.score]}>{item.score.toFixed(2)}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Leaderboard</Text>

            <View style={styles.pickerContainer}>
              <Picker
                  selectedValue={selectedTest}
                  onValueChange={(itemValue) => setSelectedTest(itemValue)}
              >
                  {MOCK_TESTS.map(test => (
                      <Picker.Item key={test.id} label={test.name} value={test.id} />
                  ))}
              </Picker>
            </View>

            <View style={styles.headerRow}>
                <Text style={[styles.headerCell, styles.rank]}>Rank</Text>
                <Text style={[styles.headerCell, styles.name]}>Athlete</Text>
                <Text style={[styles.headerCell, styles.location]}>Location</Text>
                <Text style={[styles.headerCell, styles.score]}>Score</Text>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#3b82f6" style={{ marginTop: 50 }}/>
            ) : (
                <FlatList
                    data={leaderboard}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.athleteId}
                    ListEmptyComponent={<Text style={styles.emptyText}>No data available for this leaderboard.</Text>}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                />
            )}
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
    pickerContainer: {
      backgroundColor: '#fff',
      borderRadius: 8,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: '#d1d5db'
    },
    headerRow: {
        flexDirection: 'row',
        backgroundColor: '#e5e7eb',
        paddingVertical: 10,
        paddingHorizontal: 8,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
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
    rank: { flex: 0.15, textAlign: 'center' },
    name: { flex: 0.4 },
    location: { flex: 0.25 },
    score: { flex: 0.2, textAlign: 'right', fontWeight: 'bold' },
    emptyText: {
        textAlign: 'center',
        marginTop: 50,
        color: '#6b7280',
    },
});

export default LeaderboardScreen;