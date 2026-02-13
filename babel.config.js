module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./src"],
          alias: {
            "@auth": "./src/auth",
            "@core": "./src/core",
            "@domain": "./src/domain",
            "@features": "./src/features",
            "@navigation": "./src/navigation",
            "@scope": "./src/scope",
            "@screens": "./src/screens",
            "@ui": "./src/ui",
          },
        },
      ],
      "react-native-reanimated/plugin", // 👈 must be last
    ],
  };
};
