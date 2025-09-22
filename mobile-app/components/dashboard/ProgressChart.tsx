import React from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Submission } from '../../types/api';

interface ProgressChartProps {
    submissions: Submission[];
}

const ProgressChart: React.FC<ProgressChartProps> = ({ submissions = [] }) => {
    if (submissions.length === 0) {
        return (
            <View style={styles.container}>
                <Text style={styles.noDataText}>No submission data yet. Complete a test to see your progress!</Text>
            </View>
        );
    }

    const chartData = {
        labels: submissions.map(s => new Date(s.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })).reverse(),
        datasets: [
            {
                data: submissions.map(s => s.score).reverse(),
            },
        ],
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Your Performance Over Time</Text>
            <LineChart
                data={chartData}
                width={Dimensions.get('window').width - 32}
                height={220}
                yAxisLabel=""
                yAxisSuffix=""
                yAxisInterval={1}
                chartConfig={{
                    backgroundColor: '#ffffff',
                    backgroundGradientFrom: '#ffffff',
                    backgroundGradientTo: '#ffffff',
                    decimalPlaces: 1,
                    color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
                    style: {
                        borderRadius: 16,
                    },
                    propsForDots: {
                        r: '6',
                        strokeWidth: '2',
                        stroke: '#3b82f6',
                    },
                }}
                bezier
                style={{
                    marginVertical: 8,
                    borderRadius: 16,
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1f2937',
        marginBottom: 10,
    },
    noDataText: {
        textAlign: 'center',
        color: '#6b7280',
        paddingVertical: 40,
    },
});

export default ProgressChart;