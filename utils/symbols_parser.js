const _ = require('lodash');

function trimQuotationMarks(string) {
  if (string === '"' || string === undefined) {
    return null;
  }
  if (string[0] === '"') {
    string = string.slice(1);
  }
  if (string[string.length - 1] === '"') {
    string = string.slice(0, -1);
  }
  return string;
}

function parseResponseForSymbolsNasdaq(apiResponse) {
  const rows = apiResponse.split('\n');
  const symbols = [];

  rows.shift();
  _.each(rows, row => {
    let rowData = row.split(',')
    let symbol = trimQuotationMarks(rowData[0]);
    symbols.push(symbol);
  });
  return symbols;
}

function parseResponseForSymbolsNyse(apiResponse) {
  const rows = apiResponse.split('\n');
  const symbols = [];

  rows.shift();
  _.each(rows, row => {
    let rowData = row.split(',')
    let symbol = trimQuotationMarks(rowData[0]);
    symbols.push(symbol);
  });
  return symbols;
}

function parseResponseForSymbolsAmex(apiResponse) {
  const rows = apiResponse.split('\n');
  const symbols = [];

  rows.shift();
  _.each(rows, row => {
    let rowData = row.split('","')
    let symbol = trimQuotationMarks(rowData[1]);
    symbols.push(symbol);
  });
  return symbols;
}

function parseResponseForSymbolsOtc(apiResponse) {
  const rows = apiResponse.split('\n');
  const symbols = [];

  rows.shift();
  _.each(rows, row => {
    let rowData = row.split(',')
    let symbol = trimQuotationMarks(rowData[0]);
    symbols.push(symbol);
  });
  return symbols;
}

module.exports = {
  nasdaq: parseResponseForSymbolsNasdaq,
  nyse: parseResponseForSymbolsNyse,
  amex: parseResponseForSymbolsAmex,
  otc: parseResponseForSymbolsOtc
}
