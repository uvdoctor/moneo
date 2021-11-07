module.exports = {
    presets: [['next/babel', '@babel/preset-env']],
    plugins: ['@babel/plugin-proposal-optional-chaining', ['import', { libraryName: 'antd', style: true }]]
  };