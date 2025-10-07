import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform, Animated } from 'react-native';
import { Home, Wallet, Fingerprint, MessageCircle } from 'lucide-react-native';
import theme from '../../utils/theme'; // Adjust path if necessary

const BottomNavBar = ({ navigation, state }) => {
  const routes = [
    { name: 'Home', icon: Home, filledIcon: Home },
    { name: 'Wallet', icon: Wallet, filledIcon: Wallet },
    { name: 'Biometric', icon: Fingerprint, filledIcon: Fingerprint },
    { name: 'AIChat', icon: MessageCircle, filledIcon: MessageCircle },
  ];

  const animatedScales = routes.map(() => new Animated.Value(1));

  const handlePressIn = (index) => {
    Animated.spring(animatedScales[index], {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = (index) => {
    Animated.spring(animatedScales[index], {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      <View style={styles.navContainer}>
        {routes.map((route, index) => {
          const isActive = state.index === index;
          const IconComponent = isActive ? route.filledIcon : route.icon;
          return (
            <TouchableOpacity
              key={route.name}
              style={styles.navButton}
              onPressIn={() => handlePressIn(index)}
              onPressOut={() => handlePressOut(index)}
              onPress={() => navigation.navigate(route.name)}
            >
              <Animated.View style={{ transform: [{ scale: animatedScales[index] }] }}>
                <IconComponent
                  color={isActive ? theme.colors.primary : theme.colors.text.muted}
                  size={24}
                  strokeWidth={isActive ? 2.5 : 2}
                  fill={isActive ? theme.colors.primary : 'none'}
                />
              </Animated.View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface + 'F2', // Semi-transparent light background
    paddingBottom: Platform.OS === 'ios' ? 20 : 10, // Safe area for iPhone notch
    paddingTop: 10,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 6,
  },
  navContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  navButton: {
    padding: 12,
    alignItems: 'center',
  },
});

export default BottomNavBar;