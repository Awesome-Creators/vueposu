'use strict';

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/shared.cjs.min.js');
} else {
  module.exports = require('./dist/shared.cjs.js');
}
