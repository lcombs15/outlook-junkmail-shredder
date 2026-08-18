import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
    globalIgnores(["build/", ".react-router", "bin/"]),
    {
        files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
        plugins: { js },
        extends: ["js/recommended"],
        languageOptions: { globals: { ...globals.browser, ...globals.node } },
    },
    tseslint.configs.recommended,
    pluginReact.configs.flat.recommended,
    reactHooks.configs.flat.recommended,
    {
        rules: {
            "react/react-in-jsx-scope": "off",
            "react-hooks/exhaustive-deps": "error",
        },
        settings: {
            react: {
                version: "detect",
            },
        },
    },
]);
