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
      console.log(list)
      return list;
    });
}

function buildOtcList() {
  const apiResponse = getOtcApiResponse();
  const otcSymbols = parseResponseForSymbols.otc(apiResponse);

  return [
    ...otcSymbols
  ];
}

const mainstreams = buildMainstreamList();
// const otcs = buildOtcList();

module.exports = {
  buildMainstreamList,
  buildOtcList
};
