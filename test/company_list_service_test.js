'use strict';

const config = require('../config.json');
const _ = require('lodash');
const createError = require('http-errors');
const proxyquire = require('proxyquire');
const mockRpResponseNasdaq = require('./mocks/nasdaq_mock');
const mockRpResponseNyse = require('./mocks/nyse_mock');
const mockRpResponseAmex = require('./mocks/amex_mock');
const mockRpResponseOtc = require('./mocks/otc_mock');
const chai = require('chai');
const sinon = require('sinon');
const { expect } = chai;
const exchanges = [
  'nasdaq',
  'nyse',
  'amex',
  'otc'
];
const mainstreamSymbolsFromMocks = [
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
const otcSymbolsFromMocks = [
  // keep these sorted for easier comparison in the assertions
  'MHGU',
  'MHGUP',
  'SIAF'
];
const rpArgsNasdaq = {
  uri: config.serviceLinks.symbols.nasdaq,
  json: true,
  headers: {
    'User-Agent': 'Request-Promise'
  }
};
const rpArgsNyse = {
  uri: config.serviceLinks.symbols.nyse,
  json: true,
  headers: {
    'User-Agent': 'Request-Promise'
  }
};
const rpArgsAmex = {
  uri: config.serviceLinks.symbols.amex,
  json: true,
  headers: {
    'User-Agent': 'Request-Promise'
  }
};
const rpArgsOtc = {
  uri: config.serviceLinks.symbols.otc,
  json: true,
  headers: {
    'User-Agent': 'Request-Promise'
  }
};
const rpStub = sinon.stub();

rpStub.returns(Promise.resolve(createError(400)));
rpStub.withArgs(rpArgsNasdaq).returns(Promise.resolve(mockRpResponseNasdaq));
rpStub.withArgs(rpArgsNyse).returns(Promise.resolve(mockRpResponseNyse));
rpStub.withArgs(rpArgsAmex).returns(Promise.resolve(mockRpResponseAmex));
rpStub.withArgs(rpArgsOtc).returns(Promise.resolve(mockRpResponseOtc));

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

      expect(symbols).be.an('array');
      expect(symbols).to.have.length(mainstreamSymbolsFromMocks.length);
      expect(symbols).to.equal(mainstreamSymbolsFromMocks);
    });
  });
  describe('getOtcSymbols', () => {
    it('should return an array of ticker symbols as strings', () => {
      const symbols = getOtcSymbols();

      expect(symbols).be.an('array');
      expect(symbols).to.have.length(otcSymbolsFromMocks.length);
      expect(symbols).to.equal(otcSymbolsFromMocks);
    });
  });
});
