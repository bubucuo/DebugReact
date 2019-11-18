'use strict';

module.exports = function (context) {
  function reportLoopPresence(node) {
    context.report(node, 'for..of loops are not allowed', { identifier: node.name });
  }

  return {
    ForOfStatement: reportLoopPresence
  };
};
