import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import firestore from '@react-native-firebase/firestore';

// Context Providers
import { AppProvider } from './src/utils/AppContext';
import { HealthProvider } from './src/utils/HealthContext';

// Screens
import LandingPage from './src/screens/LandingScreen/LandingScreen';
import LoginScreen from './src/screens/pregnateuser/Loginscreen/LoginScreen';
import SignUpScreen from './src/screens/pregnateuser/SigninScreen/SignUpScreen';
import Dashboard from './src/screens/pregnateuser/Dashboard/Dashboard';
import HealthScreen from './src/screens/pregnateuser/HealthPage/Healthscreen';
import BookAppointmentScreen from './src/screens/BookAppointment/BookAppointmentScreen';
import ReminderScreen from './src/screens/ReminderScreen/ReminderScreen';
import ScheduleScreen from './src/screens/ReminderScreen/ScheduleScreen/ScheduleScreen';
import AppointmentScreen from './src/screens/AppointmentScreen/AppointmentScreen';
import EmergencyScreen from './src/screens/pregnateuser/Emergency/Emergency';
import SettingsScreen from './src/screens/SettingsPage/SettingsScreen';
import ProfileScreen from './src/screens/pregnateuser/ProfilePage/ProfileScreen';
import ArticleScreen from './src/screens/ArticleScreen/ArticleScreen';
import FaqScreen from './src/screens/FaqScreen/FaqScreen';
import HistoryScreen from './src/screens/pregnateuser/HistoryScreen/HistoryScreen';
import DoctorScreen from './src/screens/pregnateuser/DoctorsScreen/DoctorScreen';
import HelpCenterScreen from './src/screens/HelpCentreScreen/HelpCentreScreen';
import EditProfileScreen from './src/screens/EditProfileScreen/EditProfileScreen';
import bookingpageScreen from './src/screens/bookingpage/bookingpageScreen';
import AddReminderScreen from './src/screens/AddReminder/AddReminderScreen';
import HealthTipsScreen from './src/screens/pregnateuser/HealthTipsScreen/HealthTipsScreen';
import HealthMetricsScreen from './src/screens/pregnateuser/HealthMetricsScreen/HealthMetricsScreen';
import AntenatalTrackerStyle from './src/screens/pregnateuser/AntenatalTrackerStyle/AntenatalTracker';
import FetalDevelopment from './src/screens/pregnateuser/FetalDevelopment/FetalDevelopment';
import MotherNutrition from './src/screens/pregnateuser/MotherNutrition/MotherNutrition';
import MentalwellBeing from './src/screens/pregnateuser/MentalwellBeing/MentalwellBeing';
import PertanalExcercise from './src/screens/pregnateuser/PertanalExercise/PertanalExercise';
import LaborDelivery from './src/screens/pregnateuser/LaborDelivery/LaborDelivery';
import RecoveryGuide from './src/screens/pregnateuser/RecoveryGuide/RecoveryGuide';
import PrivacyPolicy from './src/screens/PrivacyPolicy/PrivacyPolicy';

import useFcmToken from './src/hooks/useFCMtoken';

const Stack = createNativeStackNavigator();

export default function App() {
  useFcmToken();

  firestore()
    .settings({ persistence: true })
    .then(() => console.log('✅ Firestore offline persistence enabled'))
    .catch(err => console.log('⚠️ Firestore persistence error:', err));

  return (
    <AppProvider>
      <HealthProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="LandingPage" // Set your initial route here
            screenOptions={{
              headerShown: false,
              animation: 'slide_from_right',
              gestureEnabled: true,
            }}
          >
            <Stack.Screen name="LandingPage" component={LandingPage} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="Dashboard" component={Dashboard} />
            <Stack.Screen
              name="BookAppointment"
              component={BookAppointmentScreen}
            />
            <Stack.Screen name="Health" component={HealthScreen} />
            <Stack.Screen name="Reminder" component={ReminderScreen} />
            <Stack.Screen name="ScheduleScreen" component={ScheduleScreen} />
            <Stack.Screen name="Appointment" component={AppointmentScreen} />
            <Stack.Screen name="Emergency" component={EmergencyScreen} />
            <Stack.Screen name="Doctor" component={DoctorScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            <Stack.Screen name="Article" component={ArticleScreen} />
            <Stack.Screen name="Faq" component={FaqScreen} />
            <Stack.Screen name="HelpCenter" component={HelpCenterScreen} />
            <Stack.Screen name="History" component={HistoryScreen} />
            <Stack.Screen name="bookingpage" component={bookingpageScreen} />
            <Stack.Screen
              name="AddReminderScreen"
              component={AddReminderScreen}
            />
            <Stack.Screen name="healthTips" component={HealthTipsScreen} />
            <Stack.Screen
              name="healthmetrics"
              component={HealthMetricsScreen}
              options={{
                title: 'Health Metrics',
                headerShown: true,
                headerStyle: { backgroundColor: '#2563eb' },
                headerTintColor: '#fff',
                headerTitleStyle: { fontWeight: 'bold' },
              }}
            />
            <Stack.Screen
              name="AntenatalTracker"
              component={AntenatalTrackerStyle}
            />
            <Stack.Screen name="fetaldeve" component={FetalDevelopment} />
            <Stack.Screen name="MotherHealth" component={MotherNutrition} />
            <Stack.Screen name="Pertanal" component={PertanalExcercise} />
            <Stack.Screen name="mentalwell" component={MentalwellBeing} />
            <Stack.Screen name="delivery" component={LaborDelivery} />
            <Stack.Screen name="Recovery" component={RecoveryGuide} />
            <Stack.Screen name="privacy" component={PrivacyPolicy} />
          </Stack.Navigator>
        </NavigationContainer>
      </HealthProvider>
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  // You can remove splash screen styles if not used elsewhere
});
