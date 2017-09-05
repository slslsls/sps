'use strict';

const config = require('../config.json');
const _ = require('lodash');
const proxyquire = require('proxyquire');
const mockRpResponseNasdaq = require('./csv_mocks/nasdaq_mock.csv');
const mockRpResponseNyse = require('./csv_mocks/nyse_mock.csv');
const mockRpResponseAmex = require('./csv_mocks/amex_mock.csv');
const mockRpResponseOtc = require('./csv_mocks/otc_mock.csv');
const chai = require('chai');
const sinon = require('sinon');
const { expect } = chai;
const exchanges = [
  'nasdaq',
  'nyse',
  'amex',
  'otc'
];
const mainstreamSymbolsFromCsvMocks = [
  // keep these sorted for easier comparison in the assertions
  '1PG',
  'DDD',
  'FLWS',
  'IJH',
  'MMM',
  'MOQ',
  'PIH',
  'TURN',
  'WDAI'
];
const otcSymbolsFromCsvMocks = [
  // keep these sorted for easier comparison in the assertions
  'MHGU',
  'MHGUP',
  'SIAF'
];
const rpArgsNasdaq = {
  uri: config.serviceLinks.symbols[nasdaq],
  json: true,
  headers: {
    'User-Agent': 'Request-Promise'
  }
};
const rpArgsNyse = {
  uri: config.serviceLinks.symbols[nyse],
  json: true,
  headers: {
    'User-Agent': 'Request-Promise'
  }
};
const rpArgsAmex = {
  uri: config.serviceLinks.symbols[amex],
  json: true,
  headers: {
    'User-Agent': 'Request-Promise'
  }
};
const rpArgsOtc = {
  uri: config.serviceLinks.symbols[otc],
  json: true,
  headers: {
    'User-Agent': 'Request-Promise'
  }
};
const rpStub = sinon.stub();

rpStub.returns(Promise.resolve(new BadRequestError()));
rpStub.withArgs(rpArgsNasdaq).returns(Promise.resolve(mockRpResponseNasdaq));
rpStub.withArgs(rpArgsNyse).returns(Promise.resolve(mockRpResponseNyse));
rpStub.withArgs(rpArgsAmex).returns(Promise.resolve(mockRpResponseAmex));
rpStub.withArgs(rpArgsOtc).returns(Promise.resolve(mockRpResponseOtc));


rpStub(rpArgNasdaq).then(console.log)
rpStub('blah').then(console.log)
rpStub({name: 'Spencer'}).then(console.log)

const companyListService = proxyquire('../services/company_list_service', {
  'request-promise': rpStub
});
const { buildRequestOptions } = companyListService;
const { getMainstreamSymbols } = companyListService;
const { getOtcSymbols } = companyListService;

chai.use(require('sinon-chai'));

describe('companyListService', () => {
  describe('buildRequestOptions', () => {
    _.each(exchanges, exchange => {
      it(`should return an options object with ${exchange} uri`, () => {
        const requestOptions = buildRequestOptions(exchange);
        expect(requestOptions.uri).to.equal(config.serviceLinks.symbols[exchange]);
      });
    });
    it('should set options.json to true', () => {
      const requestOptions = buildRequestOptions('nasdaq');
      expect(requestOptions.json).to.equal(true);
    });
    it('should set User-Agent header to Request-Promise', () => {
      const requestOptions = buildRequestOptions('nasdaq');
      expect(requestOptions).to.have.property('headers');
      expect(requestOptions.headers).to.have.property('User-Agent');
      expect(requestOptions.headers['User-Agent']).to.equal('Request-Promise');
    });
    it('should throw an error if specified exchange is not in config', () => {
      function wrappedFn() {
        return buildRequestOptions('not-a-valid-exchange');
      }
      expect(wrappedFn).to.throw(ReferenceError);
    });
  });
  describe('getMainstreamSymbols', () => {
    it('should return an array of ticker symbols as strings', () => {
      const symbols = getMainstreamSymbols();

      expect(symbols).be.an.array;
      expect(symbols).to.have.length(9);
      expect(symbols).to.equal(mainstreamSymbolsFromCsvMocks);
    });
    it('should pass through any error from symbols request uri', () => {

    });
    it('should throw a BadRequest error if no error is given from request uri');
  });
  describe('getOtcSymbols', () => {
    it('should return an array of ticker symbols as strings', () => {
      const symbols = getOtcSymbols();

      expect(symbols).be.an.array;
      expect(symbols).to.have.length(9);
      expect(symbols).to.equal(otcSymbolsFromCsvMocks);
    });
    it('should pass through any error from symbols request uri');
    it('should throw a BadRequest error if no error is given from request uri');
  });
});
