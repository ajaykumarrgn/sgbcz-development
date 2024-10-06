export const rules = {
  'variable-naming': {
    create(context) {
      return {
        VariableDeclarator(node) {
          const name = node.id && node.id.name;  // Ensure `node.id` exists

          if (name && node.init && node.init.type === 'ArrayExpression' && !name.startsWith('la')) {
            context.report({
              node,
              message: 'Array variables should start with "la".',
            });
          }

          if (name && node.init && node.init.type === 'ObjectExpression' && !name.startsWith('ld')) {
            context.report({
              node,
              message: 'Object variables should start with "ld".',
            });
          }

          if (name && node.parent.kind === 'const' && !/^[A-Z_]+$/.test(name)) {
            context.report({
              node,
              message: 'Const variables should be in uppercase and can have underscores.',
            });
          }

          if (name && node.parent.kind !== 'const' && name.includes('_')) {
            context.report({
              node,
              message: 'Variable names should not contain underscores.',
            });
          }
        },
        FunctionDeclaration(node) {
          const name = node.id && node.id.name;  // Ensure `node.id` exists
          if (name && !name.startsWith('fn')) {
            context.report({
              node,
              message: 'Function names should start with "fn".',
            });
          }

          node.params.forEach(param => {
            const paramName = param && param.name;  // Ensure param and param.name exist
            if (paramName && !paramName.startsWith('i')) {
              context.report({
                node: param,
                message: 'Function parameter names should start with "i".',
              });
            }
          });
        }
      };
    }
  },
  'function-naming': {
    create(context) {
      return {
        FunctionDeclaration(node) {
          const name = node.id && node.id.name;  // Ensure `node.id` exists
          if (name && !name.startsWith('fn')) {
            context.report({
              node,
              message: 'Function names should start with "fn".',
            });
          }
        }
      };
    }
  }
};
