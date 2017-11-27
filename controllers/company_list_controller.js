'use strict';

const _ = require('lodash');
const { getMainstreamApiResponses, getOtcApiResponse } = require('../services/company_list_service');
const parseResponseForSymbols = require('../utils/symbols_parser');

function buildMainstreamList() {
  getMainstreamApiResponses()
    .then(apiResponses => {
      const nasdaqSymbols = parseResponseForSymbols.nasdaq(apiResponses.nasdaq);
      const nyseSymbols = parseResponseForSymbols.nyse(apiResponses.nyse);
      const amexSymbols = parseResponseForSymbols.amex(apiResponses.amex);
      const list = _.compact([
        ...nasdaqSymbols,
        ...nyseSymbols,
        ...amexSymbols
      ]);

      return list;
    });
}

function buildOtcList() {
  getOtcApiResponse()
    .then(apiResponse => {
      const otcSymbols = parseResponseForSymbols.otc(apiResponse);
      const list = _.compact([
        ...otcSymbols
      ]);

      return list;
    });
}

module.exports = {
  buildMainstreamList,
  buildOtcList
};
