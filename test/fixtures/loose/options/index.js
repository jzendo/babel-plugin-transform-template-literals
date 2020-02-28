module.exports = {
  plugins: [
    [require.resolve("../../../../src/index.js"), {loose: true}] // Use native `transform-template-literals`
  ]
}
