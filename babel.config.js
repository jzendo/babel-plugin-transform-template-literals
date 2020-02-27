let buildEnvConfig = ["@babel/env", { modules: false }]

let testEnvConfig = [
  '@babel/preset-env',
  {
    targets: {
      node: 'current',
    },
  }
]

let envConfig = process.env.NODE_ENV === 'test' ? testEnvConfig : buildEnvConfig


module.exports = {
  presets: [
    envConfig
  ]
};
