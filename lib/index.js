"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n          function ", "() {\n            const data = ", ";\n            ", " = function() { return data };\n            return data;\n          }\n        "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var _require = require("@babel/helper-plugin-utils"),
    declare = _require.declare;

var _require2 = require("@babel/core"),
    template = _require2.template,
    t = _require2.types;

var _require3 = require('./stripForeAndAftLinebreaksHelper'),
    FAA_LINEBREAKS_DEFAULT = _require3.FAA_LINEBREAKS_DEFAULT,
    getStripForeAndAftLinebreaksHelper = _require3.getStripForeAndAftLinebreaksHelper;

var _default = declare(function (api, options) {
  api.assertVersion(7);
  var loose = options.loose,
      _options$stripForeAnd = options.stripForeAndAftLinebreaks,
      stripForeAndAftLinebreaks = _options$stripForeAnd === void 0 ? FAA_LINEBREAKS_DEFAULT : _options$stripForeAnd;
  var helperName = "taggedTemplateLiteral";
  if (loose) helperName += "Loose";

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

  var _getStripForeAndAftLi = getStripForeAndAftLinebreaksHelper(stripForeAndAftLinebreaks),
      applyStripForeAndAftLinebreaksTemplateLiteral = _getStripForeAndAftLi.applyStripForeAndAftLinebreaksTemplateLiteral,
      applyStripForeAndAftLinebreaksTaggedTemplateExpression = _getStripForeAndAftLi.applyStripForeAndAftLinebreaksTaggedTemplateExpression;

  return {
    name: "transform-template-literals",
    visitor: {
      TaggedTemplateExpression: function TaggedTemplateExpression(path) {
        var node = path.node;
        var quasi = node.quasi;
        var strings = [];
        var raws = [];
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
              isStringsRawEqual = false;
            }
          }
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

        ;

        var _applyStripForeAndAft = applyStripForeAndAftLinebreaksTaggedTemplateExpression(strings, raws);

        var _applyStripForeAndAft2 = _slicedToArray(_applyStripForeAndAft, 2);

        strings = _applyStripForeAndAft2[0];
        raws = _applyStripForeAndAft2[1];
        var scope = path.scope.getProgramParent();
        var templateObject = scope.generateUidIdentifier("templateObject");
        var helperId = this.addHelper(helperName);
        var callExpressionInput = [t.arrayExpression(strings)];

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
          }
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

        nodes = applyStripForeAndAftLinebreaksTemplateLiteral(nodes);
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

exports["default"] = _default;