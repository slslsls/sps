'use strict';

const config = require('../config.json');
const rp = require('request-promise');

function buildRequestOptions(exchange) {
  if (!config.serviceLinks.symbols[exchange]) {
    throw ReferenceError('Invalid exchange specified');
  }
  return {
    uri: config.serviceLinks.symbols[exchange],
    json: true,
    headers: {
      'User-Agent': 'Request-Promise'
    }
  }
}

function getMainstreamSymbols() {
  const nasdaqOpts = buildRequestOptions('nasdaq');
  const nyseOpts = buildRequestOptions('nyse');
  const amexOpts = buildRequestOptions('amex');
  const symbols = [];

  rp(nasdaqOpts)
    .then(response => {
      const nasdaqSymbols = parseResponseForSymbols('nasdaq');
      symbols.push(nasdaqSymbols);
      return rp(nyseOpts);
    })
    .then(response => {
      const nyseSymbols = parseResponseForSymbols('nyse');
      symbols.push(nyseSymbols);
      return rp(amexOpts);
    })
    .then(response => {
      const amexSymbols = parseResponseForSymbols('amex');
      symbols.push(amexSymbols);
    });

  return symbols;
}

function getOtcSymbols() {
  const otcOpts = buildRequestOptions('otc');

  rp(otcOpts)
    .then(response => {
      const otcSymbols = parseResponseForSymbols('otc');
      return otcSymbols;
    });
}

module.exports = {
  buildRequestOptions,
  getMainstreamSymbols,
  getOtcSymbols
};
