module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: [
    'airbnb-base',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    'immutable',
  ],
  rules: {
    'immutable/no-mutation': 'error',
    'max-len': [
      'error',
      {
        code: 1000, // (default 80) enforces a maximum line length
        tabWidth: 4, // (default 4) specifies the character width for tab characters
        comments: 1000, // enforces a maximum line length for comments; defaults to value of code
        ignoreComments: true, // ignores all trailing comments and comments on their own line
        ignoreTrailingComments: true, // ignores only trailing comments
        ignoreUrls: true, // ignores lines that contain a URL
        ignoreStrings: true, // ignores lines that contain a double-quoted or single-quoted string
        ignoreTemplateLiterals: true, // ignores lines that contain a template literal
        ignoreRegExpLiterals: true, // ignores lines that contain a RegExp literal
      },
    ],
    'import/first': 0,
    'no-multiple-empty-lines': ['error', { max: 10, maxEOF: 0 }],
    'spaced-comment': 0,
    'no-async-promise-executor': 0,
    'no-dupe-else-if': 0,
    'no-import-assign': 0,
    'no-misleading-character-class': 0,
    'no-setter-return': 0,
    'no-useless-catch': 0,
    'no-console': 'off',
    indent: ['error', 2, { SwitchCase: 1 },
    ],
    'linebreak-style': 0,
    quotes: [
      'error',
      'single',
      {
        allowTemplateLiterals: true,
      },
    ],
    semi: [
      'error',
      'always',
    ],
    'no-unused-vars': 0,
  },
};
