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
        indent: ["warn", "tab"],
        "comma-dangle": ["warn", "never"],
        "no-unused-vars": "off",
        camelcase: ["error", { properties: "never" }],
        "no-param-reassign": ["error", { props: false }],
        "no-shadow": "error",
        "no-restricted-syntax": [
          "error",
          {
            selector: "VariableDeclarator[init.type='ArrayExpression']",
            message: "Use 'la' prefix for array variables",
          },
          {
            selector: "VariableDeclarator[init.type='ObjectExpression']",
            message: "Use 'ld' prefix for object variables",
          },
          {
            selector: "FunctionDeclaration > Identifier",
            message: "Function names should start with 'fn' and follow camelCase",
          },
          {
            selector: "FunctionDeclaration",
            message: "Function names should start with 'fn' and follow camelCase",
          },
          {
            selector: "FunctionDeclaration > Identifier[name=/^(?!im)/]",
            message: "Function parameter names should start with 'im'"
          },
          {
            selector: "FunctionExpression > Identifier[name=/^(?!im)/]",
            message: "Function parameter names should start with 'im'"
          },
          {
            selector: "ArrowFunctionExpression > Identifier[name=/^(?!im)/]",
            message: "Function parameter names should start with 'im'"
          }
        ],
        "max-len": ["warn", { "code": 90 }],
        "no-invalid-this": "off",
        "no-console": "off",
      },
    },
  ];