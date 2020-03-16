
const FAA_LINEBREAKS_NONE = 'none'
const FAA_LINEBREAKS_ALL = 'all'
const FAA_LINEBREAKS_DEFAULT = 'default'

const reFAA = {
  // RE
  foreOne: /^\n/,
  foreAll: /^[\n\t\s]+/,
  aftOne: /\n$/,
  aftAll: /[\n\t\s]+$/,
  // Raw RE
  foreRawOne: /^\\n/,
  foreRawAll: /^[\\n\\t\\s]+/,
  aftRawOne: /\\n$/,
  aftRawAll: /[\\n\\t\\s]+$/,
}

const getRegexPair = (isRaw, isAll) => {
  let reFore = isRaw ? reFAA.foreRawOne : reFAA.foreOne
  let reAft = isRaw ? reFAA.aftRawOne : reFAA.aftOne

  if (isAll) {
    reFore = isRaw ? reFAA.foreRawAll : reFAA.foreAll
    reAft = isRaw ? reFAA.aftRawAll : reFAA.aftAll
  }

  return [reFore, reAft]
}

function reStrip(ele, re) {
  if (ele && ele.type === 'StringLiteral') ele.value = ele.value.replace(re, '')
}

function isMatchedOptionalOptions(currentStripForeAndAftLinebreaks, ...optionalOptions) {
  return optionalOptions.some(current => current === currentStripForeAndAftLinebreaks)
}

function canSkipStrip(stripForeAndAftLinebreaks) {
  return isMatchedOptionalOptions(
    stripForeAndAftLinebreaks,
    FAA_LINEBREAKS_ALL,
    FAA_LINEBREAKS_DEFAULT
  ) === false
}

function getStripRegexItems(currentStripForeAndAftLinebreaks) {
  const [reFore, reAft] = getRegexPair(false, isMatchedOptionalOptions(currentStripForeAndAftLinebreaks, FAA_LINEBREAKS_ALL))
  const [reRawFore, reRawAft] = getRegexPair(true, isMatchedOptionalOptions(currentStripForeAndAftLinebreaks, FAA_LINEBREAKS_ALL))
  return [
    reFore, reAft,
    reRawFore, reRawAft
  ]
}

const getHelper = function (currentStripForeAndAftLinebreaks) {
  function applyStripForeAndAftLinebreaksTaggedTemplateExpression(strings, raws) {
    const len = strings.length

    if (len === 0 || canSkipStrip(currentStripForeAndAftLinebreaks)) {
      return [strings, raws]
    }

    const newStrings = [...strings]
    const newRaws = [...raws]
    const [reFore, reAft, reRawFore, reRawAft] = getStripRegexItems(currentStripForeAndAftLinebreaks)

    // Strip prefix
    reStrip(newStrings[0], reFore)
    reStrip(newRaws[0], reRawFore)

    // Strip suffix
    reStrip(newStrings[len - 1], reAft)
    reStrip(newRaws[len - 1], reRawAft)

    return [newStrings, newRaws]
  }

  function applyStripForeAndAftLinebreaksTemplateLiteral(nodes) {
    const len = nodes.length

    if (len === 0 || canSkipStrip(currentStripForeAndAftLinebreaks)) {
      return nodes
    }

    const [reFore, reAft] = getStripRegexItems(currentStripForeAndAftLinebreaks)
    const newNodes = [...nodes]

    // Strip prefix
    reStrip(newNodes[0], reFore)
    // Strip suffix
    reStrip(newNodes[len - 1], reAft)

    return newNodes
  }
  return {
    applyStripForeAndAftLinebreaksTemplateLiteral,
    applyStripForeAndAftLinebreaksTaggedTemplateExpression
  }
}

exports.FAA_LINEBREAKS_NONE = FAA_LINEBREAKS_NONE
exports.FAA_LINEBREAKS_ALL = FAA_LINEBREAKS_ALL
exports.FAA_LINEBREAKS_DEFAULT = FAA_LINEBREAKS_DEFAULT

exports.getStripForeAndAftLinebreaksHelper = getHelper
