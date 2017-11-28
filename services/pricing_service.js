'use strict';

const _ = require('lodash');
const googleFinance = require('google-finance');

function getLatestSharePrice(symbol) {
  const date = new Date();
  const now = date.toISOString().split('T')[0];
  
  date.setDate(date.getDate() - 7);
  const weekAgo = date.toISOString().split('T')[0];
  const options = {
    symbol: symbol.toUpperCase(),
    from: weekAgo,
    to: now
  };

  return googleFinance.historical(options)
    .then(data => {
      return _.last(data).close;
    })
    .catch(console.log);
}

module.exports = {
  getLatestSharePrice
};
