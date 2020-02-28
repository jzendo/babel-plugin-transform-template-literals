module.exports = {
  plugins: [
    [require.resolve("../../../../src/index.js"), {stripForeAndAftLinebreaks: "all"}] // Use native `transform-template-literals`
  ]
}
