import js from "@eslint/js"
import { defineConfig } from "eslint/config"
import jsdoc from "eslint-plugin-jsdoc"
import neostandard from "neostandard"

export default defineConfig([
    js.configs.recommended,
    ...neostandard(),
    jsdoc.configs["flat/recommended"],
    {
        rules: {
            // Eslint
            "prefer-template": "error",
            "class-methods-use-this": "error",
            "no-shadow": "error",
            "no-negated-condition": "error",
            // Neostandard
            "curly": ["error", "multi-or-nest"],
            "object-shorthand": ["error", "never"],
            "camelcase": "off",
            // Neostandard - Stylistic
            "@stylistic/indent": ["error", 4, { SwitchCase: 1 }],
            "@stylistic/quote-props": ["error", "consistent-as-needed"],
            "@stylistic/quotes": ["error", "double"],
            "@stylistic/space-before-function-paren": ["error", "never"],
            "@stylistic/brace-style": ["error", "stroustrup"],
            // JSDoc
            "jsdoc/require-param-description": "off",
            "jsdoc/require-property-description": "off",
            "jsdoc/require-returns-description": "off",
            "jsdoc/check-indentation": "error",
            "jsdoc/require-jsdoc": ["error", {
                require: {
                    ClassExpression: true,
                    FunctionDeclaration: true,
                    FunctionExpression: true,
                    MethodDefinition: true,
                },
                exemptEmptyFunctions: true,
            }],
            "jsdoc/multiline-blocks": ["error", {
                requireSingleLineUnderCount: 120
            }],
        },
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
        }
    }
])
