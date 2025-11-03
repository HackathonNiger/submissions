# GestPayInput Component

## Overview

`GestPayInput` is a reusable, customizable TextInput component for React Native applications, designed to provide a consistent input experience with support for icons, validation, and theming. It integrates with the application's theme (`theme.js`) and supports various input variants for flexible UI design.

## Features

- **Variants**: Supports multiple layouts (`default`, `left-icon`, `right-icon`, `both-icons`).
- **Validation**: Built-in validation for email, password, required fields, and custom validation logic.
- **Theming**: Uses the application's theme for consistent styling (colors, typography).
- **Icons**: Supports left and right icons with dynamic color changes based on focus and error states.
- **Error Handling**: Displays error messages for invalid input.
- **Keyboard Optimization**: Configured to avoid keyboard bouncing issues when used within a `ScrollView` and `KeyboardAvoidingView`.

## Props

| Prop Name             | Type        | Default Value     | Description                                                                 |
|-----------------------|-------------|-------------------|-----------------------------------------------------------------------------|
| `label`               | string      | `undefined`       | Label text displayed above the input.                                       |
| `placeholder`         | string      | `undefined`       | Placeholder text for the input.                                             |
| `value`               | string      | `''`              | The value of the input.                                                     |
| `onChangeText`        | function    | `undefined`       | Callback function for text changes.                                         |
| `leftIcon`            | ReactNode   | `undefined`       | Icon component to display on the left side (used with `left-icon` or `both-icons` variants). |
| `rightIcon`           | ReactNode   | `undefined`       | Icon component to display on the right side (used with `right-icon` or `both-icons` variants). |
| `onRightIconPress`    | function    | `undefined`       | Callback for right icon press.                                              |
| `secureTextEntry`     | boolean     | `false`           | Enables password-style input with hidden text.                              |
| `keyboardType`        | string      | `'default'`       | Keyboard type (e.g., `'email-address'`, `'phone-pad'`).                     |
| `autoCapitalize`      | string      | `'sentences'`     | Auto-capitalization behavior (`'none'`, `'sentences'`, `'words'`, `'characters'`). |
| `autoCorrect`         | boolean     | `true`            | Enables/disables auto-correction.                                          |
| `validationType`      | string      | `'none'`          | Validation type: `'none'`, `'email'`, `'password'`, `'required'`, `'custom'`. |
| `customValidation`    | function    | `null`            | Custom validation function returning `true` (valid) or `false` (invalid).   |
| `customErrorMessage`  | string      | `'Invalid input'` | Error message for custom validation failures.                               |
| `required`            | boolean     | `false`           | Marks the field as required (cannot be empty).                             |
| `minLength`           | number      | `0`               | Minimum length for `'password'` or text validation.                         |
| `variant`             | string      | `'default'`       | Input variant: `'default'`, `'left-icon'`, `'right-icon'`, `'both-icons'`.  |
| `...rest`             | any         | `undefined`       | Additional props passed to the underlying `TextInput` component.            |

## Variants

- **default**: No icons, full-width input.
- **left-icon**: Displays a left icon with adjusted input padding.
- **right-icon**: Displays a right icon with adjusted input padding.
- **both-icons**: Displays both left and right icons with adjusted input padding.

## Validation Types

- **none**: No validation.
- **email**: Validates email format using a regex (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`).
- **password**: Enforces a minimum length specified by `minLength`.
- **required**: Ensures the field is not empty if `required` is `true`.
- **custom**: Uses a custom validation function provided via `customValidation`.

## Styling

The component uses the application's theme (`theme.js`) for consistent colors and typography:
- **Background**: `theme.colors.surface` for the input wrapper.
- **Border**: `theme.colors.gray` (default), `theme.colors.accent` (focused), `theme.colors.error` (error state).
- **Text**: `theme.typography.body` for input text, `theme.typography.caption` for error messages.
- **Icons**: Change color based on state (`theme.colors.text.muted`, `theme.colors.accent`, or `theme.colors.error`).

## Usage Examples

### Email Input with Left Icon
```jsx
import { Mail } from 'lucide-react-native';

<GestPayInput
  label="Email Address"
  placeholder="Enter your email"
  value={email}
  onChangeText={setEmail}
  leftIcon={<Mail size={20} strokeWidth={2} />}
  variant="left-icon"
  keyboardType="email-address"
  autoCapitalize="none"
  autoCorrect={false}
  validationType="email"
  required
/>
```

### Password Input with Both Icons
```jsx
import { Lock, Eye, EyeOff } from 'lucide-react-native';

<GestPayInput
  label="Password"
  placeholder="Enter your password"
  value={password}
  onChangeText={setPassword}
  leftIcon={<Lock size={20} strokeWidth={2} />}
  rightIcon={showPassword ? <EyeOff size={20} strokeWidth={2} /> : <Eye size={20} strokeWidth={2} />}
  onRightIconPress={() => setShowPassword(!showPassword)}
  variant="both-icons"
  secureTextEntry={!showPassword}
  autoCapitalize="none"
  autoCorrect={false}
  validationType="password"
  minLength={8}
  required
/>
```

### Text Input without Icons
```jsx
<GestPayInput
  label="Username"
  placeholder="Enter your username"
  value={username}
  onChangeText={setUsername}
  variant="default"
  validationType="required"
  required
/>
```

### Custom Validation with Right Icon
```jsx
import { Phone } from 'lucide-react-native';

<GestPayInput
  label="Phone Number"
  placeholder="Enter your phone number"
  value={phone}
  onChangeText={setPhone}
  rightIcon={<Phone size={20} strokeWidth={2} />}
  variant="right-icon"
  keyboardType="phone-pad"
  validationType="custom"
  customValidation={(text) => /^\d{10}$/.test(text)}
  customErrorMessage="Phone number must be 10 digits"
  required
/>
```

## Notes

- **Keyboard Behavior**: Ensure the parent `ScrollView` has `keyboardShouldPersistTaps="handled"` or `"always"` and is wrapped in a `KeyboardAvoidingView` to prevent keyboard bouncing issues.
- **Error Display**: Error messages appear below the input in `theme.colors.error` color when validation fails.
- **Customization**: Extend validation types or styling by modifying the `validateInput` function or `styles` object in the component.
- **Dependencies**: Requires `react-native`, `lucide-react-native` for icons, and `theme.js` for styling.

## Example Integration

To use in a screen like `LoginScreen`:
```jsx
import React, { useState } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import GestPayInput from '../components/GestPayInput';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react-native';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView keyboardShouldPersistTaps="handled">
        <GestPayInput
          label="Email Address"
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          leftIcon={<Mail size={20} strokeWidth={2} />}
          variant="left-icon"
          validationType="email"
          required
        />
        <GestPayInput
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          leftIcon={<Lock size={20} strokeWidth={2} />}
          rightIcon={showPassword ? <EyeOff size={20} strokeWidth={2} /> : <Eye size={20} strokeWidth={2} />}
          onRightIconPress={() => setShowPassword(!showPassword)}
          variant="both-icons"
          secureTextEntry={!showPassword}
          validationType="password"
          minLength={8}
          required
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
```