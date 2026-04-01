import { createRequire } from "module";

const require = createRequire(import.meta.url);

/** @type {import("eslint").Linter.Config[]} */
const nextConfigs = require("eslint-config-next/core-web-vitals");

/**
 * Next 16: `next lint` was removed — use `npm run lint` (eslint).
 * Legacy i18n copy uses `'` and `"` in JSX; fixing hundreds of strings is a separate pass.
 */
export default [
  ...nextConfigs,
  {
    name: "growwise/legacy-pragmatic",
    files: ["**/*.{js,jsx,ts,tsx}"],
    rules: {
      // ~400×: decorative / copy text in JSX (e.g. You're, "word")
      "react/no-unescaped-entities": "off",
      "react-hooks/purity": "warn",
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/rules-of-hooks": "warn",
      "react-hooks/preserve-manual-memoization": "warn",
      "react-hooks/static-components": "warn",
      "react-hooks/refs": "warn",
      "@next/next/no-html-link-for-pages": "warn",
    },
  },
];
