module.exports = {
  webpack: {
    configure: {
      resolve: {
        fallback: {
          "http": require.resolve("stream-http"),
          "https": require.resolve("https-browserify"),
          "util": require.resolve("util/"),
          "zlib": require.resolve("browserify-zlib"),
          "stream": require.resolve("stream-browserify"),
          "url": require.resolve("url/"),
          "assert": require.resolve("assert/"),
          "crypto": require.resolve("crypto-browserify")
        },
      },
    },
  },
};