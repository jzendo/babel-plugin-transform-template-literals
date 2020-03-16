"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var FAA_LINEBREAKS_NONE = 'none';
var FAA_LINEBREAKS_ALL = 'all';
var FAA_LINEBREAKS_DEFAULT = 'default';
var reFAA = {
  foreOne: /^\n/,
  foreAll: /^[\n\t\s]+/,
  aftOne: /\n$/,
  aftAll: /[\n\t\s]+$/,
  foreRawOne: /^\\n/,
  foreRawAll: /^[\\n\\t\\s]+/,
  aftRawOne: /\\n$/,
  aftRawAll: /[\\n\\t\\s]+$/
};

var getRegexPair = function getRegexPair(isRaw, isAll) {
  var reFore = isRaw ? reFAA.foreRawOne : reFAA.foreOne;
  var reAft = isRaw ? reFAA.aftRawOne : reFAA.aftOne;

  if (isAll) {
    reFore = isRaw ? reFAA.foreRawAll : reFAA.foreAll;
    reAft = isRaw ? reFAA.aftRawAll : reFAA.aftAll;
  }

  return [reFore, reAft];
};

function reStrip(ele, re) {
  if (ele && ele.type === 'StringLiteral') ele.value = ele.value.replace(re, '');
}

function isMatchedOptionalOptions(currentStripForeAndAftLinebreaks) {
  for (var _len = arguments.length, optionalOptions = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    optionalOptions[_key - 1] = arguments[_key];
  }

  return optionalOptions.some(function (current) {
    return current === currentStripForeAndAftLinebreaks;
  });
}

function canSkipStrip(stripForeAndAftLinebreaks) {
  return isMatchedOptionalOptions(stripForeAndAftLinebreaks, FAA_LINEBREAKS_ALL, FAA_LINEBREAKS_DEFAULT) === false;
}

function getStripRegexItems(currentStripForeAndAftLinebreaks) {
  var _getRegexPair = getRegexPair(false, isMatchedOptionalOptions(currentStripForeAndAftLinebreaks, FAA_LINEBREAKS_ALL)),
      _getRegexPair2 = _slicedToArray(_getRegexPair, 2),
      reFore = _getRegexPair2[0],
      reAft = _getRegexPair2[1];

  var _getRegexPair3 = getRegexPair(true, isMatchedOptionalOptions(currentStripForeAndAftLinebreaks, FAA_LINEBREAKS_ALL)),
      _getRegexPair4 = _slicedToArray(_getRegexPair3, 2),
      reRawFore = _getRegexPair4[0],
      reRawAft = _getRegexPair4[1];

  return [reFore, reAft, reRawFore, reRawAft];
}

var getHelper = function getHelper(currentStripForeAndAftLinebreaks) {
  function applyStripForeAndAftLinebreaksTaggedTemplateExpression(strings, raws) {
    var len = strings.length;

    if (len === 0 || canSkipStrip(currentStripForeAndAftLinebreaks)) {
      return [strings, raws];
    }

    var newStrings = _toConsumableArray(strings);

    var newRaws = _toConsumableArray(raws);

    var _getStripRegexItems = getStripRegexItems(currentStripForeAndAftLinebreaks),
        _getStripRegexItems2 = _slicedToArray(_getStripRegexItems, 4),
        reFore = _getStripRegexItems2[0],
        reAft = _getStripRegexItems2[1],
        reRawFore = _getStripRegexItems2[2],
        reRawAft = _getStripRegexItems2[3];

    reStrip(newStrings[0], reFore);
    reStrip(newRaws[0], reRawFore);
    reStrip(newStrings[len - 1], reAft);
    reStrip(newRaws[len - 1], reRawAft);
    return [newStrings, newRaws];
  }

  function applyStripForeAndAftLinebreaksTemplateLiteral(nodes) {
    var len = nodes.length;

    if (len === 0 || canSkipStrip(currentStripForeAndAftLinebreaks)) {
      return nodes;
    }

    var _getStripRegexItems3 = getStripRegexItems(currentStripForeAndAftLinebreaks),
        _getStripRegexItems4 = _slicedToArray(_getStripRegexItems3, 2),
        reFore = _getStripRegexItems4[0],
        reAft = _getStripRegexItems4[1];

    var newNodes = _toConsumableArray(nodes);

    reStrip(newNodes[0], reFore);
    reStrip(newNodes[len - 1], reAft);
    return newNodes;
  }

  return {
    applyStripForeAndAftLinebreaksTemplateLiteral: applyStripForeAndAftLinebreaksTemplateLiteral,
    applyStripForeAndAftLinebreaksTaggedTemplateExpression: applyStripForeAndAftLinebreaksTaggedTemplateExpression
  };
};

exports.FAA_LINEBREAKS_NONE = FAA_LINEBREAKS_NONE;
exports.FAA_LINEBREAKS_ALL = FAA_LINEBREAKS_ALL;
exports.FAA_LINEBREAKS_DEFAULT = FAA_LINEBREAKS_DEFAULT;
exports.getStripForeAndAftLinebreaksHelper = getHelper;