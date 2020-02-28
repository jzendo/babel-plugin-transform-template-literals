module.exports = {
  plugins: [
    [require.resolve("../../../../src/index.js"), {stripForeAndAftLinebreaks: "none"}] // Use native `transform-template-literals`
  ]
}
