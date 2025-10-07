import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { ScanFace, Mic, AlertTriangle, MapPin, ChevronRight } from 'lucide-react-native';
import Header from '../components/molecules/Header';
import theme from '../utils/theme';

const BiometricScreen = ({ navigation }) => {
  const setupOptions = [
    {
      title: 'Set up FacePay',
      icon: <ScanFace color={theme.colors.primary} size={40} />,
      action: () => {navigation.navigate("FaceSetupScreen")}, // Replace with navigation.navigate('FacePaySetup')
      isAvailable: true,
    },
    {
      title: 'Set up VoicePay',
      icon: <Mic color={theme.colors.text.muted} size={40} />,
      subtitle: 'Coming soon',
      action: null,
      isAvailable: false,
    },
  ];

  const fraudAlerts = [
    { id: '1', text: 'Suspicious activity detected near Lagos. Review your recent transactions.', timestamp: 'Oct 05, 2025' },
    { id: '2', text: 'Unrecognized device attempted login. Secure your account.', timestamp: 'Oct 04, 2025' },
  ];

  const recentPayments = [
    {
      id: '1',
      merchant: 'Shoprite INC',
      subtitle: 'Paid for pizza',
      amount: '-₦6,000',
      location: 'Lagos, Nigeria',
      timestamp: 'Oct 05, 2025, 2:30 PM',
    },
    {
      id: '2',
      merchant: 'Jumia Online',
      subtitle: 'Electronics purchase',
      amount: '-₦15,000',
      location: 'Abuja, Nigeria',
      timestamp: 'Oct 04, 2025, 11:15 AM',
    },
    {
      id: '3',
      merchant: 'Local Market',
      subtitle: 'Groceries',
      amount: '-₦2,500',
      location: 'Ikeja, Nigeria',
      timestamp: 'Oct 03, 2025, 5:45 PM',
    },
  ];

  const handleSetup = (option) => {
    if (option.isAvailable && option.action) {
      option.action();
    }
  };

  const handleAlertPress = (alert) => {
    console.log(`Alert pressed: ${alert.text}`);
    // Navigate to alert details
  };

  const handlePaymentPress = (payment) => {
    console.log(`Payment pressed: ${payment.merchant}`);
    // Navigate to payment details
  };

  const sections = [
    {
      id: 'setup',
      render: () => (
        <View style={styles.setupContainer}>
          <Text style={styles.sectionTitle}>Biometric Setup</Text>
          <FlatList
            data={setupOptions}
            keyExtractor={(item) => item.title}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.setupCard, !item.isAvailable && styles.disabledCard]}
                onPress={() => handleSetup(item)}
                disabled={!item.isAvailable}
              >
                <View style={styles.setupIcon}>{item.icon}</View>
                <View style={styles.setupTextContainer}>
                  <Text style={styles.setupTitle}>{item.title}</Text>
                  {item.subtitle && <Text style={styles.setupSubtitle}>{item.subtitle}</Text>}
                </View>
                {item.isAvailable && <ChevronRight color={theme.colors.text.muted} size={24} />}
              </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={false}
          />
        </View>
      ),
    },
    {
      id: 'fraud',
      render: () => (
        <View style={styles.fraudContainer}>
          <Text style={styles.sectionTitle}>Fraud Alerts</Text>
          <FlatList
            data={fraudAlerts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.alertItem} onPress={() => handleAlertPress(item)}>
                <AlertTriangle color={theme.colors.error} size={24} style={styles.alertIcon} />
                <View style={styles.alertTextContainer}>
                  <Text style={styles.alertText}>{item.text}</Text>
                  <Text style={styles.alertTimestamp}>{item.timestamp}</Text>
                </View>
                <ChevronRight color={theme.colors.text.muted} size={20} />
              </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={false}
          />
        </View>
      ),
    },
    {
      id: 'payments',
      render: () => (
        <View style={styles.paymentsContainer}>
          <Text style={styles.sectionTitle}>Recent Biometric Payments</Text>
          <FlatList
            data={recentPayments}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.paymentItem} onPress={() => handlePaymentPress(item)}>
                <View style={styles.paymentInfo}>
                  <Text style={styles.paymentMerchant}>{item.merchant}</Text>
                  <Text style={styles.paymentSubtitle}>{item.subtitle}</Text>
                  <View style={styles.paymentLocation}>
                    <MapPin color={theme.colors.text.muted} size={16} />
                    <Text style={styles.paymentLocationText}>{item.location}</Text>
                  </View>
                  <Text style={styles.paymentTimestamp}>{item.timestamp}</Text>
                </View>
                <Text style={styles.paymentAmount}>{item.amount}</Text>
              </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={false}
          />
        </View>
      ),
    },
  ];

  return (
    <View style={styles.container}>
      <Header variant="logo-actions" />
      <FlatList
        data={sections}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => item.render()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  listContent: {
    paddingBottom: 24,
  },
  setupContainer: {
    marginHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    ...theme.typography.subheading,
    fontSize: 20,
    marginBottom: 16,
    color: theme.colors.text.primary,
  },
  setupCard: {
    flexDirection: 'row',
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
  disabledCard: {
    opacity: 0.6,
  },
  setupIcon: {
    marginRight: 16,
  },
  setupTextContainer: {
    flex: 1,
  },
  setupTitle: {
    ...theme.typography.body,
    fontSize: 16,
    color: theme.colors.text.primary,
  },
  setupSubtitle: {
    ...theme.typography.caption,
    fontSize: 14,
    color: theme.colors.text.muted,
  },
  fraudContainer: {
    marginHorizontal: 24,
    marginBottom: 32,
  },
  alertItem: {
    flexDirection: 'row',
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
  alertIcon: {
    marginRight: 16,
  },
  alertTextContainer: {
    flex: 1,
  },
  alertText: {
    ...theme.typography.body,
    fontSize: 14,
    color: theme.colors.text.primary,
  },
  alertTimestamp: {
    ...theme.typography.caption,
    fontSize: 12,
    color: theme.colors.text.muted,
    marginTop: 4,
  },
  paymentsContainer: {
    marginHorizontal: 24,
  },
  paymentItem: {
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
  paymentInfo: {
    flex: 1,
  },
  paymentMerchant: {
    ...theme.typography.body,
    fontSize: 16,
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  paymentSubtitle: {
    ...theme.typography.caption,
    fontSize: 14,
    color: theme.colors.text.secondary,
    marginBottom: 4,
  },
  paymentLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  paymentLocationText: {
    ...theme.typography.caption,
    fontSize: 12,
    color: theme.colors.text.muted,
    marginLeft: 4,
  },
  paymentTimestamp: {
    ...theme.typography.caption,
    fontSize: 12,
    color: theme.colors.text.muted,
  },
  paymentAmount: {
    ...theme.typography.body,
    fontSize: 16,
    color: theme.colors.error,
  },
});

export default BiometricScreen;