const { getMainstreamApiResponses } = require('../services/company_list_service');
const parseResponseForSymbols = require('../utils/symbols_parser');

function buildMainstreamList() {
  const apiResponses = getMainstreamApiResponses();
  const nasdaqSymbols = parseResponseForSymbols.nasdaq(apiResponses.nasdaq);
  const nyseSymbols = parseResponseForSymbols.nyse(apiResponses.nyse);
  const amexSymbols = parseResponseForSymbols.amex(apiResponses.amex);

  return [
    ...nasdaqSymbols,
    ...nyseSymbols,
    ...amexSymbols
  ];
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

console.log(mainstreams)

module.exports = {
  buildMainstreamList,
  buildOtcList
};
