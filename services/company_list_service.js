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

function getMainstreamApiResponses() {
  const nasdaqOpts = buildRequestOptions('nasdaq');
  const nyseOpts = buildRequestOptions('nyse');
  const amexOpts = buildRequestOptions('amex');
  const apiResponses = { };

  rp(nasdaqOpts)
    .then(response => {
      apiResponses.nasdaq = response;
      return rp(nyseOpts);
    })
    .then(response => {
      apiResponses.nyse = response;
      return rp(amexOpts);
    })
    .then(response => {
      apiResponses.amex = response;
    })
    .catch(console.log);

  return apiResponses;
}

function getOtcApiResponse() {
  const otcOpts = buildRequestOptions('otc');

  rp(otcOpts)
    .then(response => {
      return response;
    })
    .catch(console.log);
}

module.exports = {
  buildRequestOptions,
  getMainstreamApiResponses,
  getOtcApiResponse
};
