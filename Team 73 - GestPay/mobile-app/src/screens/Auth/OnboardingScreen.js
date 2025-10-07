// OnboardingScreen.js
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Scan, MessageSquare, MapPin, ArrowRight, ChevronRight } from 'lucide-react-native';
import theme from '../../utils/theme';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const onboardingData = [
  {
    id: 1,
    title: 'Pay with Your Face & Voice',
    description: "Complete transactions instantly using FacePay or VoicePay. No PIN, no cards, no hassle — just smile or speak.",
    icon: Scan,
    gradient: [theme.colors.gradient.start, theme.colors.gradient.middle],
    features: ['Biometric security', 'Lightning-fast checkout', 'Works offline'],
  },
  {
    id: 2,
    title: 'Geo-Verified Security',
    description: "Payments are only authorized when you're physically near the business. Location-based protection blocks fraud before it happens.",
    icon: MapPin,
    gradient: [theme.colors.gradient.middle, theme.colors.gradient.end],
    features: ['Fraud prevention', 'Physical verification', 'Real-time location'],
  },
  {
    id: 3,
    title: 'Pay Within Your Chat',
    description: 'Send and receive money directly on WhatsApp or Telegram. No app switching, no interruptions — just natural conversation.',
    icon: MessageSquare,
    gradient: [theme.colors.gradient.start, theme.colors.success],
    features: ['WhatsApp & Telegram', 'Instant transfers, No app switching'],
  },
];

const OnboardingScreen = () => {
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef(null);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    {
      useNativeDriver: false,
      listener: (event) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        const index = Math.round(offsetX / width);
        setCurrentIndex(index);
      },
    }
  );

  const scrollToIndex = (index) => {
    scrollViewRef.current?.scrollTo({ x: index * width, animated: true });
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[theme.colors.background, theme.colors.surface]}
        style={styles.background}
      >
        {/* Logo & Skip */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image source={require('../../../assets/logo.png')} style={styles.logoImage} />
            <Text style={styles.logo}>GestPay</Text>
          </View>
          <TouchableOpacity style={styles.skipButton} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>

        {/* Slider */}
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          style={styles.scrollView}
        >
          {onboardingData.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <View key={item.id} style={styles.slide}>
                <View style={styles.iconWrapper}>
                  <LinearGradient
                    colors={item.gradient}
                    style={styles.iconContainer}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <IconComponent color={theme.colors.surface} size={72} strokeWidth={1.5} />
                  </LinearGradient>
                </View>

                <View style={styles.textContainer}>
                  <Text style={styles.title}>{item.title}</Text>
                  <Text style={styles.description}>{item.description}</Text>
                </View>

                {/* Feature highlights */}
                <View style={styles.featuresContainer}>
                  {item.features.map((feature, idx) => (
                    <View key={idx} style={styles.featureItem}>
                      <View style={styles.checkmark}>
                        <Text style={styles.checkmarkText}>✓</Text>
                      </View>
                      <Text style={styles.featureText}>{feature}</Text>
                    </View>
                  ))}
                </View>
              </View>
            );
          })}
        </ScrollView>

        {/* Pagination Dots */}
        <View style={styles.pagination}>
          {onboardingData.map((_, index) => {
            const inputRange = [
              (index - 1) * width,
              index * width,
              (index + 1) * width,
            ];

            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [8, 32, 8],
              extrapolate: 'clamp',
            });

            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.3, 1, 0.3],
              extrapolate: 'clamp',
            });

            return (
              <Animated.View
                key={index}
                style={[
                  styles.dot,
                  {
                    width: dotWidth,
                    opacity,
                  },
                ]}
              />
            );
          })}
        </View>

        {/* Bottom Buttons */}
        <View style={styles.bottomContainer}>
          {currentIndex === onboardingData.length - 1 ? (
            <>
              <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('Register')}>
                <LinearGradient
                  colors={[theme.colors.gradient.start, theme.colors.gradient.middle]}
                  style={styles.buttonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.primaryButtonText}>Create Account</Text>
                  <ArrowRight color={theme.colors.surface} size={20} strokeWidth={2.5} />
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('Login')}>
                <Text style={styles.secondaryButtonText}>Sign In</Text>
              </TouchableOpacity>

              <Text style={styles.termsText}>
                By continuing, you agree to our{' '}
                <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
                <Text style={styles.termsLink}>Privacy Policy</Text>
              </Text>
            </>
          ) : (
            <TouchableOpacity
              style={styles.nextButton}
              onPress={() => scrollToIndex(currentIndex + 1)}
            >
              <LinearGradient
                colors={[theme.colors.gradient.middle, theme.colors.gradient.start]}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.nextButtonText}>Continue</Text>
                <ChevronRight color={theme.colors.surface} size={20} strokeWidth={2.5} />
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  background: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoImage: {
    width: 32,
    height: 32,
    marginRight: 8,
    borderRadius: 4,
  },
  logo: {
    ...theme.typography.heading,
    fontSize: 28,
    letterSpacing: -0.5,
  },
  skipButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  skipText: {
    ...theme.typography.body,
    fontSize: 15,
    color: theme.colors.text.secondary,
    fontFamily: 'SpaceGrotesk-Medium',
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingTop: 60,
  },
  iconWrapper: {
    marginBottom: 40,
  },
  iconContainer: {
    width: 140,
    height: 140,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 15,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    ...theme.typography.heading,
    fontSize: 32,
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: -0.5,
    lineHeight: 38,
  },
  description: {
    ...theme.typography.body,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 26,
    paddingHorizontal: 8,
    color: theme.colors.text.secondary,
  },
  featuresContainer: {
    width: '100%',
    paddingHorizontal: 20,
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: theme.colors.surface,
    fontSize: 14,
    fontFamily: 'SpaceGrotesk-Bold',
  },
  featureText: {
    ...theme.typography.body,
    fontSize: 15,
    fontFamily: 'Inter-Medium',
    letterSpacing: 0.2,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  dot: {
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.accent,
    marginHorizontal: 4,
  },
  bottomContainer: {
    paddingHorizontal: 24,
    paddingBottom: 48,
    gap: 12,
  },
  primaryButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonGradient: {
    paddingVertical: 18,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryButtonText: {
    ...theme.typography.button,
    fontSize: 17,
    fontFamily: 'SpaceGrotesk-SemiBold',
    letterSpacing: 0.3,
  },
  secondaryButton: {
    paddingVertical: 18,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: theme.colors.gray,
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
  },
  secondaryButtonText: {
    fontSize: 17,
    fontFamily: 'SpaceGrotesk-SemiBold',
    color: theme.colors.primary,
    letterSpacing: 0.3,
  },
  nextButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: theme.colors.accent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  nextButtonText: {
    ...theme.typography.button,
    fontSize: 17,
    fontFamily: 'SpaceGrotesk-SemiBold',
    letterSpacing: 0.3,
  },
  termsText: {
    ...theme.typography.caption,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 12,
    color: theme.colors.text.muted,
  },
  termsLink: {
    color: theme.colors.accent,
    fontFamily: 'Inter-Medium',
  },
});

export default OnboardingScreen;