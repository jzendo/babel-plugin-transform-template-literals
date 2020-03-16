let devOrBuildEnvConfig = ["@babel/env", { modules: false }];

let testEnvConfig = [
  "@babel/preset-env",
  {
    targets: {
      node: "current"
    }
  }
];

if (process.env.NODE_ENV === "test") {
  // console.log('@Env: test ...')
  module.exports = {
    presets: [testEnvConfig]
  };
} else {
  // console.log('@Env: dev/build ...')
  module.exports = {
    presets: [devOrBuildEnvConfig],
    plugins: [
      "@babel/plugin-transform-modules-commonjs"
    ]
  };
}
