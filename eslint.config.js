import globals from "globals";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import eslintConfigPrettier from "eslint-config-prettier"; // Cleaned up import

export default tseslint.config(
  {
    ignores: ["dist", "node_modules"],
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
  },
  {
    languageOptions: { globals: globals.browser },
  },

  // Base JS Recommended rules
  js.configs.recommended,

  // TypeScript & React rulesets
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,

  // Disables linting rules that conflict with Prettier formatting
  eslintConfigPrettier,

  {
    rules: {
      "no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "react/jsx-uses-react": "off", // Off for modern React 17+
      "react/react-in-jsx-scope": "off", // Off for modern React 17+
    },
  },
);
