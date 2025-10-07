import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import theme from '../../utils/theme';

const GestPayButton = ({ variant = 'primary', title, icon, onPress, style, disabled = false }) => {
  const getButtonStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          container: {
            backgroundColor: theme.colors.primary,
            shadowColor: theme.colors.gray,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.25,
            shadowRadius: 12,
            elevation: 8,
          },
          text: {
            color: theme.colors.surface,
          },
        };
      case 'secondary':
        return {
          container: {
            backgroundColor: theme.colors.surface,
            borderWidth: 1,
            borderColor: theme.colors.primary,
            shadowColor: theme.colors.gray,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
          },
          text: {
            color: theme.colors.primary,
          },
        };
      case 'disabled':
        return {
          container: {
            backgroundColor: theme.colors.gray,
            shadowColor: theme.colors.gray,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
          },
          text: {
            color: theme.colors.text.muted,
          },
        };
      default:
        return {
          container: {},
          text: {},
        };
    }
  };

  const { container, text } = getButtonStyles();

  return (
    <TouchableOpacity
      style={[styles.button, container, style, disabled && styles.disabledButton]}
      onPress={onPress}
      disabled={disabled || variant === 'disabled'}
    >
      <View style={styles.finTechPattern} />
      <View style={styles.content}>
        {icon && <View style={styles.icon}>{icon}</View>}
        <Text style={[styles.text, text, icon && { marginLeft: 8 }]}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    overflow: 'hidden',
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  finTechPattern: {
    ...StyleSheet.absoluteFill,
    opacity: 0.05,
    backgroundColor: theme.colors.gray,
    backgroundImage: `linear-gradient(45deg, ${theme.colors.text.muted} 25%, transparent 25%, transparent 50%, ${theme.colors.text.muted} 50%, ${theme.colors.text.muted} 75%, transparent 75%, transparent)`,
    backgroundSize: 20,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    ...theme.typography.button,
    fontSize: 16,
  },
  icon: {
    marginRight: 8,
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export default GestPayButton;