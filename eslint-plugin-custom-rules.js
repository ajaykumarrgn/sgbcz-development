export const rules = {
    'variable-naming': {
      create(context) {
        return {
          VariableDeclarator(node) {
            const name = node.id.name;
  
            if (node.init && node.init.type === 'ArrayExpression' && !name.startsWith('la')) {
              context.report({
                node,
                message: 'Array variables should start with "la".',
              });
            }
  
            if (node.init && node.init.type === 'ObjectExpression' && !name.startsWith('ld')) {
              context.report({
                node,
                message: 'Object variables should start with "ld".',
              });
            }
  
            if (node.parent.kind === 'const' && !/^[A-Z_]+$/.test(name)) {
              context.report({
                node,
                message: 'Const variables should be in uppercase and can have underscores.',
              });
            }
  
            if (node.parent.kind !== 'const' && name.includes('_')) {
              context.report({
                node,
                message: 'Variable names should not contain underscores.',
              });
            }
          },
          FunctionDeclaration(node) {
            const name = node.id.name;
            if (!name.startsWith('fn')) {
              context.report({
                node,
                message: 'Function names should start with "fn".',
              });
            }
  
            node.params.forEach(param => {
              if (!param.name.startsWith('i')) {
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
            const name = node.id.name;
            if (!name.startsWith('fn')) {
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