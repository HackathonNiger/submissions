import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Linking,
  Alert,
  Switch,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  ArrowLeft, 
  MessageCircle, 
  ExternalLink, 
  ArrowRight, 
  CheckCircle, 
  AlertCircle,
  Shield,
  Zap,
  Users,
  Clock,
  Settings,
  Unlink,
  Activity, Copy
} from 'lucide-react-native';
import { useSelector } from 'react-redux';
import theme from '../utils/theme';
import Header from '../components/molecules/Header';
import { selectCurrentUser } from '../store/slices/authSlice';
import { authApi } from '../store/api/authApi';
import { useToast } from '../components/Toast';

const { width } = Dimensions.get('window');

const TelegramPayScreen = ({ navigation }) => {
  const toast = useToast();
  const user = useSelector(selectCurrentUser);
  
  const [chatId, setChatId] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected'); // 'disconnected', 'connecting', 'connected'
  const [connectedChat, setConnectedChat] = useState(null);

  // Fetch user profile and telegram details
  const { data: userProfile, refetch: refetchProfile } = authApi.endpoints.getUserProfile.useQuery();
  const { 
    data: telegramDetails, 
    refetch: refetchTelegram, 
    isLoading: telegramLoading 
  } = authApi.endpoints.getTelegramDetails.useQuery(
    undefined,
    { skip: !userProfile?.data?.has_setup_telegram }
  );
  
  const [disconnectTelegram] = authApi.endpoints.disconnectTelegram.useMutation();
  const [toggleTelegramPayments] = authApi.endpoints.toggleTelegramPayments.useMutation();

  // Use profile data if available, fallback to Redux user data
  const currentUser = userProfile?.data || user;
  const telegramData = telegramDetails?.data;

  const botUsername = '@gestpay_bot'; // Your actual bot username
  const botLink = 'https://t.me/gestpay_bot';

  const handleOpenBot = async () => {
    try {
      const supported = await Linking.canOpenURL(botLink);
      if (supported) {
        await Linking.openURL(botLink);
        toast.info('Follow the bot instructions to complete setup');
      } else {
        toast.error('Unable to open Telegram. Please install Telegram first.');
      }
    } catch (error) {
      toast.error('Failed to open Telegram bot');
    }
  };

  const handleDisconnect = async () => {
    Alert.alert(
      'Disconnect Telegram',
      'Are you sure you want to disconnect your Telegram account? This will disable Telegram payments.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Disconnect',
          style: 'destructive',
          onPress: async () => {
            try {
              const result = await disconnectTelegram().unwrap();
              if (result.success) {
                toast.success('Telegram account disconnected successfully');
                refetchProfile();
                refetchTelegram();
              }
            } catch (error) {
              toast.error(error.data?.message || 'Failed to disconnect Telegram');
            }
          }
        }
      ]
    );
  };

  const handleTogglePayments = async (enabled) => {
    try {
      const result = await toggleTelegramPayments(enabled).unwrap();
      if (result.success) {
        toast.success(enabled ? 'Telegram payments enabled' : 'Telegram payments disabled');
        refetchProfile();
        refetchTelegram();
      }
    } catch (error) {
      toast.error(error.data?.message || 'Failed to toggle payments');
    }
  };

  const copyBotUsername = () => {
    // In a real app, you'd use Clipboard API
    Alert.alert('Copied', `${botUsername} copied to clipboard`);
  };

  const openTelegramBot = () => {
    // In a real app, you'd use Linking.openURL(botLink)
    Alert.alert('Opening Telegram', 'This would open the Telegram bot in your Telegram app');
  };

  const features = [
    {
      icon: <MessageCircle color={theme.colors.primary} size={24} />,
      title: 'Instant Payments',
      description: 'Send and receive money directly in your Telegram chats',
    },
    {
      icon: <Users color={theme.colors.primary} size={24} />,
      title: 'Group Payments',
      description: 'Split bills and manage group expenses seamlessly',
    },
    {
      icon: <Shield color={theme.colors.primary} size={24} />,
      title: 'Secure & Private',
      description: 'End-to-end encrypted transactions with bank-level security',
    },
  ];

  const steps = [
    'Add our bot to your Telegram',
    'Get your chat ID from the bot',
    'Enter the chat ID below',
    'Start making payments!',
  ];

  // Determine connection status based on user data
  const isSetup = currentUser?.has_setup_telegram;
  const paymentsEnabled = currentUser?.allow_telegram_payments;

  return (
    <LinearGradient
      colors={[theme.colors.background, theme.colors.surface]}
      style={styles.container}
    >
      <Header variant="back" title="Pay via Telegram" />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.telegramIconContainer}>
            <MessageCircle color={theme.colors.primary} size={48} />
          </View>
          <Text style={styles.heroTitle}>
            {isSetup ? 'Telegram Connected' : 'Connect to Telegram'}
          </Text>
          <Text style={styles.heroSubtitle}>
            {isSetup 
              ? 'Manage your Telegram payment settings'
              : 'Make payments directly from your Telegram chats with friends and groups'
            }
          </Text>
        </View>

        {/* Connection Status - Show if setup */}
        {isSetup && (
          telegramLoading ? (
            <View style={styles.loadingCard}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
              <Text style={styles.loadingText}>Loading connection details...</Text>
            </View>
          ) : telegramData ? (
          <View style={styles.statusCard}>
            <View style={styles.statusHeader}>
              <CheckCircle color={theme.colors.success || '#10B981'} size={24} />
              <Text style={styles.statusTitle}>Connected</Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusBadgeText}>
                  {telegramData.connection_active ? 'Active' : 'Inactive'}
                </Text>
              </View>
            </View>
            
            <View style={styles.connectionDetails}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Chat ID:</Text>
                <Text style={styles.detailValue}>{telegramData.chat_id}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Connected:</Text>
                <Text style={styles.detailValue}>{telegramData.connection_date}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Last Activity:</Text>
                <Text style={styles.detailValue}>{telegramData.last_activity}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Total Messages:</Text>
                <Text style={styles.detailValue}>{telegramData.total_messages}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Transactions:</Text>
                <Text style={styles.detailValue}>{telegramData.telegram_transactions}</Text>
              </View>
            </View>

            {/* Payment Toggle */}
            <View style={styles.paymentToggle}>
              <View style={styles.toggleInfo}>
                <Text style={styles.toggleTitle}>Enable Payments</Text>
                <Text style={styles.toggleSubtitle}>
                  Allow sending and receiving money via Telegram
                </Text>
              </View>
              <Switch
                value={paymentsEnabled}
                onValueChange={handleTogglePayments}
                trackColor={{ false: theme.colors.gray, true: theme.colors.primary }}
                thumbColor={paymentsEnabled ? theme.colors.surface : '#f4f3f4'}
              />
            </View>

            {/* Disconnect Button */}
            <TouchableOpacity style={styles.disconnectButton} onPress={handleDisconnect}>
              <Unlink color={theme.colors.error || '#EF4444'} size={20} />
              <Text style={styles.disconnectButtonText}>Disconnect Account</Text>
            </TouchableOpacity>
          </View>
          ) : (
            <View style={styles.errorCard}>
              <AlertCircle color={theme.colors.error || '#EF4444'} size={24} />
              <Text style={styles.errorText}>Failed to load connection details</Text>
              <TouchableOpacity 
                style={styles.retryButton} 
                onPress={() => refetchTelegram()}
              >
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          )
        )}

        {/* Bot Setup Section - Show only if not setup */}
        {!isSetup && (
          <View style={styles.setupSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Setup Instructions</Text>
            </View>
            
            <View style={styles.stepsContainer}>
              {steps.map((step, index) => (
                <View key={index} style={styles.stepItem}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.stepText}>{step}</Text>
                </View>
              ))}
            </View>

            <View style={styles.botCard}>
              <View style={styles.botHeader}>
                <MessageCircle color={theme.colors.primary} size={20} />
                <Text style={styles.botTitle}>GestPay Bot</Text>
              </View>
              <Text style={styles.botDescription}>
                Add our official bot to get started with Telegram payments
              </Text>
              <View style={styles.botActions}>
                <TouchableOpacity style={styles.copyButton} onPress={copyBotUsername}>
                  <Copy color={theme.colors.primary} size={16} />
                  <Text style={styles.copyButtonText}>{botUsername}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.openBotButton} onPress={handleOpenBot}>
                  <Text style={styles.openBotButtonText}>Open Bot</Text>
                  <ExternalLink color={theme.colors.surface} size={16} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}


        {/* Features Section */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Why Use Telegram Payments?</Text>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <View style={styles.featureIcon}>{feature.icon}</View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Security Notice */}
        <View style={styles.securityNotice}>
          <Shield color={theme.colors.primary} size={20} />
          <View style={styles.securityContent}>
            <Text style={styles.securityTitle}>Your Security Matters</Text>
            <Text style={styles.securityText}>
              All transactions are encrypted and secured. We never store your Telegram credentials.
            </Text>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  heroSection: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  telegramIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  telegramIcon: {
    width: 48,
    height: 48,
  },
  heroTitle: {
    ...theme.typography.heading,
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 8,
    color: theme.colors.text.primary,
  },
  heroSubtitle: {
    ...theme.typography.body,
    fontSize: 16,
    textAlign: 'center',
    color: theme.colors.text.secondary,
    lineHeight: 24,
  },
  statusCard: {
    backgroundColor: theme.colors.surface,
    marginHorizontal: 24,
    marginBottom: 24,
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: theme.colors.success + '20',
    shadowColor: theme.colors.success,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusTitle: {
    ...theme.typography.subheading,
    marginLeft: 8,
    color: theme.colors.success || '#10B981',
    flex: 1,
  },
  statusBadge: {
    backgroundColor: theme.colors.primary + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    ...theme.typography.caption,
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  connectionDetails: {
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailLabel: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
    fontSize: 14,
  },
  detailValue: {
    ...theme.typography.body,
    color: theme.colors.text.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  paymentToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    marginBottom: 16,
  },
  toggleInfo: {
    flex: 1,
    marginRight: 16,
  },
  toggleTitle: {
    ...theme.typography.subheading,
    fontSize: 16,
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  toggleSubtitle: {
    ...theme.typography.body,
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
  chatInfo: {
    marginBottom: 16,
  },
  chatName: {
    ...theme.typography.subheading,
    fontSize: 18,
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  chatDetails: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
  },
  disconnectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: (theme.colors.error || '#EF4444') + '10',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: (theme.colors.error || '#EF4444') + '20',
  },
  disconnectButtonText: {
    ...theme.typography.button,
    color: theme.colors.error || '#EF4444',
    fontSize: 14,
    marginLeft: 8,
  },
  loadingCard: {
    backgroundColor: theme.colors.surface,
    marginHorizontal: 24,
    marginBottom: 24,
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
    marginTop: 16,
    textAlign: 'center',
  },
  errorCard: {
    backgroundColor: theme.colors.surface,
    marginHorizontal: 24,
    marginBottom: 24,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: (theme.colors.error || '#EF4444') + '20',
  },
  errorText: {
    ...theme.typography.body,
    color: theme.colors.text.primary,
    marginTop: 12,
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  retryButtonText: {
    ...theme.typography.button,
    color: theme.colors.surface,
    fontSize: 14,
  },
  setupSection: {
    marginHorizontal: 24,
    marginBottom: 24,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    ...theme.typography.subheading,
    fontSize: 20,
    color: theme.colors.text.primary,
    marginBottom: 8,
  },
  sectionSubtitle: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
    lineHeight: 20,
  },
  stepsContainer: {
    marginBottom: 24,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  stepNumberText: {
    ...theme.typography.button,
    fontSize: 14,
    color: theme.colors.surface,
  },
  stepText: {
    ...theme.typography.body,
    flex: 1,
    color: theme.colors.text.primary,
  },
  botCard: {
    backgroundColor: theme.colors.surface,
    padding: 20,
    borderRadius: 16,
    shadowColor: theme.colors.gray,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  botHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  botTitle: {
    ...theme.typography.subheading,
    marginLeft: 8,
    color: theme.colors.text.primary,
  },
  botDescription: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  botActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary + '10',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 12,
  },
  copyButtonText: {
    ...theme.typography.button,
    color: theme.colors.primary,
    fontSize: 14,
    marginLeft: 8,
  },
  openBotButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  openBotButtonText: {
    ...theme.typography.button,
    color: theme.colors.surface,
    fontSize: 14,
    marginRight: 8,
  },
  connectionSection: {
    marginHorizontal: 24,
    marginBottom: 24,
  },
  inputContainer: {
    marginTop: 16,
    marginBottom: 20,
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.gray,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: theme.colors.text.primary,
    shadowColor: theme.colors.gray,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  connectButton: {
    backgroundColor: theme.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  connectButtonDisabled: {
    backgroundColor: theme.colors.gray,
    shadowOpacity: 0,
    elevation: 0,
  },
  connectButtonText: {
    ...theme.typography.button,
    color: theme.colors.surface,
    marginRight: 8,
  },
  connectingStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    padding: 12,
    backgroundColor: theme.colors.warning + '10',
    borderRadius: 8,
  },
  connectingText: {
    ...theme.typography.body,
    color: theme.colors.warning,
    marginLeft: 8,
  },
  featuresSection: {
    marginHorizontal: 24,
    marginBottom: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: theme.colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: theme.colors.gray,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  featureIcon: {
    marginRight: 16,
    marginTop: 2,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    ...theme.typography.subheading,
    fontSize: 16,
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  featureDescription: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
    lineHeight: 20,
  },
  securityNotice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: theme.colors.primary + '05',
    marginHorizontal: 24,
    marginBottom: 32,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.primary + '20',
  },
  securityContent: {
    flex: 1,
    marginLeft: 12,
  },
  securityTitle: {
    ...theme.typography.subheading,
    fontSize: 16,
    color: theme.colors.primary,
    marginBottom: 4,
  },
  securityText: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
    lineHeight: 20,
  },
});

export default TelegramPayScreen;
