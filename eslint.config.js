// @ts-check
const eslint = require("@eslint/js");
const { defineConfig } = require("eslint/config");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");

module.exports = defineConfig([
    {
      files: ["**/*.ts"],
      extends: [
        eslint.configs.recommended,
        tseslint.configs.recommended,
        tseslint.configs.stylistic,
        angular.configs.tsRecommended,
      ],
      processor: angular.processInlineTemplates,
      rules: {
        "@angular-eslint/component-selector": [
            "error",
            {
                type: "element",
                prefix: "ngx",
                style: "kebab-case",
            },
        ],
        "@angular-eslint/directive-selector": [
            "error",
            {
                type: "attribute",
                prefix: "ngx",
                style: "camelCase",
            },
        ],
        "@angular-eslint/no-output-native": "off",
        "@angular-eslint/prefer-inject": "off",
        "@angular-eslint/prefer-standalone": "off",
        "@typescript-eslint/class-literal-property-style": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-unsafe-function-type": "off",
        "@typescript-eslint/no-unused-vars": [
            "error",
            {
                argsIgnorePattern: "_.*",
                varsIgnorePattern: "_.*"
            }
        ],
        "@typescript-eslint/prefer-for-of": "off",
      },
    },
    {
      files: ["**/*.html"],
      extends: [
        angular.configs.templateRecommended,
        angular.configs.templateAccessibility,
      ],
      rules: {},
    }
]);
