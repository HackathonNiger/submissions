import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Lock } from 'lucide-react-native';
import GestPayInput from '../components/molecules/GestPayInput';
import BottomSheet from '../components/molecules/BottomSheet';
import GestPayButton from '../components/molecules/GestPayButton';
import Header from '../components/molecules/Header';
import theme from '../utils/theme';
import ScreenWrapper from '../components/layout/ScreenWrapper';

const SettingsScreen = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('Abdulbaqee');
  const [email, setEmail] = useState('abdulbaqee123@gmail.com');
  const [phoneNumber, setPhoneNumber] = useState('08012345678');
  const [mobileApproval, setMobileApproval] = useState(true);
  const [facePayApproval, setFacePayApproval] = useState(false);
  const [isPasswordSheetVisible, setIsPasswordSheetVisible] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [profileError, setProfileError] = useState('');

  const handleSaveProfile = async () => {
    if (!name || !email || !phoneNumber) {
      setProfileError('Please fill in all required fields');
      return;
    }
    setProfileError('');
    try {
      // Simulate API call for profile update
      const response = await mockProfileApiCall({ name, email, phoneNumber });
      console.log('Profile Update Response:', response);
      // Show success message or navigate
    } catch (err) {
      setProfileError('Failed to update profile. Please try again.');
    }
  };

  const handleSavePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      setError('Please fill in all password fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New password and confirm password do not match');
      return;
    }
    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }
    setError('');
    try {
      // Simulate API call for password change
      const response = await mockPasswordApiCall({ oldPassword, newPassword });
      console.log('Password Change Response:', response);
      setIsPasswordSheetVisible(false);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      // Show success message or navigate
    } catch (err) {
      setError('Failed to change password. Please try again.');
    }
  };

  const mockProfileApiCall = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { success: true, message: 'Profile updated successfully' };
  };

  const mockPasswordApiCall = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { success: true, message: 'Password changed successfully' };
  };

  return (
    <ScreenWrapper>
      <Header variant="back" navigation={navigation} title="Settings" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.finTechPattern} />
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile Details</Text>
          <GestPayInput
            label="Name"
            placeholder="Enter your name"
            value={name}
            onChangeText={setName}
            required
          />
          <GestPayInput
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            required
          />
          <GestPayInput
            label="Phone Number"
            placeholder="Enter your phone number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            required
          />
          {profileError ? <Text style={styles.errorText}>{profileError}</Text> : null}
          <GestPayButton
            variant="primary"
            title="Save Profile"
            onPress={handleSaveProfile}
            style={styles.saveButton}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security Settings</Text>
          <View style={styles.securityItem}>
            <View style={styles.securityText}>
              <Text style={styles.securityTitle}>Mobile Approval</Text>
              <Text style={styles.securitySubtitle}>
                Approve transactions on your mobile device
              </Text>
            </View>
            <Switch
              value={mobileApproval}
              onValueChange={setMobileApproval}
              trackColor={{ false: theme.colors.gray, true: theme.colors.primary }}
              thumbColor={theme.colors.surface}
            />
          </View>
          <View style={styles.securityItem}>
            <View style={styles.securityText}>
              <Text style={styles.securityTitle}>Face Pay Approval</Text>
              <Text style={styles.securitySubtitle}>
                Require additional approval for Face Pay transactions
              </Text>
            </View>
            <Switch
              value={facePayApproval}
              onValueChange={setFacePayApproval}
              trackColor={{ false: theme.colors.gray, true: theme.colors.primary }}
              thumbColor={theme.colors.surface}
            />
          </View>
          <GestPayButton
            variant="primary"
            title="Change Password"
            icon={<Lock color={theme.colors.surface} size={20} />}
            onPress={() => setIsPasswordSheetVisible(true)}
            style={styles.changePasswordButton}
          />
        </View>
      </ScrollView>

      <BottomSheet
        isVisible={isPasswordSheetVisible}
        onClose={() => {
          setIsPasswordSheetVisible(false);
          setOldPassword('');
          setNewPassword('');
          setConfirmPassword('');
          setError('');
        }}
        height="60%"
      >
        <View style={styles.bottomSheetContent}>
          <View style={styles.finTechPattern} />
          <Text style={styles.formTitle}>Change Password</Text>
          <GestPayInput
            label="Old Password"
            placeholder="Enter old password"
            value={oldPassword}
            onChangeText={setOldPassword}
            secureTextEntry
            required
          />
          <GestPayInput
            label="New Password"
            placeholder="Enter new password"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
            required
          />
          <GestPayInput
            label="Confirm New Password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            required
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <GestPayButton
            variant="primary"
            title="Save Password"
            onPress={handleSavePassword}
            style={styles.saveButton}
          />
        </View>
      </BottomSheet>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
    position: 'relative',
  },
  finTechPattern: {
    ...StyleSheet.absoluteFill,
    opacity: 0.05,
    backgroundColor: theme.colors.gray,
    backgroundImage: `linear-gradient(45deg, ${theme.colors.text.muted} 25%, transparent 25%, transparent 50%, ${theme.colors.text.muted} 50%, ${theme.colors.text.muted} 75%, transparent 75%, transparent)`,
    backgroundSize: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    ...theme.typography.subheading,
    fontSize: 20,
    color: theme.colors.text.primary,
    marginBottom: 16,
  },
  errorText: {
    ...theme.typography.caption,
    fontSize: 14,
    color: theme.colors.error,
    textAlign: 'center',
    marginBottom: 16,
  },
  saveButton: {
    marginTop: 24,
  },
  securityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: theme.colors.gray,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  securityText: {
    flex: 1,
  },
  securityTitle: {
    ...theme.typography.body,
    fontSize: 16,
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  securitySubtitle: {
    ...theme.typography.caption,
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
  changePasswordButton: {
    marginTop: 16,
  },
  bottomSheetContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    position: 'relative',
  },
  formTitle: {
    ...theme.typography.heading,
    fontSize: 24,
    color: theme.colors.text.primary,
    marginBottom: 24,
    textAlign: 'center',
  },
});

export default SettingsScreen;