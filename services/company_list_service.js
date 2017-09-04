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

}

function getOtcSymbols() {

}

module.exports = {
  buildRequestOptions,
  getMainstreamSymbols,
  getOtcSymbols
}
