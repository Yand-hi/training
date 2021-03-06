module.exports = {
  'presets': [
    [
      '@babel/preset-env',
      {
        'modules': false,
        'targets': {
          'browsers': ' >1%, ie >=10, not dead',
        },
        'useBuiltIns': 'usage',
      },
    ],
  ],
  'plugins': [
    [
      '@babel/plugin-proposal-pipeline-operator',
      {
        'proposal': 'minimal',
      },
    ],
    '@babel/plugin-proposal-optional-chaining',
    '@babel/plugin-proposal-function-bind',
    '@babel/plugin-proposal-do-expressions',
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-syntax-import-meta',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-json-strings',
    [
      '@babel/plugin-proposal-decorators',
      {
        'legacy': true,
      },
    ],
    '@babel/plugin-proposal-function-sent',
    '@babel/plugin-proposal-export-namespace-from',
    '@babel/plugin-proposal-numeric-separator',
    '@babel/plugin-proposal-throw-expressions',
  ],
  'comments': false,
  'env': {},
};
