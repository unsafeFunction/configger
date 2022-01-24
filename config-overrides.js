// Overriding CreateReactApp settings, ref: https://github.com/arackaf/customize-cra
const {
  override,
  fixBabelImports,
  addLessLoader,
  addDecoratorsLegacy,
  addBabelPlugin,
} = require('customize-cra');
const antdTheme = require('./src/theme.js');

module.exports = override(
  addBabelPlugin('@babel/plugin-proposal-nullish-coalescing-operator'),
  addDecoratorsLegacy(),
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
  }),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: antdTheme,
  }),
);
