const path = require('path');

module.exports = function override(config, env) {
  // node_modules의 모든 .js 파일을 트랜스파일하도록 설정
  config.module.rules.push({
    test: /\.m?js$/,
    include: [
      path.resolve(__dirname, 'node_modules')
    ],
    use: {
      loader: 'babel-loader',
      options: {
        presets: [
          ['@babel/preset-env', {
            targets: {
              browsers: ['>0.25%', 'not dead']
            }
          }]
        ],
        plugins: [
          '@babel/plugin-proposal-optional-chaining',
          '@babel/plugin-proposal-nullish-coalescing-operator'
        ]
      }
    }
  });

  // Node.js polyfills 추가 (webpack 4 호환)
  config.resolve.alias = {
    ...config.resolve.alias,
    "crypto": require.resolve("crypto-browserify"),
    "stream": require.resolve("stream-browserify"),
    "buffer": require.resolve("buffer"),
    "util": require.resolve("util"),
    "assert": require.resolve("assert"),
    "http": require.resolve("stream-http"),
    "https": require.resolve("https-browserify"),
    "os": require.resolve("os-browserify/browser"),
    "url": require.resolve("url"),
    "path": require.resolve("path-browserify")
  };

  return config;
};
