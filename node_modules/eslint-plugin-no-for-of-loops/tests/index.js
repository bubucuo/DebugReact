'use strict';

var rule = require('../lib/no-for-of-loops.js');
var RuleTester = require('eslint').RuleTester;

var ruleTester = new RuleTester();
ruleTester.run('no-for-of-loops', rule, {
  valid: [
    {
      code: 'for (var i; i <= n; i++) { console.log(i); }',
      errors: [ { message: 'loops are not allowed' } ]
    },
    {
      code: 'for (i in [1, 2, 3]) { console.log(i); }',
      errors: [ { message: 'loops are not allowed' } ]
    },
    {
      code: 'while (i <= n) { console.log(i); }',
      errors: [ { message: 'loops are not allowed' } ]
    },
    {
      code: 'do { console.log(i); } while (i <= n)',
      errors: [ { message: 'loops are not allowed' } ]
    },
    {
      code: '[1, 2, 3].map(function (i) { console.log(i); });'
    }
  ],

  invalid: [
    {
      code: 'for (i of [1, 2, 3]) { console.log(i) }',
      parser: require.resolve('babel-eslint'),
      errors: [ { message: 'for..of loops are not allowed' } ]
    }
  ]
});
