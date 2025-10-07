import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import theme from '../../utils/theme'; // Adjust path if necessary

const GestPayInput = ({
  label,
  placeholder,
  value,
  onChangeText,
  leftIcon,
  rightIcon,
  onRightIconPress,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  autoCorrect = true,
  validationType = 'none', // 'email', 'password', 'required', or 'custom'
  customValidation = null, // Custom validation function
  customErrorMessage = 'Invalid input', // Custom error message for custom validation
  required = false, // Whether the field is required
  minLength = 0, // Minimum length for password or text
  variant = 'default', // 'default', 'left-icon', 'right-icon', 'both-icons'
  ...rest
}) => {
  const [focused, setFocused] = useState(false);
  const [error, setError] = useState(null);

  const validateInput = (text) => {
    // Clear previous error
    setError(null);

    // Required field check
    if (required && !text) {
      setError(`${label || 'This field'} is required`);
      return false;
    }

    // Validation based on type
    if (validationType === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (text && !emailRegex.test(text)) {
        setError('Please enter a valid email address');
        return false;
      }
    } else if (validationType === 'password') {
      if (text && text.length < minLength) {
        setError(`Password must be at least ${minLength} characters`);
        return false;
      }
    } else if (validationType === 'required') {
      if (!text) {
        setError(`${label || 'This field'} cannot be empty`);
        return false;
      }
    } else if (validationType === 'custom' && customValidation) {
      if (text && !customValidation(text)) {
        setError(customErrorMessage);
        return false;
      }
    }

    return true;
  };

  const handleChangeText = (text) => {
    onChangeText(text);
    validateInput(text);
  };

  const handleBlur = () => {
    setFocused(false);
    validateInput(value);
  };

  // Determine input padding based on variant
  const inputStyle = [
    styles.input,
    variant === 'left-icon' || variant === 'both-icons' ? { marginLeft: 12 } : null,
    variant === 'right-icon' || variant === 'both-icons' ? { marginRight: 12 } : null,
  ];

  return (
    <View style={styles.inputGroup}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.inputWrapper,
          focused && styles.inputWrapperFocused,
          error && styles.inputWrapperError,
        ]}
      >
        {(variant === 'left-icon' || variant === 'both-icons') && leftIcon && (
          React.cloneElement(leftIcon, {
            color: error
              ? theme.colors.error
              : focused
              ? theme.colors.accent
              : theme.colors.text.muted,
          })
        )}
        <TextInput
          style={inputStyle}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.text.muted}
          value={value}
          onChangeText={handleChangeText}
          onFocus={() => setFocused(true)}
          onBlur={handleBlur}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          {...rest}
        />
        {(variant === 'right-icon' || variant === 'both-icons') && rightIcon && (
          <TouchableOpacity onPress={onRightIconPress} style={styles.rightIcon}>
            {React.cloneElement(rightIcon, {
              color: error ? theme.colors.error : theme.colors.text.muted,
            })}
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    ...theme.typography.body,
    fontSize: 14,
    fontFamily: 'SpaceGrotesk-Medium',
    color: theme.colors.text.primary,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.gray,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  inputWrapperFocused: {
    borderColor: theme.colors.accent,
    shadowColor: theme.colors.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputWrapperError: {
    borderColor: theme.colors.error,
    shadowColor: theme.colors.error,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    flex: 1,
    ...theme.typography.body,
    fontSize: 16,
    color: theme.colors.text.primary,
  },
  rightIcon: {
    padding: 4,
  },
  errorText: {
    ...theme.typography.caption,
    fontSize: 12,
    color: theme.colors.error,
    marginTop: 4,
    marginLeft: 12,
  },
});

export default GestPayInput;