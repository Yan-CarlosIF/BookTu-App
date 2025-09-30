// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
const SimpleImportSort = require("eslint-plugin-simple-import-sort");

module.exports = defineConfig([
  ...expoConfig,
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: { "simple-import-sort": SimpleImportSort },
    rules: {
      "simple-import-sort/imports": "warn",
    },
  },
  {
    ignores: ["dist/*"],
  },
]);
