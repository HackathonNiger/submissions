import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    plugins: {
      'jsx-a11y': (await import('eslint-plugin-jsx-a11y')).default,
    },
    rules: {
      'jsx-a11y/alt-text': 'warn',
      'jsx-a11y/anchor-is-valid': 'error',
      'jsx-a11y/aria-role': 'warn',
      'jsx-a11y/no-autofocus': 'off',
      'jsx-a11y/no-redundant-roles': 'warn',
      'jsx-a11y/media-has-caption': 'warn',
    },
  },
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
];

export default eslintConfig;
