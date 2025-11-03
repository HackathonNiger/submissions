import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
} from "react-native";
import {
  Wallet,
  ArrowUpCircle,
  ArrowDownCircle,
  Activity,
  Send,
  Banknote,
  UserPlus,
  CreditCard,
  ChevronRight,
  Eye,
  EyeOff,
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSelector } from 'react-redux';
import theme from "../utils/theme";
import BottomSheet from "../components/molecules/BottomSheet";
import Header from "../components/molecules/Header";
import { useNavigation } from "@react-navigation/native";
import ScreenWrapper from "../components/layout/ScreenWrapper";
import { selectCurrentUser } from '../store/slices/authSlice';
import { authApi } from '../store/api/authApi';
import { useToast } from '../components/Toast';

const { width } = Dimensions.get("window");

const WalletScreen = () => {
  const navigation = useNavigation();
  const toast = useToast();
  const user = useSelector(selectCurrentUser);
  
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showBalances, setShowBalances] = useState([true, true, true]);
  const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const scrollRef = useRef(null);

  // Fetch user profile and transactions
  const { data: userProfile, refetch: refetchProfile } = authApi.endpoints.getUserProfile.useQuery();
  const { data: transactionsData, refetch: refetchTransactions } = authApi.endpoints.getWalletTransactions.useQuery();

  // Use profile data if available, fallback to Redux user data
  const currentUser = userProfile?.data || user;
  const transactions = transactionsData?.data || [];

  // Format currency
  const formatCurrency = (amount) => {
    const num = parseFloat(amount || 0);
    return `₦${num.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Handle pull to refresh
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([refetchProfile(), refetchTransactions()]);
      toast.success('Data refreshed successfully');
    } catch (error) {
      toast.error('Failed to refresh data');
    } finally {
      setRefreshing(false);
    }
  };

  const cards = [
    {
      title: "Wallet Balance",
      value: formatCurrency(currentUser?.balance || '0.00'),
      icon: <Wallet color="#FFFFFF" size={32} />,
      gradient: ["#1A2E5D", "#4A90E2"],
      textColor: "#FFFFFF",
    },
    {
      title: "Total Credits",
      value: formatCurrency(currentUser?.total_credit || '0.00'),
      icon: <ArrowUpCircle color="#FFFFFF" size={32} />,
      gradient: ["#11998e", "#38ef7d"],
      textColor: "#FFFFFF",
    },
    {
      title: "Total Debits",
      value: formatCurrency(currentUser?.total_debit || '0.00'),
      icon: <ArrowDownCircle color="#FFFFFF" size={32} />,
      gradient: ["#ee0979", "#ff6a00"],
      textColor: "#FFFFFF",
    },
  ];

  const actions = [
    {
      id: "1",
      title: "Send Money",
      icon: <Send color={theme.colors.primary} size={24} />,
      action: () => navigation.navigate('SendMoney'),
    },
    {
      id: "2",
      title: "Transfer",
      icon: <Banknote color={theme.colors.primary} size={24} />,
      action: () => console.log("Transfer"),
    },
    {
      id: "3",
      title: "Fund Wallet",
      icon: <Wallet color={theme.colors.primary} size={24} />,
      action: () => setBottomSheetVisible(true),
    },
    {
      id: "4",
      title: "Add Beneficiary",
      icon: <UserPlus color={theme.colors.primary} size={24} />,
      action: () => navigation.navigate('AddBeneficiary'),
    },
    {
      id: "5",
      title: "Add Card",
      icon: <CreditCard color={theme.colors.primary} size={24} />,
      action: () => console.log("Add Card"),
    },
  ];

  // Format transactions for display
  const formatTransactions = (transactions) => {
    return transactions.slice(0, 5).map((transaction, index) => {
      const isCredit = transaction.type === 'credit';
      const icon = isCredit ? 
        <ArrowUpCircle color={theme.colors.success || '#10B981'} size={20} /> :
        <ArrowDownCircle color={theme.colors.error || '#EF4444'} size={20} />;
      
      const amount = formatCurrency(transaction.amount);
      const description = transaction.description || 'Transaction';
      
      return {
        id: transaction.reference || index.toString(),
        icon,
        text: `${description} - ${amount}`,
        date: transaction.date,
        status: transaction.status,
        type: transaction.type,
        amount: transaction.amount,
        reference: transaction.reference,
      };
    });
  };

  const recentTransactions = formatTransactions(transactions);

  const handleScroll = (event) => {
    const offset = event.nativeEvent.contentOffset.x;
    const index = Math.round(offset / width);
    setCurrentCardIndex(index);
  };

  const toggleBalanceVisibility = (index) => {
    setShowBalances((prev) =>
      prev.map((value, i) => (i === index ? !value : value))
    );
  };

  const handleViewAll = () => {
    console.log("View all transactions");
  };

  const handleTransactionPress = (transaction) => {
    console.log(`Transaction pressed: ${transaction.text}`);
  };

  const sections = [
    {
      id: "cards",
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
                colors={item.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.card}
              >
                <View style={styles.cardPattern}>
                  <View style={styles.circle1} />
                  <View style={styles.circle2} />
                  <View style={styles.circle3} />
                </View>
                <View style={styles.cardContent}>
                  <View style={styles.cardLeft}>
                    <TouchableOpacity
                      onPress={() => toggleBalanceVisibility(index)}
                    >
                      {showBalances[index] ? (
                        <Eye color={item.textColor} size={24} />
                      ) : (
                        <EyeOff color={item.textColor} size={24} />
                      )}
                    </TouchableOpacity>
                    <View style={styles.cardIcon}>{item.icon}</View>
                    <Text style={[styles.cardTitle, { color: item.textColor }]}>
                      {item.title}
                    </Text>
                  </View>
                  <Text style={[styles.cardValue, { color: item.textColor }]}>
                    {showBalances[index] ? item.value : "****"}
                  </Text>
                </View>
              </LinearGradient>
            )}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            snapToInterval={width - 48}
            decelerationRate="fast"
            style={styles.cardsScroll}
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
      id: "actions",
      render: () => (
        <View style={styles.actionsContainer}>
          <Text style={styles.actionsTitle}>Actions</Text>
          <View style={styles.actionsGrid}>
            {actions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={styles.actionItem}
                onPress={action.action}
              >
                <View
                  style={[
                    styles.actionIcon,
                    { backgroundColor: theme.colors.surface },
                  ]}
                >
                  <View style={styles.actionIconGlow} />
                  {action.icon}
                </View>
                <Text style={styles.actionText}>{action.title}</Text>
              </TouchableOpacity>
            ))}
            <View style={styles.actionItem} />
          </View>
        </View>
      ),
    },
    {
      id: "transactions",
      render: () => (
        <View style={styles.transactionsContainer}>
          <View style={styles.transactionsHeader}>
            <Text style={styles.transactionsTitle}>Transaction History</Text>
            <TouchableOpacity
              style={styles.viewAllButton}
              onPress={handleViewAll}
            >
              <Text style={styles.viewAllText}>View All</Text>
              <ChevronRight color={theme.colors.text.muted} size={20} />
            </TouchableOpacity>
          </View>
          <FlatList
            data={recentTransactions}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.transactionItem}
                onPress={() => handleTransactionPress(item)}
              >
                <View style={styles.transactionIconContainer}>
                  <View style={styles.transactionIcon}>{item.icon}</View>
                </View>
                <View style={styles.transactionTextContainer}>
                  <Text style={styles.transactionText}>{item.text}</Text>
                  <Text style={styles.transactionDate}>{item.date}</Text>
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

  return (
    <ScreenWrapper style={styles.container}>
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
      <BottomSheet
        isVisible={isBottomSheetVisible}
        onClose={() => setBottomSheetVisible(false)}
        height="60%"
      >
        <View style={styles.bottomSheetContent}>
          <Text style={styles.bottomSheetTitle}>Fund Your Wallet</Text>
          <View style={styles.accountInfo}>
            <Text style={styles.accountLabel}>Bank Name</Text>
            <Text style={styles.accountValue}>{currentUser?.virtual_account_bank || 'GestPay Bank'}</Text>
          </View>
          <View style={styles.accountInfo}>
            <Text style={styles.accountLabel}>Account Name</Text>
            <Text style={styles.accountValue}>{currentUser?.virtual_account_name || `${currentUser?.first_name} ${currentUser?.last_name}` || 'User'}</Text>
          </View>
          <View style={styles.accountInfo}>
            <Text style={styles.accountLabel}>Account Number</Text>
            <Text style={styles.accountValue}>{currentUser?.virtual_account_number || 'Not Available'}</Text>
          </View>
          {currentUser?.virtual_account_reference && (
            <View style={styles.accountInfo}>
              <Text style={styles.accountLabel}>Reference</Text>
              <Text style={styles.accountValue}>{currentUser.virtual_account_reference}</Text>
            </View>
          )}
          <TouchableOpacity
            style={styles.copyButton}
            onPress={() => console.log("Copy account details")}
          >
            <Text style={styles.copyButtonText}>Copy Details</Text>
          </TouchableOpacity>
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
  listContent: {
    paddingBottom: 24,
  },
  cardsScroll: {
    marginVertical: 10,
    marginHorizontal: 4,
  },
  card: {
    width: width * 0.9,
    marginHorizontal: 5,
    padding: 24,
    borderRadius: 20,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    overflow: "hidden",
  },
  cardPattern: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  circle1: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    top: -50,
    right: -30,
  },
  circle2: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    bottom: -20,
    left: -20,
  },
  circle3: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    top: 40,
    left: 30,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 1,
  },
  cardLeft: {
    alignItems: "flex-start",
  },
  cardIcon: {
    marginVertical: 12,
  },
  cardTitle: {
    ...theme.typography.subheading,
    fontSize: 16,
    opacity: 0.9,
  },
  cardValue: {
    ...theme.typography.heading,
    fontSize: 32,
    fontWeight: "bold",
  },
  indicators: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 24,
    marginHorizontal: 24,
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
    width: 24,
  },
  actionsContainer: {
    marginHorizontal: 24,
    marginBottom: 24,
  },
  actionsTitle: {
    ...theme.typography.subheading,
    fontSize: 20,
    marginBottom: 16,
    color: theme.colors.text.primary,
    fontWeight: "600",
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  actionItem: {
    width: (width - 64) / 3,
    alignItems: "center",
    marginBottom: 16,
  },
  actionIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    overflow: "hidden",
  },
  actionIconGlow: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: theme.colors.primary,
    opacity: 0.08,
  },
  actionText: {
    ...theme.typography.body,
    fontSize: 13,
    marginTop: 8,
    textAlign: "center",
    color: theme.colors.text.primary,
    fontWeight: "500",
  },
  transactionsContainer: {
    marginHorizontal: 24,
    marginBottom: 24,
  },
  transactionsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  transactionsTitle: {
    ...theme.typography.subheading,
    fontSize: 20,
    color: theme.colors.text.primary,
    fontWeight: "600",
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  viewAllText: {
    ...theme.typography.body,
    fontSize: 14,
    color: theme.colors.primary,
    marginRight: 4,
    fontWeight: "500",
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    padding: 16,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  transactionIconContainer: {
    marginRight: 16,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${theme.colors.primary}15`,
    justifyContent: "center",
    alignItems: "center",
  },
  transactionTextContainer: {
    flex: 1,
  },
  transactionText: {
    ...theme.typography.body,
    fontSize: 15,
    color: theme.colors.text.primary,
    fontWeight: "500",
    marginBottom: 2,
  },
  transactionDate: {
    ...theme.typography.caption,
    fontSize: 13,
    color: theme.colors.text.muted,
  },
  bottomSheetContent: {
    flex: 1,
    padding: 24,
    overflow: "hidden",
  },
  bottomSheetPattern: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  bottomSheetTitle: {
    ...theme.typography.subheading,
    fontSize: 24,
    marginBottom: 32,

    color: theme.colors.primary,
    zIndex: 1,
  },
  accountInfo: {
    marginBottom: 20,
    zIndex: 1,
  },
  accountLabel: {
    ...theme.typography.caption,
    fontSize: 14,

    marginBottom: 4,
  },
  accountValue: {
    ...theme.typography.body,
    fontSize: 18,
  },
  copyButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    zIndex: 1,
  },
  copyButtonText: {
    ...theme.typography.button,
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default WalletScreen;
