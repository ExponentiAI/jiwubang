'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (_ref) {
  var t = _ref.types;

  function replacePathIfConfident(path) {
    var evaluated = path.evaluate();
    if (evaluated.confident) {
      path.replaceWith(t.valueToNode(evaluated.value));
      return true;
    }
  }

  return {
    visitor: {
      'BinaryExpression|UnaryExpression': {
        exit: function exit(path) {
          replacePathIfConfident(path);
        }
      },

      ConditionalExpression: {
        exit: function exit(path) {
          var node = path.node;
          var testTruthy = path.get('test').evaluateTruthy();
          if (testTruthy === true) {
            path.replaceWith(node.consequent);
          } else if (testTruthy === false) {
            path.replaceWith(node.alternate);
          }
        }
      },

      LogicalExpression: {
        exit: function exit(path) {
          // 当 || 逻辑表达式的左值不是对象字面量时，babel@6 无法准确求值
          var node = path.node;
          if (node.operator === '||' && !t.isLiteral(node.left)) {
            return
          }
          if (replacePathIfConfident(path)) return;

          if (node.operator !== '&&') return;

          var leftTruthy = path.get('left').evaluateTruthy();
          if (leftTruthy === true) {
            path.replaceWith(node.right);
          }
        }
      },

      IfStatement: {
        exit: function exit(path) {
          var node = path.node;
          var consequent = node.consequent;
          var alternate = node.alternate;
          var test = path.get('test');
          var testTruthy = test.evaluateTruthy();

          // we can check if a test will be falsy 100% and if so we can inline the
          // alternate if there is one and completely remove the consequent
          //
          //   if (false) { bar; } else { foo; } -> { foo; }
          //   if (false) { bar; } ->
          //   if (false) { bar; } else if (foo) { foo; } else { bar; } -> if (foo) { foo; } else { bar; }
          //
          if (testTruthy === false) {
            if (alternate && (!t.isBlockStatement(alternate) || alternate.body.length)) {
              path.replaceWith(alternate);
            } else {
              path.remove();
            }
            return;
          }

          // we can check if a test will be truthy 100% and if so then we can inline
          // the consequent and completely ignore the alternate
          //
          //   if (true) { foo; } -> { foo; }
          //   if ("foo") { foo; } -> { foo; }
          //
          if (testTruthy === true) {
            path.replaceWith(consequent);
            return;
          }

          // remove alternate blocks that are empty
          //
          //   if (foo) { foo; } else {} -> if (foo) { foo; }
          //

          if (t.isBlockStatement(alternate) && !alternate.body.length) {
            alternate = node.alternate = null;
          }

          // if the consequent block is empty turn alternate blocks into a consequent
          // and flip the test
          //
          //   if (foo) {} else { bar; } -> if (!foo) { bar; }
          //

          if (alternate && t.isBlockStatement(consequent) && !consequent.body.length && t.isBlockStatement(alternate) && alternate.body.length) {
            node.test = t.unaryExpression("!", node.test, true);
            node.consequent = node.alternate;
            node.alternate = null;
          }
        }
      }
    }
  };
};
