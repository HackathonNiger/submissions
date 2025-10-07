import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Dimensions, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Wallet, ArrowUpCircle, ArrowDownCircle, UserCheck, Activity, Mic, ScanFace, Fingerprint, ChevronRight, Eye, EyeOff, CheckCircle } from 'lucide-react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import theme from '../utils/theme';
import Header from '../components/molecules/Header';
import { selectCurrentUser } from '../store/slices/authSlice';
import { authApi } from '../store/api/authApi';
import { useToast } from '../components/Toast';

const { width } = Dimensions.get('window');

const HomeScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const toast = useToast();
  const user = useSelector(selectCurrentUser);
  
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showBalances, setShowBalances] = useState([true, true, true]); // Toggle for each card
  const [refreshing, setRefreshing] = useState(false);
  const scrollRef = useRef(null);

  // Fetch user profile on component mount
  const { data: userProfile, isLoading, refetch } = authApi.endpoints.getUserProfile.useQuery();

  // Use profile data if available, fallback to Redux user data
  const currentUser = userProfile?.data || user;

  useEffect(() => {
    // Refetch user profile when component mounts to get latest data
    refetch();
  }, []);

  // Debug: Log user data to console
  useEffect(() => {
    if (currentUser) {
      console.log('Current user data:', {
        balance: currentUser.balance,
        total_credit: currentUser.total_credit,
        total_debit: currentUser.total_debit,
        first_name: currentUser.first_name,
      });
    }
  }, [currentUser]);

  // Handle pull to refresh
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
      toast.success('Data refreshed successfully');
    } catch (error) {
      toast.error('Failed to refresh data');
    } finally {
      setRefreshing(false);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    const num = parseFloat(amount || 0);
    return `₦${num.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const cards = [
    {
      title: 'Wallet Balance',
      value: formatCurrency(currentUser?.balance || '0.00'),
      icon: <Wallet color={theme.colors.surface} size={24} />,
      backgroundColors: [theme.colors.gradient.start, theme.colors.gradient.middle],
      textColor: theme.colors.surface,
    },
    {
      title: 'Total Credits',
      value: formatCurrency(currentUser?.total_credit || '0.00'),
      icon: <ArrowUpCircle color={theme.colors.surface} size={24} />,
      backgroundColors: [theme.colors.gradient.middle, theme.colors.gradient.end],
      textColor: theme.colors.surface,
    },
    {
      title: 'Total Debits',
      value: formatCurrency(currentUser?.total_debit || '0.00'),
      icon: <ArrowDownCircle color={theme.colors.surface} size={24} />,
      backgroundColors: [theme.colors.gradient.end, theme.colors.gradient.start],
      textColor: theme.colors.surface,
    },
  ];

  const recentActivities = [
    { id: '1', icon: <Activity color={theme.colors.primary} size={20} />, text: 'Received ₦100 from Friend', date: 'Oct 4, 2024' },
    { id: '2', icon: <Activity color={theme.colors.primary} size={20} />, text: 'Withdrew ₦50 to Bank', date: 'Oct 3, 2024' },
    { id: '3', icon: <Activity color={theme.colors.primary} size={20} />, text: 'Set up FacePay', date: 'Oct 2, 2024' },
  ];

  const handleScroll = (event) => {
    const offset = event.nativeEvent.contentOffset.x;
    const index = Math.round(offset / (width * 0.4));
    setCurrentCardIndex(index);
  };

  const handleSetup = (app) => {
    console.log(`Setup ${app} payments`);
    if (app === 'Telegram') {
      navigation.navigate('TelegramPay');
    } else if (app === 'WhatsApp') {
      navigation.navigate('WhatsAppPay');
    }
  };

  const handleKYC = () => {
    console.log('Complete KYC');
    // Navigate to KYC screen
  };

  const handleBiometricReceive = (type) => {
    if (type === 'FacePay' && !currentUser?.allow_face_payments) {
      toast.info('Please enable FacePay in settings first');
      return;
    }
    if (type === 'VoicePay' && !currentUser?.allow_voice_payments) {
      toast.info('Please enable VoicePay in settings first');
      return;
    }
    console.log(`Receive payment via ${type}`);
    // Handle biometric payment receipt
  };

  const toggleBalanceVisibility = (index) => {
    setShowBalances((prev) =>
      prev.map((value, i) => (i === index ? !value : value))
    );
  };

  const handleActivityPress = (activity) => {
    console.log(`Activity pressed: ${activity.text}`);
    // Navigate to activity details
  };

  // Filter sections to only show incomplete setups
  const getVisibleSections = () => {
    const allSections = [
    {
      id: 'greeting',
      render: () => (
        <Text style={styles.greeting}>
          Hello, {currentUser?.first_name || 'User'}
        </Text>
      ),
    },
    {
      id: 'shortcuts',
      render: () => {
        const showFacePay = currentUser?.allow_face_payments;
        const showVoicePay = currentUser?.allow_voice_payments;
        
        if (!showFacePay && !showVoicePay) {
          return null; // Don't render shortcuts if no biometric payments are enabled
        }
        
        return (
          <View style={styles.shortcutsContainer}>
            {showFacePay && (
              <TouchableOpacity style={styles.shortcutButton} onPress={() => handleBiometricReceive('FacePay')}>
                <ScanFace color={theme.colors.primary} size={24} />
                <Text style={styles.shortcutText}>Receive via FacePay</Text>
              </TouchableOpacity>
            )}
            {showVoicePay && (
              <TouchableOpacity style={styles.shortcutButton} onPress={() => handleBiometricReceive('VoicePay')}>
                <Mic color={theme.colors.primary} size={24} />
                <Text style={styles.shortcutText}>Receive via VoicePay</Text>
              </TouchableOpacity>
            )}
          </View>
        );
      },
    },
    {
      id: 'cards',
      render: () => (
        <>
          <FlatList
            ref={scrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            data={cards}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item, index }) => (
              <LinearGradient
                colors={item.backgroundColors}
                style={styles.card}
              >
                <View style={styles.cardContent}>
                  <View style={styles.cardLeft}>
                    <TouchableOpacity onPress={() => toggleBalanceVisibility(index)}>
                      {showBalances[index] ? (
                        <Eye color={item.textColor} size={20} />
                      ) : (
                        <EyeOff color={item.textColor} size={20} />
                      )}
                    </TouchableOpacity>
                    <View style={styles.cardIcon}>{item.icon}</View>
                    <Text style={[styles.cardTitle, { color: item.textColor }]}>{item.title}</Text>
                  </View>
                  <Text style={[styles.cardValue, { color: item.textColor }]}>
                    {showBalances[index] ? item.value : '****'}
                  </Text>
                </View>
              </LinearGradient>
            )}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            snapToInterval={width * 0.4}
            decelerationRate="fast"
          />
          <View style={styles.indicators}>
            {cards.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  currentCardIndex === index ? styles.activeIndicator : null,
                ]}
              />
            ))}
          </View>
        </>
      ),
    },
    {
      id: 'biometrics',
      render: () => {
        const hasBiometricSetup = currentUser?.has_setup_biometric;
        const allowFace = currentUser?.allow_face_payments;
        const allowVoice = currentUser?.allow_voice_payments;
        
        // Don't show if biometrics are fully set up
        if (hasBiometricSetup && allowFace && allowVoice) {
          return null;
        }
        
        return (
          <View style={styles.actionCard}>
            <View style={styles.actionHeader}>
              {hasBiometricSetup ? (
                <CheckCircle color={theme.colors.success || '#10B981'} size={24} />
              ) : (
                <Fingerprint color={theme.colors.primary} size={24} />
              )}
              <Text style={[styles.actionTitle, { marginLeft: 12 }]}>
                {hasBiometricSetup ? 'Complete Biometric Setup' : 'Setup Biometrics'}
              </Text>
            </View>
            <Text style={styles.actionSubtitle}>
              {hasBiometricSetup 
                ? 'Enable additional biometric payment methods'
                : 'Enable FacePay and VoicePay for secure payments'
              }
            </Text>
            <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('FaceSetupScreen')}>
              <Text style={styles.actionButtonText}>
                {hasBiometricSetup ? 'Enable More' : 'Setup Now'}
              </Text>
            </TouchableOpacity>
          </View>
        );
      },
    },
    {
      id: 'chat',
      render: () => {
        const hasTelegramSetup = currentUser?.has_setup_telegram;
        const hasWhatsAppSetup = currentUser?.has_setup_whatsapp;
        const allowTelegram = currentUser?.allow_telegram_payments;
        const allowWhatsApp = currentUser?.allow_whatsapp_payments;
        
        return (
          <View style={styles.actionCard}>
            <Text style={styles.actionTitle}>Chat Payments</Text>
            <Text style={styles.actionSubtitle}>Pay via WhatsApp or Telegram</Text>
            
            {/* Always show Telegram button */}
            <View style={styles.chatButton}>
              <TouchableOpacity style={styles.chatAppRow} onPress={() => handleSetup('Telegram')}>
                <Image
                  source={require('../../assets/images/telegram-logo.png')}
                  style={styles.chatLogo}
                />
                <View style={styles.chatTextContainer}>
                  <Text style={styles.chatText}>
                    {hasTelegramSetup && allowTelegram 
                      ? 'Manage Telegram Connection'
                      : hasTelegramSetup 
                        ? 'Enable Telegram Payments' 
                        : 'Setup Telegram Payments'
                    }
                  </Text>
                  {hasTelegramSetup && allowTelegram && (
                    <CheckCircle color={theme.colors.success || '#10B981'} size={16} />
                  )}
                </View>
              </TouchableOpacity>
            </View>
            
            {/* Always show WhatsApp button */}
            <View style={styles.chatButton}>
              <TouchableOpacity style={styles.chatAppRow} onPress={() => handleSetup('WhatsApp')}>
                <Image
                  source={require('../../assets/images/whatsapp-logo.png')}
                  style={styles.chatLogo}
                />
                <View style={styles.chatTextContainer}>
                  <Text style={styles.chatText}>
                    {hasWhatsAppSetup && allowWhatsApp 
                      ? 'Manage WhatsApp Connection'
                      : hasWhatsAppSetup 
                        ? 'Enable WhatsApp Payments' 
                        : 'Setup WhatsApp Payments'
                    }
                  </Text>
                  {hasWhatsAppSetup && allowWhatsApp && (
                    <CheckCircle color={theme.colors.success || '#10B981'} size={16} />
                  )}
                </View>
              </TouchableOpacity>
            </View>
          </View>
        );
      },
    },
    {
      id: 'kyc',
      render: () => (
        <View style={styles.actionCard}>
          <View style={styles.kycRow}>
            <Image
              source={require('../../assets/images/kyc-image.png')} // Add small KYC image asset
              style={styles.kycImage}
            />
            <View style={styles.kycTextContainer}>
              <Text style={styles.actionTitle}>Complete Your KYC</Text>
              <Text style={styles.actionSubtitle}>Verify your identity to unlock full features</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.actionButton} onPress={handleKYC}>
            <Text style={styles.actionButtonText}>Finish KYC</Text>
          </TouchableOpacity>
        </View>
      ),
    },
    {
      id: 'activities',
      render: () => (
        <View style={styles.activitiesContainer}>
          <Text style={styles.activitiesTitle}>Recent Activities</Text>
          <FlatList
            data={recentActivities}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.activityItem} onPress={() => handleActivityPress(item)}>
                <View style={styles.activityIcon}>{item.icon}</View>
                <View style={styles.activityTextContainer}>
                  <Text style={styles.activityText}>{item.text}</Text>
                  <Text style={styles.activityDate}>{item.date}</Text>
                </View>
                <ChevronRight color={theme.colors.text.muted} size={20} />
              </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={false}
          />
        </View>
      ),
    },
  ];

    // Filter out sections that should be hidden
    return allSections.filter(section => {
      const sectionElement = section.render();
      return sectionElement !== null;
    });
  };

  const sections = getVisibleSections();

  return (
    <LinearGradient
      colors={[theme.colors.background, theme.colors.surface]}
      style={styles.container}
    >
      <Header variant="logo-actions" />
      <FlatList
        data={sections}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => item.render()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 24,
  },
  greeting: {
    ...theme.typography.heading,
    fontSize: 24,
    paddingHorizontal: 24,
    marginTop: 16,
    marginBottom: 16,
    color: theme.colors.text.primary,
  },
  shortcutsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  shortcutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: 12,
    borderRadius: 12,
    shadowColor: theme.colors.gray,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  shortcutText: {
    ...theme.typography.body,
    marginLeft: 8,
    color: theme.colors.text.primary,
  },
  card: {
    width: width * 0.7,
    marginHorizontal: 8,
    padding: 16,
    borderRadius: 12,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardLeft: {
    alignItems: 'flex-start',
  },
  cardIcon: {
    marginVertical: 8,
  },
  cardTitle: {
    ...theme.typography.subheading,
    fontSize: 16,
  },
  cardValue: {
    ...theme.typography.heading,
    fontSize: 20,
  },
  indicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
    marginTop: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.gray,
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: theme.colors.primary,
    width: 12,
  },
  actionCard: {
    backgroundColor: theme.colors.surface,
    marginHorizontal: 24,
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
    shadowColor: theme.colors.gray,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionTitle: {
    ...theme.typography.subheading,
    fontSize: 18,
    color: theme.colors.text.primary,
  },
  actionSubtitle: {
    ...theme.typography.body,
    fontSize: 14,
    color: theme.colors.text.secondary,
    marginBottom: 16,
  },
  actionButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    ...theme.typography.button,
    color: theme.colors.surface,
  },
  chatButton: {
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
  },
  chatAppRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  chatLogo: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  chatTextContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chatText: {
    ...theme.typography.body,
    fontSize: 16,
    color: theme.colors.text.primary,
    flex: 1,
  },
  kycRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  kycImage: {
    width: 48,
    height: 48,
    marginRight: 16,
    borderRadius: 8,
  },
  kycTextContainer: {
    flex: 1,
  },
  activitiesContainer: {
    marginHorizontal: 24,
    marginBottom: 24,
  },
  activitiesTitle: {
    ...theme.typography.subheading,
    fontSize: 18,
    marginBottom: 16,
    color: theme.colors.text.primary,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    padding: 12,
    backgroundColor: theme.colors.surface,
    borderRadius: 8,
    shadowColor: theme.colors.gray,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  activityIcon: {
    marginRight: 16,
  },
  activityTextContainer: {
    flex: 1,
  },
  activityText: {
    ...theme.typography.body,
    fontSize: 14,
    color: theme.colors.text.primary,
  },
  activityDate: {
    ...theme.typography.caption,
    fontSize: 12,
    color: theme.colors.text.muted,
  },
});

export default HomeScreen;