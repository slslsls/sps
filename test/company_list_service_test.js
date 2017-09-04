'use strict';

const config = require('../config.json');
const _ = require('lodash');
const companyListService = require('../services/company_list_service');
const { buildRequestOptions } = companyListService;
const { getMainstreamSymbols } = companyListService;
const { getOtcSymbols } = companyListService;
const chai = require('chai');
const sinon = require('sinon');
const { expect } = chai;
const exchanges = [
  'nasdaq',
  'nyse',
  'amex',
  'otc'
];

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
    it('should pass through any error from symbols request uri');
    it('should throw a BadRequest error if no error is given from request uri');
  });
  describe('getOtcSymbols', () => {
    it('should pass through any error from symbols request uri');
    it('should throw a BadRequest error if no error is given from request uri');
  });
});
