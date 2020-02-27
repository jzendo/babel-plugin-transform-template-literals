'use strict';

function _taggedTemplateLiteral(strings, raw) {
  if (!raw) {
    raw = strings.slice(0);
  }

  return Object.freeze(Object.defineProperties(strings, {
    raw: {
      value: Object.freeze(raw)
    }
  }));
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  }
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _iterableToArrayLimit(arr, i) {
  if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) {
    return;
  }

  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n          function ", "() {\n            const data = ", ";\n            ", " = function() { return data };\n            return data;\n          }\n        "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

var _require = require("@babel/helper-plugin-utils"),
    declare = _require.declare;

var _require2 = require("@babel/core"),
    template = _require2.template,
    t = _require2.types;
var FAA_LINEBREAKS_ALL = 'all';
var FAA_LINEBREAKS_DEFAULT = 'default';
var reFAA = {
  // RE
  foreOne: /^\n/,
  foreAll: /^[\n\t\s]+/,
  aftOne: /\n$/,
  aftAll: /[\n\t\s]+$/,
  // Raw RE
  foreRawOne: /^\\n/,
  foreRawAll: /^[\\n\\t\\s]+/,
  aftRawOne: /\\n$/,
  aftRawAll: /[\\n\\t\\s]+$/
};

var getStripRegexp = function getStripRegexp(isRaw, isAll) {
  var reFore = isRaw ? reFAA.foreRawOne : reFAA.foreOne;
  var reAft = isRaw ? reFAA.aftRawOne : reFAA.aftOne;

  if (isAll) {
    reFore = isRaw ? reFAA.foreRawAll : reFAA.foreAll;
    reAft = isRaw ? reFAA.aftRawAll : reFAA.aftAll;
  }

  return [reFore, reAft];
};

