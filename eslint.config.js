export default [
  {
    languageOptions: {
      globals: {
        frappe: "readonly", // Define frappe as a global variable
        frm: "readonly", // Define frm as a global variable
        doc: "readonly",
        __: "readonly" // Ignore usage of __
      }
    },
    rules: {
      semi: ["error", "always"],
      "indent": ["off"],
      "comma-dangle": ["warn", "never"],
      "no-unused-vars": "off",
      camelcase: ["error", { properties: "never" }],
      "no-param-reassign": ["error", { props: false }],
      "no-shadow": "error",
      "no-restricted-syntax": [
        "error",
        {
          selector: "VariableDeclarator[init.type='ArrayExpression']",
          "message": "Use 'la' or 'ia' prefix for array variables",
        },
        {
          selector: "VariableDeclarator[init.type='ObjectExpression']",
          message: "Use 'ld' or 'id' prefix for object variables",
        },
        {
          selector: "FunctionDeclaration > Identifier",
          "message": "Function names should start with 'fn'",
        },
        {
          selector: "FunctionDeclaration",
          "message": "Function names should start with 'fn'",
        },
        {
          selector: "FunctionDeclaration > Identifier[name=/^(?!i|frm)/]",
          message: "Function parameter names should start with 'i', except 'frm'"
        },
        {
          selector: "FunctionExpression > Identifier[name=/^(?!i|frm)/]",
          message: "Function parameter names should start with 'i', except 'frm'"
        },
        {
          selector: "ArrowFunctionExpression > Identifier[name=/^(?!i|frm)/]",
          message: "Function parameter names should start with 'i', except 'frm'"
        }
      ],
      "max-len": ["warn", { "code": 90 }],
      "no-invalid-this": "off",
      "no-console": "off",
    },
  },
];