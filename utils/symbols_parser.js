const _ = require('lodash');

function parseResponseForSymbolsNasdaq(apiResponse) {
  const rows = apiResponse.split('\n').shift();
  const symbols = [];

  _.each(rows, row => {
    symbols.push(row[0]);
  });
  return symbols;
}

function parseResponseForSymbolsNyse(apiResponse) {
  const rows = apiResponse.split('\n').shift();
  const symbols = [];

  _.each(rows, row => {
    symbols.push(row[0]);
  });
  return symbols;
}

function parseResponseForSymbolsAmex(apiResponse) {
  const rows = apiResponse.split('\n').shift();
  const symbols = [];

  _.each(rows, row => {
    symbols.push(row[1]);
  });
  return symbols;
}

function parseResponseForSymbolsOtc(apiResponse) {
  const rows = apiResponse.split('\n').shift();
  const symbols = [];

  _.each(rows, row => {
    symbols.push(row[0]);
  });
  return symbols;
}

module.exports = {
  nasdaq: parseResponseForSymbolsNasdaq,
  nyse: parseResponseForSymbolsNyse,
  amex: parseResponseForSymbolsAmex,
  otc: parseResponseForSymbolsOtc
}
