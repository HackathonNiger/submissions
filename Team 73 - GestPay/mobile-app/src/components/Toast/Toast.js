import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Info, 
  X 
} from 'lucide-react-native';
import { TOAST_TYPES } from './ToastContext';
import theme from '../../utils/theme';

const { width: screenWidth } = Dimensions.get('window');

const Toast = ({ toast, onRemove }) => {
  const slideAnim = useRef(new Animated.Value(-screenWidth)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Slide in animation
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleRemove = () => {
    // Slide out animation
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -screenWidth,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onRemove(toast.id);
    });
  };

  const getToastConfig = () => {
    switch (toast.type) {
      case TOAST_TYPES.SUCCESS:
        return {
          icon: CheckCircle,
          colors: ['#10B981', '#059669'],
          backgroundColor: '#ECFDF5',
          borderColor: '#10B981',
          textColor: '#065F46',
        };
      case TOAST_TYPES.ERROR:
        return {
          icon: XCircle,
          colors: ['#EF4444', '#DC2626'],
          backgroundColor: '#FEF2F2',
          borderColor: '#EF4444',
          textColor: '#991B1B',
        };
      case TOAST_TYPES.WARNING:
        return {
          icon: AlertTriangle,
          colors: ['#F59E0B', '#D97706'],
          backgroundColor: '#FFFBEB',
          borderColor: '#F59E0B',
          textColor: '#92400E',
        };
      case TOAST_TYPES.INFO:
      default:
        return {
          icon: Info,
          colors: [theme.colors.accent, theme.colors.primary],
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.accent,
          textColor: theme.colors.text.primary,
        };
    }
  };

  const config = getToastConfig();
  const IconComponent = config.icon;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateX: slideAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <View style={[styles.toast, { borderLeftColor: config.borderColor }]}>
        <LinearGradient
          colors={[config.backgroundColor, config.backgroundColor]}
          style={styles.gradient}
        >
          <View style={styles.content}>
            <View style={styles.iconContainer}>
              <IconComponent
                size={24}
                color={config.borderColor}
                strokeWidth={2}
              />
            </View>
            
            <View style={styles.textContainer}>
              <Text style={[styles.message, { color: config.textColor }]}>
                {toast.message}
              </Text>
              {toast.subtitle && (
                <Text style={[styles.subtitle, { color: config.textColor }]}>
                  {toast.subtitle}
                </Text>
              )}
            </View>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleRemove}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <X size={18} color={config.textColor} strokeWidth={2} />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    paddingHorizontal: 16,
    paddingTop: 60, // Account for status bar
  },
  toast: {
    borderRadius: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
  },
  iconContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  textContainer: {
    flex: 1,
    marginRight: 8,
  },
  message: {
    ...theme.typography.body,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    lineHeight: 20,
  },
  subtitle: {
    ...theme.typography.caption,
    fontSize: 12,
    marginTop: 4,
    opacity: 0.8,
  },
  closeButton: {
    padding: 4,
    marginTop: -2,
  },
});

export default Toast;
