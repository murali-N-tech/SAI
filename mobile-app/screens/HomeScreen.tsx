import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import Button from '../components/common/Button';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
            <View>
                <Text style={styles.title}>
                    Discover India's Next
                    <Text style={styles.highlight}> Athletic Champions</Text>
                </Text>
                <Text style={styles.subtitle}>
                    A standardized, tech-driven platform to identify and nurture sporting talent from every corner of the nation.
                </Text>
            </View>
            <View style={styles.buttonContainer}>
                <Button onPress={() => navigation.navigate('Register')}>Get Started</Button>
                <Button onPress={() => navigation.navigate('Login')} variant="secondary">Sign In</Button>
            </View>
        </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#1f2937',
    textAlign: 'center',
  },
  highlight: {
    color: '#3b82f6',
  },
  subtitle: {
    marginTop: 16,
    fontSize: 16,
    color: '#4b5563',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  }
});

export default HomeScreen;