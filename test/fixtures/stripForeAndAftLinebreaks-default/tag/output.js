function _templateObject3() {
  const data = _taggedTemplateLiteral(["\nwow\naB", " ", "\n"], ["\\nwow\\naB", " ", "\\n"]);

  _templateObject3 = function () {
    return data;
  };

  return data;
}

function _templateObject2() {
  const data = _taggedTemplateLiteral(["\nwow\nab", " ", "\n"], ["\\nwow\\nab", " ", "\\n"]);

  _templateObject2 = function () {
    return data;
  };

  return data;
}

function _templateObject() {
  const data = _taggedTemplateLiteral(["\nwow\na", "b ", "\n"], ["\\nwow\\na", "b ", "\\n"]);

  _templateObject = function () {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var foo = bar(_templateObject(), 42, _.foobar());
var bar = bar(_templateObject2(), 42, _.foobar());
var bar = bar(_templateObject3(), 42, _.baz());
