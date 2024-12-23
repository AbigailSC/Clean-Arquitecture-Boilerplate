import js from '@eslint/js'

const config = {
  env: {
    es2021: true,
    node: true,
  },
  extends: [
    "@commitlint/config-conventional",
    "plugin:prettier/recommended",
    "eslint:recommended",
  ],
  plugins: [
    "unused-imports",
    "import",
    "@typescript-eslint",
    "prettier",
  ],
  ignorePatterns: [
    "dist",
    "public/*",
    "scripts/*",
    "node_modules",
    "build",
  ],
  rules: {
    "no-console": "warn",
    "prettier/prettier": "warn",
    "no-unused-vars": "off",
    "unused-imports/no-unused-vars": "off",
    "unused-imports/no-unused-imports": "warn",
    "object-curly-spacing": [
      "error",
      "never",
    ],
    "no-unexpected-multiline": "warn",
    "@typescript-eslint/no-misused-promises": [
      "error",
      {
        checksVoidReturn: false,
      },
    ],
    "@typescript-eslint/strict-boolean-expressions": "off",
    "@typescript-eslint/no-invalid-void-type": "off",
    "import/order": [
      "warn",
      {
        groups: [
          "type",
          "builtin",
          "object",
          "external",
          "internal",
          "parent",
          "sibling",
          "index",
        ],
        pathGroups: [
          {
            pattern: "~/**",
            group: "external",
            position: "after",
          },
        ],
        newlinesBetween: "always",
      },
    ],
  },
};

export default config;