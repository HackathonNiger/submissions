# GestPayButton Component

## Overview

`GestPayButton` is a reusable React Native button component for the GestPay app, supporting multiple variants (`primary`, `secondary`, `disabled`) with consistent styling, including a fintech-inspired diagonal line pattern.

## Features

- **Variants**: `primary` (filled, shadow), `secondary` (bordered), `disabled` (grayed out).
- **Icon Support**: Optional icon displayed before the text.
- **Theming**: Uses `theme.js` for colors and typography.
- **Fintech Pattern**: Subtle diagonal lines (`opacity: 0.05`) for a modern look.

## Props

| Prop Name | Type         | Default Value | Description                                    |
|-----------|--------------|---------------|------------------------------------------------|
| `variant` | string       | `'primary'`   | Button style: `primary`, `secondary`, `disabled`. |
| `title`   | string       | `undefined`   | Button text.                                   |
| `icon`    | ReactNode    | `undefined`   | Optional icon to display before text.          |
| `onPress` | function     | `undefined`   | Callback for button press.                     |
| `style`   | object/array | `undefined`   | Additional styles for the button.              |
| `disabled`| boolean      | `false`       | Disables the button if true.                   |

## Styling

- **Primary**: `theme.colors.primary` background, strong shadow, white text.
- **Secondary**: `theme.colors.surface` background, `theme.colors.primary` border, light shadow.
- **Disabled**: `theme.colors.gray` background, muted text, light shadow.
- **Pattern**: Diagonal lines (`backgroundImage`) with `backgroundSize: 20`.

## Usage Example

```jsx
import GestPayButton from '../components/molecules/GestPayButton';
import { UserPlus } from 'lucide-react-native';

<GestPayButton
  variant="primary"
  title="Add New Beneficiary"
  icon={<UserPlus color={theme.colors.surface} size={20} />}
  onPress={() => console.log('Button pressed')}
/>
```

## Notes

- **Dependencies**: Requires `react-native`, `lucide-react-native`, `theme.js`.
- **Accessibility**: Ensure sufficient touch target size (min 48x48 pixels).
- **Customization**: Add more variants (e.g., `outline`, `text`) or patterns as needed.