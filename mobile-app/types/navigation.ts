import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Register: undefined;
  Main: undefined; // Renamed from Dashboard to Main
  Test: { testId: string, testName: string };
  Leaderboard: undefined;
  NotFound: undefined;
  Feed: undefined;
  AdminDashboard: undefined;
};

export type TestScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Test'>;
export type TestScreenRouteProp = RouteProp<RootStackParamList, 'Test'>;