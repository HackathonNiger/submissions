import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CreditCard, AlertTriangle, Info } from 'lucide-react-native';
import GestPayButton from '../components/molecules/GestPayButton';
import Header from '../components/molecules/Header';
import theme from '../utils/theme';
import ScreenWrapper from '../components/layout/ScreenWrapper';

const NotificationsScreen = () => {
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      type: 'transaction',
      title: 'Payment Successful',
      message: 'You sent ₦6,000 to Shoprite INC for pizza.',
      timestamp: 'Oct 05, 2025, 2:30 PM',
    },
    {
      id: '2',
      type: 'security',
      title: 'Suspicious Activity',
      message: 'Unrecognized login attempt from Lagos. Secure your account.',
      timestamp: 'Oct 04, 2025, 11:15 AM',
    },
    {
      id: '3',
      type: 'system',
      title: 'System Update',
      message: 'New FacePay feature available! Set it up in settings.',
      timestamp: 'Oct 03, 2025, 5:45 PM',
    },
  ]);

  const handleClearAll = async () => {
    try {
      // Simulate API call to clear notifications
      await mockClearNotificationsApiCall();
      setNotifications([]);
    } catch (err) {
      console.error('Failed to clear notifications:', err);
    }
  };

  const handleNotificationPress = (notification) => {
    console.log(`Notification pressed: ${notification.title}`);
    // Navigate based on type, e.g., transaction details or security settings
    if (notification.type === 'transaction') {
      // navigation.navigate('TransactionDetails', { id: notification.id });
    } else if (notification.type === 'security') {
      navigation.navigate('Settings');
    }
  };

  const mockClearNotificationsApiCall = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { success: true, message: 'Notifications cleared' };
  };

  const renderNotification = ({ item }) => {
    const iconMap = {
      transaction: <CreditCard color={theme.colors.success} size={24} />,
      security: <AlertTriangle color={theme.colors.error} size={24} />,
      system: <Info color={theme.colors.primary} size={24} />,
    };
    const borderColor = {
      transaction: theme.colors.success,
      security: theme.colors.error,
      system: theme.colors.primary,
    };

    return (
      <TouchableOpacity
        style={[styles.notificationItem, { borderLeftColor: borderColor[item.type] }]}
        onPress={() => handleNotificationPress(item)}
      >
        <View style={styles.notificationIcon}>{iconMap[item.type]}</View>
        <View style={styles.notificationContent}>
          <Text style={styles.notificationTitle}>{item.title}</Text>
          <Text style={styles.notificationMessage}>{item.message}</Text>
          <Text style={styles.notificationTimestamp}>{item.timestamp}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScreenWrapper>
      <Header variant="back" navigation={navigation} title="Notifications" />
      <View style={styles.container}>
        <View style={styles.finTechPattern} />
        {notifications.length > 0 && (
          <GestPayButton
            variant="secondary"
            title="Clear All"
            onPress={handleClearAll}
            style={styles.clearButton}
          />
        )}
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={renderNotification}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No notifications available.</Text>
          }
          contentContainerStyle={styles.listContent}
        />
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    backgroundColor: theme.colors.background,
    position: 'relative',
  },
  finTechPattern: {
    ...StyleSheet.absoluteFill,
    opacity: 0.05,
    backgroundColor: theme.colors.gray,
    backgroundImage: `linear-gradient(45deg, ${theme.colors.text.muted} 25%, transparent 25%, transparent 50%, ${theme.colors.text.muted} 50%, ${theme.colors.text.muted} 75%, transparent 75%, transparent)`,
    backgroundSize: 20,
  },
  clearButton: {
    marginBottom: 24,
  },
  notificationItem: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: theme.colors.gray,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderLeftWidth: 4,
  },
  notificationIcon: {
    marginRight: 16,
    alignSelf: 'flex-start',
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    ...theme.typography.body,
    fontSize: 16,
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  notificationMessage: {
    ...theme.typography.body,
    fontSize: 14,
    color: theme.colors.text.secondary,
    marginBottom: 4,
  },
  notificationTimestamp: {
    ...theme.typography.caption,
    fontSize: 12,
    color: theme.colors.text.muted,
  },
  emptyText: {
    ...theme.typography.body,
    fontSize: 16,
    color: theme.colors.text.muted,
    textAlign: 'center',
    marginTop: 24,
  },
  listContent: {
    paddingBottom: 24,
  },
});

export default NotificationsScreen;