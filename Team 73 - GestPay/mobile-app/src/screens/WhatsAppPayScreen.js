import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  Dimensions,
  ActivityIndicator,
  Switch,
  Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  MessageCircle,
  Users,
  Shield,
  CheckCircle,
  AlertCircle,
  Copy,
  ExternalLink,
  ArrowRight,
  QrCode,
  Phone,
  Smartphone,
  Unlink,
  Activity,
} from 'lucide-react-native';
import { useSelector } from 'react-redux';
import theme from '../utils/theme';
import Header from '../components/molecules/Header';
import { selectCurrentUser } from '../store/slices/authSlice';
import { authApi } from '../store/api/authApi';
import { useToast } from '../components/Toast';

const { width } = Dimensions.get('window');

const WhatsAppPayScreen = ({ navigation }) => {
  const toast = useToast();
  const user = useSelector(selectCurrentUser);
  
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [connectedAccount, setConnectedAccount] = useState(null);
  const [qrCode, setQrCode] = useState(null);

  // Fetch user profile and WhatsApp details
  const { data: userProfile, refetch: refetchProfile } = authApi.endpoints.getUserProfile.useQuery();
  const { 
    data: whatsAppDetails, 
    refetch: refetchWhatsApp, 
    isLoading: whatsAppLoading 
  } = authApi.endpoints.getWhatsAppDetails.useQuery(
    undefined,
    { skip: !userProfile?.data?.has_setup_whatsapp }
  );
  
  const [disconnectWhatsApp] = authApi.endpoints.disconnectWhatsApp.useMutation();
  const [toggleWhatsAppPayments] = authApi.endpoints.toggleWhatsAppPayments.useMutation();

  // Use profile data if available, fallback to Redux user data
  const currentUser = userProfile?.data || user;
  const whatsAppData = whatsAppDetails?.data;

  const businessNumber = '+1 555 199 3423'; // Your business WhatsApp number
  const whatsappLink = 'https://wa.me/15551993423';

  const handleOpenWhatsApp = async () => {
    try {
      const supported = await Linking.canOpenURL(whatsappLink);
      if (supported) {
        await Linking.openURL(whatsappLink);
        toast.info('Follow the WhatsApp instructions to complete setup');
      } else {
        toast.error('Unable to open WhatsApp. Please install WhatsApp first.');
      }
    } catch (error) {
      toast.error('Failed to open WhatsApp');
    }
  };

  const handleDisconnect = async () => {
    Alert.alert(
      'Disconnect WhatsApp',
      'Are you sure you want to disconnect your WhatsApp account? This will disable WhatsApp payments.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Disconnect',
          style: 'destructive',
          onPress: async () => {
            try {
              const result = await disconnectWhatsApp().unwrap();
              if (result.success) {
                toast.success('WhatsApp account disconnected successfully');
                refetchProfile();
                refetchWhatsApp();
              }
            } catch (error) {
              toast.error(error.data?.message || 'Failed to disconnect WhatsApp');
            }
          }
        }
      ]
    );
  };

  const handleTogglePayments = async (enabled) => {
    try {
      const result = await toggleWhatsAppPayments(enabled).unwrap();
      if (result.success) {
        toast.success(enabled ? 'WhatsApp payments enabled' : 'WhatsApp payments disabled');
        refetchProfile();
        refetchWhatsApp();
      }
    } catch (error) {
      toast.error(error.data?.message || 'Failed to toggle payments');
    }
  };

  const handleConnectToWhatsApp = async () => {
    if (!phoneNumber.trim()) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }

    // Basic phone number validation
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    if (!phoneRegex.test(phoneNumber.trim())) {
      Alert.alert('Error', 'Please enter a valid phone number with country code');
      return;
    }

    setIsConnecting(true);
    setConnectionStatus('connecting');

    try {
      // Simulate API call to connect to WhatsApp
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // Mock successful connection
      setConnectedAccount({
        phone: phoneNumber,
        name: `WhatsApp User ${phoneNumber.slice(-4)}`,
        verified: Math.random() > 0.3, // 70% chance of verified account
        businessAccount: Math.random() > 0.5, // 50% chance of business account
      });
      
      setConnectionStatus('connected');
      Alert.alert('Success', 'Successfully connected to WhatsApp!');
    } catch (error) {
      setConnectionStatus('disconnected');
      Alert.alert('Error', 'Failed to connect to WhatsApp. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleGenerateQR = () => {
    // Simulate QR code generation
    setQrCode({
      id: Math.random().toString(36).substr(2, 9),
      expiresIn: 300, // 5 minutes
      url: `https://gestpay.app/whatsapp/connect/${Math.random().toString(36).substr(2, 9)}`,
    });
    
    Alert.alert(
      'QR Code Generated', 
      'Scan this QR code with your WhatsApp to connect instantly!'
    );
  };


  const copyBusinessNumber = () => {
    Alert.alert('Copied', `${businessNumber} copied to clipboard`);
  };

  const openWhatsAppBusiness = () => {
    Alert.alert('Opening WhatsApp', 'This would open WhatsApp Business in your WhatsApp app');
  };

  const features = [
    {
      icon: <MessageCircle color={theme.colors.primary} size={24} />,
      title: 'Chat Payments',
      description: 'Send and receive money directly in your WhatsApp conversations',
    },
    {
      icon: <Users color={theme.colors.primary} size={24} />,
      title: 'Group Transactions',
      description: 'Split bills and manage group expenses in WhatsApp groups',
    },
    {
      icon: <Shield color={theme.colors.primary} size={24} />,
      title: 'Business Verified',
      description: 'Secure transactions through WhatsApp Business API',
    },
  ];

  const steps = [
    'Save our business number to contacts',
    'Send us a message on WhatsApp',
    'Enter your phone number below',
    'Start making secure payments!',
  ];

  // Determine connection status based on user data
  const isSetup = currentUser?.has_setup_whatsapp;
  const paymentsEnabled = currentUser?.allow_whatsapp_payments;

  return (
    <LinearGradient
      colors={[theme.colors.background, theme.colors.surface]}
      style={styles.container}
    >
      <Header variant="back" title="Pay via WhatsApp" />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.whatsappIconContainer}>
            <MessageCircle color={theme.colors.success || '#25D366'} size={48} />
          </View>
          <Text style={styles.heroTitle}>
            {isSetup ? 'WhatsApp Connected' : 'Connect to WhatsApp'}
          </Text>
          <Text style={styles.heroSubtitle}>
            {isSetup 
              ? 'Manage your WhatsApp payment settings'
              : 'Make payments seamlessly through WhatsApp Business with your contacts'
            }
          </Text>
        </View>

        {/* Connection Status - Show if setup */}
        {isSetup && (
          whatsAppLoading ? (
            <View style={styles.loadingCard}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
              <Text style={styles.loadingText}>Loading connection details...</Text>
            </View>
          ) : whatsAppData ? (
          <View style={styles.statusCard}>
            <View style={styles.statusHeader}>
              <CheckCircle color={theme.colors.success || '#25D366'} size={24} />
              <Text style={styles.statusTitle}>Connected</Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusBadgeText}>
                  {whatsAppData.session_state === 'linked' ? 'Active' : whatsAppData.session_state}
                </Text>
              </View>
            </View>
            
            <View style={styles.connectionDetails}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Phone Number:</Text>
                <Text style={styles.detailValue}>{whatsAppData.phone_number}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>WhatsApp Number:</Text>
                <Text style={styles.detailValue}>{whatsAppData.whatsapp_number}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Linked At:</Text>
                <Text style={styles.detailValue}>{whatsAppData.linked_at}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Last Activity:</Text>
                <Text style={styles.detailValue}>{whatsAppData.last_activity}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Messages (30 days):</Text>
                <Text style={styles.detailValue}>{whatsAppData.stats?.messages_last_30_days || 0}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Total Transactions:</Text>
                <Text style={styles.detailValue}>{whatsAppData.stats?.total_transactions || 0}</Text>
              </View>
            </View>

            {/* Payment Toggle */}
            <View style={styles.paymentToggle}>
              <View style={styles.toggleInfo}>
                <Text style={styles.toggleTitle}>Enable Payments</Text>
                <Text style={styles.toggleSubtitle}>
                  Allow sending and receiving money via WhatsApp
                </Text>
              </View>
              <Switch
                value={paymentsEnabled}
                onValueChange={handleTogglePayments}
                trackColor={{ false: theme.colors.gray, true: theme.colors.success || '#25D366' }}
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
                onPress={() => refetchWhatsApp()}
              >
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          )
        )}

        {/* Setup Section - Show only if not setup */}
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

            <View style={styles.businessCard}>
              <View style={styles.businessHeader}>
                <Smartphone color={theme.colors.primary} size={20} />
                <Text style={styles.businessTitle}>GestPay Business</Text>
              </View>
              <Text style={styles.businessDescription}>
                Add our official WhatsApp Business number to get started
              </Text>
              <View style={styles.businessActions}>
                <TouchableOpacity style={styles.copyButton} onPress={copyBusinessNumber}>
                  <Copy color={theme.colors.primary} size={16} />
                  <Text style={styles.copyButtonText}>{businessNumber}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.openBusinessButton} onPress={handleOpenWhatsApp}>
                  <Text style={styles.openBusinessButtonText}>Open WhatsApp</Text>
                  <ExternalLink color={theme.colors.surface} size={16} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}


        {/* Features Section */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Why Use WhatsApp Payments?</Text>
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
            <Text style={styles.securityTitle}>WhatsApp Business Security</Text>
            <Text style={styles.securityText}>
              All transactions are processed through WhatsApp Business API with end-to-end encryption. 
              We never access your personal messages.
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
  whatsappIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#25D366', // WhatsApp green
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  whatsappIcon: {
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
    color: theme.colors.success,
    flex: 1,
  },
  verifiedBadge: {
    backgroundColor: '#25D366',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  verifiedText: {
    ...theme.typography.caption,
    color: theme.colors.surface,
    fontSize: 10,
    fontWeight: 'bold',
  },
  accountInfo: {
    marginBottom: 16,
  },
  accountName: {
    ...theme.typography.subheading,
    fontSize: 18,
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  accountPhone: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
    marginBottom: 2,
  },
  accountType: {
    ...theme.typography.caption,
    color: theme.colors.text.muted,
    fontSize: 12,
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
    backgroundColor: '#25D366',
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
  businessCard: {
    backgroundColor: theme.colors.surface,
    padding: 20,
    borderRadius: 16,
    shadowColor: theme.colors.gray,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  businessHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  businessTitle: {
    ...theme.typography.subheading,
    marginLeft: 8,
    color: theme.colors.text.primary,
  },
  businessDescription: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  businessActions: {
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
  openBusinessButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#25D366',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  openBusinessButtonText: {
    ...theme.typography.button,
    color: theme.colors.surface,
    fontSize: 14,
    marginRight: 8,
  },
  connectionSection: {
    marginHorizontal: 24,
    marginBottom: 24,
  },
  methodCard: {
    backgroundColor: theme.colors.surface,
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: theme.colors.gray,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  methodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  methodTitle: {
    ...theme.typography.subheading,
    marginLeft: 8,
    color: theme.colors.text.primary,
  },
  methodDescription: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  qrCodeContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  qrCodePlaceholder: {
    backgroundColor: theme.colors.background,
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.primary + '20',
    borderStyle: 'dashed',
  },
  qrCodeText: {
    ...theme.typography.subheading,
    color: theme.colors.primary,
    marginTop: 8,
    fontSize: 16,
  },
  qrCodeExpiry: {
    ...theme.typography.caption,
    color: theme.colors.text.muted,
    marginTop: 4,
  },
  methodButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  methodButtonSecondary: {
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  methodButtonText: {
    ...theme.typography.button,
    color: theme.colors.surface,
  },
  methodButtonTextSecondary: {
    color: theme.colors.primary,
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.gray,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: theme.colors.text.primary,
  },
  connectButton: {
    backgroundColor: '#25D366',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#25D366',
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
    backgroundColor: '#25D366' + '05',
    marginHorizontal: 24,
    marginBottom: 32,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#25D366' + '20',
  },
  securityContent: {
    flex: 1,
    marginLeft: 12,
  },
  securityTitle: {
    ...theme.typography.subheading,
    fontSize: 16,
    color: '#25D366',
    marginBottom: 4,
  },
  securityText: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
    lineHeight: 20,
  },
});

export default WhatsAppPayScreen;