var index = declare(function (api, options) {
  api.assertVersion(7);
  var loose = options.loose,
      _options$stripForeAnd = options.stripForeAndAftLinebreaks,
      stripForeAndAftLinebreaks = _options$stripForeAnd === void 0 ? FAA_LINEBREAKS_DEFAULT : _options$stripForeAnd;
  var helperName = "taggedTemplateLiteral";
  if (loose) helperName += "Loose";
  /**
   * This function groups the objects into multiple calls to `.concat()` in
   * order to preserve execution order of the primitive conversion, e.g.
   *
   *   "".concat(obj.foo, "foo", obj2.foo, "foo2")
   *
   * would evaluate both member expressions _first_ then, `concat` will
   * convert each one to a primitive, whereas
   *
   *   "".concat(obj.foo, "foo").concat(obj2.foo, "foo2")
   *
   * would evaluate the member, then convert it to a primitive, then evaluate
   * the second member and convert that one, which reflects the spec behavior
   * of template literals.
   */

  function buildConcatCallExpressions(items) {
    var avail = true;
    return items.reduce(function (left, right) {
      var canBeInserted = t.isLiteral(right);

      if (!canBeInserted && avail) {
        canBeInserted = true;
        avail = false;
      }

      if (canBeInserted && t.isCallExpression(left)) {
        left.arguments.push(right);
        return left;
      }

      return t.callExpression(t.memberExpression(left, t.identifier("concat")), [right]);
    });
  }

  function matchOptionStripForeAndAftLinebreaks() {
    for (var _len = arguments.length, options = new Array(_len), _key = 0; _key < _len; _key++) {
      options[_key] = arguments[_key];
    }

    return options.some(function (current) {
      return current === stripForeAndAftLinebreaks;
    });
  }

  function isSkipStripFAALinebreaks() {
    return matchOptionStripForeAndAftLinebreaks(FAA_LINEBREAKS_ALL, FAA_LINEBREAKS_DEFAULT) === false;
  }

  function getStripFAALinebreaksRegExps() {
    var _getStripRegexp = getStripRegexp(false, matchOptionStripForeAndAftLinebreaks(FAA_LINEBREAKS_ALL)),
        _getStripRegexp2 = _slicedToArray(_getStripRegexp, 2),
        reFore = _getStripRegexp2[0],
        reAft = _getStripRegexp2[1];

    var _getStripRegexp3 = getStripRegexp(true, matchOptionStripForeAndAftLinebreaks(FAA_LINEBREAKS_ALL)),
        _getStripRegexp4 = _slicedToArray(_getStripRegexp3, 2),
        reRawFore = _getStripRegexp4[0],
        reRawAft = _getStripRegexp4[1];

    return [reFore, reAft, reRawFore, reRawAft];
  }

  function reStripElementValue(ele, re) {
    if (ele && ele.type === 'StringLiteral') ele.value = ele.value.replace(re, '');
  }

  function applyStripForeAndAftLinebreaksTaggedTemplateExpression(strings, raws) {
    var len = strings.length;

    if (len === 0 || isSkipStripFAALinebreaks()) {
      return [strings, raws];
    }

    var newStrings = _toConsumableArray(strings);

    var newRaws = _toConsumableArray(raws);

    var _getStripFAALinebreak = getStripFAALinebreaksRegExps(),
        _getStripFAALinebreak2 = _slicedToArray(_getStripFAALinebreak, 4),
        reFore = _getStripFAALinebreak2[0],
        reAft = _getStripFAALinebreak2[1],
        reRawFore = _getStripFAALinebreak2[2],
        reRawAft = _getStripFAALinebreak2[3]; // Strip prefix


    reStripElementValue(newStrings[0], reFore);
    reStripElementValue(newRaws[0], reRawFore); // Strip suffix

    reStripElementValue(newStrings[len - 1], reAft);
    reStripElementValue(newRaws[len - 1], reRawAft);
    return [newStrings, newRaws];
  }

  function applyStripForeAndAftLinebreaksTemplateLiteral(nodes) {
    var len = nodes.length;

    if (len === 0 || isSkipStripFAALinebreaks()) {
      return nodes;
    }

    var _getStripFAALinebreak3 = getStripFAALinebreaksRegExps(),
        _getStripFAALinebreak4 = _slicedToArray(_getStripFAALinebreak3, 2),
        reFore = _getStripFAALinebreak4[0],
        reAft = _getStripFAALinebreak4[1];

    var newNodes = _toConsumableArray(nodes); // Strip prefix


    reStripElementValue(newNodes[0], reFore); // Strip suffix

    reStripElementValue(newNodes[len - 1], reAft);
    return newNodes;
  }

  return {
    name: "transform-template-literals",
    visitor: {
      TaggedTemplateExpression: function TaggedTemplateExpression(path) {
        var node = path.node;
        var quasi = node.quasi;
        var strings = [];
        var raws = []; // Flag variable to check if contents of strings and raw are equal

        var isStringsRawEqual = true;
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = quasi.quasis[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var elem = _step.value;
            var _elem$value = elem.value,
                raw = _elem$value.raw,
                cooked = _elem$value.cooked;
            var value = cooked == null ? path.scope.buildUndefinedNode() : t.stringLiteral(cooked);
            strings.push(value);
            raws.push(t.stringLiteral(raw));

            if (raw !== cooked) {
              // false even if one of raw and cooked are not equal
              isStringsRawEqual = false;
            }
          } // Apply `stripForeAndAftLinebreaks` option

        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator["return"] != null) {
              _iterator["return"]();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        var _applyStripForeAndAft = applyStripForeAndAftLinebreaksTaggedTemplateExpression(strings, raws);

        var _applyStripForeAndAft2 = _slicedToArray(_applyStripForeAndAft, 2);

        strings = _applyStripForeAndAft2[0];
        raws = _applyStripForeAndAft2[1];
        var scope = path.scope.getProgramParent();
        var templateObject = scope.generateUidIdentifier("templateObject");
        var helperId = this.addHelper(helperName);
        var callExpressionInput = [t.arrayExpression(strings)]; // only add raw arrayExpression if there is any difference between raws and strings

        if (!isStringsRawEqual) {
          callExpressionInput.push(t.arrayExpression(raws));
        }

        var lazyLoad = template.ast(_templateObject(), templateObject, t.callExpression(helperId, callExpressionInput), templateObject);
        scope.path.unshiftContainer("body", lazyLoad);
        path.replaceWith(t.callExpression(node.tag, [t.callExpression(t.cloneNode(templateObject), [])].concat(_toConsumableArray(quasi.expressions))));
      },
      TemplateLiteral: function TemplateLiteral(path) {
        var nodes = [];
        var expressions = path.get("expressions");
        var index = 0;
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = path.node.quasis[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var elem = _step2.value;

            if (elem.value.cooked) {
              nodes.push(t.stringLiteral(elem.value.cooked));
            }

            if (index < expressions.length) {
              var expr = expressions[index++];
              var node = expr.node;

              if (!t.isStringLiteral(node, {
                value: ""
              })) {
                nodes.push(node);
              }
            }
          } // Apply `stripForeAndAftLinebreaks` option

        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
              _iterator2["return"]();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }

        nodes = applyStripForeAndAftLinebreaksTemplateLiteral(nodes); // since `+` is left-to-right associative
        // ensure the first node is a string if first/second isn't

        var considerSecondNode = !loose || !t.isStringLiteral(nodes[1]);

        if (!t.isStringLiteral(nodes[0]) && considerSecondNode) {
          nodes.unshift(t.stringLiteral(""));
        }

        var root = nodes[0];

        if (loose) {
          for (var i = 1; i < nodes.length; i++) {
            root = t.binaryExpression("+", root, nodes[i]);
          }
        } else if (nodes.length > 1) {
          root = buildConcatCallExpressions(nodes);
        }

        path.replaceWith(root);
      }
    }
  };
});

module.exports = index;
