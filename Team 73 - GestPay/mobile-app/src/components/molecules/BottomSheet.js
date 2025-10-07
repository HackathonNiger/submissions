import React from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Modal from 'react-native-modal';
import theme from '../../utils/theme';

const { height: screenHeight } = Dimensions.get('window');

const BottomSheet = ({ isVisible, onClose, children, height = '60%' }) => {
  const modalHeight = typeof height === 'string' && height.includes('%')
    ? (parseFloat(height) / 100) * screenHeight
    : height;

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection="down"
      style={styles.modal}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      backdropOpacity={0.4}
    >
      <View style={[styles.container, { height: modalHeight }]}>
        <View style={styles.handle} />
        <View style={styles.content}>
          {children}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  container: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 8,
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: theme.colors.gray,
    alignSelf: 'center',
    borderRadius: 2.5,
    marginBottom: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
});

export default BottomSheet;