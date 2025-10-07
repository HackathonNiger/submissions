import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { UserPlus } from 'lucide-react-native';
import GestPayInput from '../components/molecules/GestPayInput';
import BottomSheet from '../components/molecules/BottomSheet';
import GestPayButton from '../components/molecules/GestPayButton';
import Header from '../components/molecules/Header';
import theme from '../utils/theme';
import ScreenWrapper from '../components/layout/ScreenWrapper';

const AddBeneficiaryScreen = () => {
  const navigation = useNavigation();
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const [nickname, setNickname] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [error, setError] = useState('');
  const [beneficiaries, setBeneficiaries] = useState([
    {
      id: '1',
      nickname: 'John Doe',
      accountNumber: '1234567890',
      bankName: 'GestPay Bank',
    },
    {
      id: '2',
      nickname: 'Jane Smith',
      accountNumber: '0987654321',
      bankName: 'First Bank',
    },
  ]);

  const handleAddBeneficiary = () => {
    if (!nickname || !accountNumber || !bankName) {
      setError('Please fill in all required fields');
      return;
    }
    setError('');
    const newBeneficiary = {
      id: (beneficiaries.length + 1).toString(),
      nickname,
      accountNumber,
      bankName,
    };
    setBeneficiaries([...beneficiaries, newBeneficiary]);
    setIsBottomSheetVisible(false);
    setNickname('');
    setAccountNumber('');
    setBankName('');
    // Simulate API call
    console.log('New Beneficiary:', newBeneficiary);
  };

  const handleBeneficiaryPress = (beneficiary) => {
    console.log(`Selected Beneficiary: ${beneficiary.nickname}`);
    // Navigate to beneficiary details or send money
  };

  return (
    <ScreenWrapper>
      <Header variant="back" navigation={navigation} title="Add Beneficiary" />
      <View style={styles.container}>
        <View style={styles.finTechPattern} />
        <GestPayButton
          variant="primary"
          title="Add New Beneficiary"
          icon={<UserPlus color={theme.colors.surface} size={20} />}
          onPress={() => setIsBottomSheetVisible(true)}
          style={styles.addButton}
        />
        <View style={styles.listContainer}>
          <Text style={styles.sectionTitle}>Your Beneficiaries</Text>
          <FlatList
            data={beneficiaries}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.beneficiaryItem}
                onPress={() => handleBeneficiaryPress(item)}
              >
                <View style={styles.beneficiaryInfo}>
                  <Text style={styles.beneficiaryNickname}>{item.nickname}</Text>
                  <Text style={styles.beneficiaryDetails}>
                    {item.accountNumber} • {item.bankName}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No beneficiaries added yet.</Text>
            }
          />
        </View>
      </View>
      <BottomSheet
        isVisible={isBottomSheetVisible}
        onClose={() => {
          setIsBottomSheetVisible(false);
          setError('');
          setNickname('');
          setAccountNumber('');
          setBankName('');
        }}
        height="80%"
      >
        <View style={styles.bottomSheetContent}>
          <View style={styles.finTechPattern} />
          <Text style={styles.formTitle}>Add Beneficiary</Text>
          <GestPayInput
            label="Nickname"
            placeholder="Enter nickname"
            value={nickname}
            onChangeText={setNickname}
            required
          />
          <GestPayInput
            label="Account Number"
            placeholder="Enter account number"
            value={accountNumber}
            onChangeText={setAccountNumber}
            keyboardType="numeric"
            required
          />
          <GestPayInput
            label="Bank Name"
            placeholder="Enter bank name"
            value={bankName}
            onChangeText={setBankName}
            required
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <GestPayButton
            variant="primary"
            title="Save Beneficiary"
            onPress={handleAddBeneficiary}
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
  addButton: {
    marginBottom: 24,
  },
  sectionTitle: {
    ...theme.typography.subheading,
    fontSize: 20,
    color: theme.colors.text.primary,
    marginBottom: 16,
  },
  listContainer: {
    flex: 1,
  },
  beneficiaryItem: {
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
  beneficiaryInfo: {
    flex: 1,
  },
  beneficiaryNickname: {
    ...theme.typography.body,
    fontSize: 16,
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  beneficiaryDetails: {
    ...theme.typography.caption,
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
  emptyText: {
    ...theme.typography.body,
    fontSize: 16,
    color: theme.colors.text.muted,
    textAlign: 'center',
    marginTop: 24,
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
});

export default AddBeneficiaryScreen;