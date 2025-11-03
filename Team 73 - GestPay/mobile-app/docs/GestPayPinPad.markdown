# GestPayPinPad Component

## Overview

`GestPayPinPad` is a reusable PIN dialpad component for React Native applications. It provides a numeric keypad with options for backspace and biometric authentication (fingerprint for Android, face for iOS). The component is designed to be integrated into PIN entry screens or other areas requiring numeric input.

## Features

- **Numeric Buttons**: Buttons for digits 0-9.
- **Backspace**: Button to delete the last entered digit.
- **Biometrics**: Optional biometric button that displays platform-specific icon (Face ID for iOS, Fingerprint for Android).
- **Theming**: Uses the application's theme for consistent styling.
- **Reusable**: Can be used in multiple screens with custom callbacks.

## Props

| Prop Name             | Type        | Default Value | Description                                                                 |
|-----------------------|-------------|---------------|-----------------------------------------------------------------------------|
| `onPressNumber`       | function    | `undefined`   | Callback function when a number button is pressed. Receives the number as string. |
| `onPressBackspace`    | function    | `undefined`   | Callback function when the backspace button is pressed.                     |
| `onPressBiometric`    | function    | `undefined`   | Callback function when the biometric button is pressed (if enabled).        |
| `allowBiometrics`     | boolean     | `false`       | Enables/disables the biometric button.                                      |

## Styling

The component uses the application's theme (`theme.js`) for colors and typography:
- **Buttons**: Circular buttons with shadow effects.
- **Text**: Large, bold digits using `theme.typography.heading`.
- **Biometric Icon**: Colored with `theme.colors.accent`.

## Usage Examples

### Basic PIN Pad without Biometrics
```jsx
import GestPayPinPad from '../components/GestPayPinPad';

<GestPayPinPad
  onPressNumber={(num) => console.log('Number pressed:', num)}
  onPressBackspace={() => console.log('Backspace pressed')}
  allowBiometrics={false}
/>
```

### PIN Pad with Biometrics
```jsx
import GestPayPinPad from '../components/GestPayPinPad';

<GestPayPinPad
  onPressNumber={(num) => handleNumber(num)}
  onPressBackspace={handleBackspace}
  onPressBiometric={handleBiometric}
  allowBiometrics={true}
/>
```

## Notes

- **Biometrics**: The component only renders the icon button; actual biometric authentication logic (e.g., using `expo-local-authentication` or similar) must be implemented in the `onPressBiometric` callback.
- **Layout**: The pad is designed to take 80% width and center itself. Adjust the container styles if needed.
- **Dependencies**: Requires `react-native`, `lucide-react-native` for icons, and `theme.js` for styling. Ensure `Platform` from `react-native` is imported for OS detection.
- **Integration**: Typically used within a `ScrollView` or `KeyboardAvoidingView` for better keyboard handling, though no text input is directly involved.

## Example Integration in PinEntryScreen

```jsx
import React, { useState } from 'react';
import { View } from 'react-native';
import GestPayPinPad from '../components/GestPayPinPad';

const PinEntryScreen = () => {
  const [pin, setPin] = useState('');

  const handleNumber = (num) => {
    setPin(pin + num);
  };

  const handleBackspace = () => {
    setPin(pin.slice(0, -1));
  };

  const handleBiometric = () => {
    // Implement biometric logic
  };

  return (
    <View>
      {/* PIN display logic here */}
      <GestPayPinPad
        onPressNumber={handleNumber}
        onPressBackspace={handleBackspace}
        onPressBiometric={handleBiometric}
        allowBiometrics={true}
      />
    </View>
  );
};
```