'use strict';

const config = require('../config.json');
const rp = require('request-promise');
const _ = require('lodash');
const RSVP = require('rsvp');
const cheerio = require('cheerio');
const { edgarHost, edgarStatementsUrl } = config.serviceLinks;

function buildRequestOptions(url) {
  return {
    uri: url,
    json: true,
    headers: {
      'User-Agent': 'Request-Promise'
    }
  };
}

function elementContainsExactText(element, text) {
  if (_.get(element, 'children[0].data') === text) {
    return true;
  }
  return false;
}

function getHrefFromChildOfNeighboringElement(element) {
  return _.get(element, 'nextSibling.nextSibling.children[0].attribs.href');
}

function visitEdgarCompanyPage(symbol, statementType) {
  const urlWithSymbol = _.replace(edgarStatementsUrl, '_', symbol);
  const urlWithSymbolAndStmtType = _.replace(urlWithSymbol, '^', statementType);
  const requestOptions = buildRequestOptions(urlWithSymbolAndStmtType);

  return rp(requestOptions);
}

function getStatementPageLinks(statementType, n) {
  return function(edgarCompanyPage) {
    const $ = cheerio.load(edgarCompanyPage);
    const tdElements = $('td');
    const links = [];

    for (let i = 0; links.length < n && i < tdElements.length; i++) {
      if (elementContainsExactText(tdElements[i], statementType)) {
        const href = getHrefFromChildOfNeighboringElement(tdElements[i]);

        links.push(`${edgarHost}${href}`);
      }
    }
    return links;
  };
}

function getStatementPagePromises(statementPageLinks) {
  const promises = {};

  for (let i = 0; i < statementPageLinks.length; i++) {
    promises[i] = rp(statementPageLinks[i]);
  }
  return promises;
}

function getStatementHtmlLink(edgarStatementPage, statementType) {
  const $ = cheerio.load(edgarStatementPage);
  const tdElements = $('td');

  for (let i = 0; i < tdElements.length; i++) {
    if (elementContainsExactText(tdElements[i], statementType)) {
      const href = getHrefFromChildOfNeighboringElement(tdElements[i]);

      return `${edgarHost}${href}`;
    }
  }
  return null;
}

function getStatementHtmlLinks(statementType) {
  return function(statementPagePromises) {
    return RSVP.hash(statementPagePromises)
      .then(statementPages => {
        const statementHtmlLinks = {};

        _.each(statementPages, (value, key) => {
          statementHtmlLinks[key] = getStatementHtmlLink(value, statementType);
        });
        return statementHtmlLinks;
      });
  };
}

function getStatementHtmlPromises(statementHtmlLinks) {
  const promises = {};

  _.each(statementHtmlLinks, (value, key) => {
    promises[key] = rp(value);
  });
  return promises;
}

function getStatementHtml(statementHtmlPromises) {
  return RSVP.hash(statementHtmlPromises)
    .then(statements => {
      return statements;
    });
}

function getStatementsForLastNPeriods(symbol, statementType, n) {
  symbol = symbol.toUpperCase();
  statementType = statementType.toUpperCase();

  return visitEdgarCompanyPage(symbol, statementType)
    .then(getStatementPageLinks(statementType, n))
    .then(getStatementPagePromises)
    .then(getStatementHtmlLinks(statementType))
    .then(getStatementHtmlPromises)
    .then(getStatementHtml)
    .catch(console.log);
}

module.exports = {
  getStatementsForLastNPeriods
};
