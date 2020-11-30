// UTILITIES
const currentTask = process.env.npm_lifecycle_event;
const fse = require('fs-extra');
const path = require('path');

// WEBPACK PLUGINS
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// POSTCSS PLUGINS
const atImport = require('postcss-import');
const cssSimpleVariables = require('postcss-simple-vars');
const nested = require('postcss-nested');
const autoprefixer = require('autoprefixer');
const mixins = require('postcss-mixins');

// PATHS
const paths = require('./build-utils/webpack/webpack.paths');


// POSTCSS PLUGINS CONFIG
const postCSSPlugins = [
  atImport(),
  mixins(),
  cssSimpleVariables(),
  nested(),
  autoprefixer(),
];

// CONFIG
class RunAfterCompile {
  apply(compiler) {
    compiler.hooks.done.tap('Copy images', () => {
      fse.copySync(paths.assets.images, paths.dist.images);
      fse.copySync(paths.assets.icons, paths.dist.icons);
    });
  }
}

// CONFIG
const cssConfig = {
  test: /\.css$/i,
  use: [
    'css-loader?url=false',
    {
      loader: 'postcss-loader',
      options: {
        plugins: postCSSPlugins,
      },
    },
  ],
};

// CONFIG
const eslintConfig = {
  test: /\.js$/,
  enforce: 'pre',
  exclude: /node_modules/,
  use: ['eslint-loader'],
};

// CONFIG
const pages = fse
  .readdirSync('src')
  .filter((file) => file.endsWith('.html'))
  .map((page) => new HtmlWebpackPlugin({
    filename: page,
    template: `${paths.src}/${page}`,
  }));

/* START COMMON CONFIGURATION
> > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > >
------------------------------------------------------------------------------------------------------------- */

const config = {
  entry: paths.entry.index,
  plugins: pages,
  // configuration regarding modules
  module: {
    // rules for modules (configure loaders, parser options, etc.)
    rules: [cssConfig, eslintConfig],
  },
};

// STYLE LINTING CONFIG
config.plugins.push(
  new StyleLintPlugin({
    configFile: '.stylelintrc',
    context: 'src/styles/',
    files: ['**/*.css'],
    // syntax: 'scss',
    failOnError: false,
    quiet: false,
  }),
); // END COMMON CONFIGURATION

/* START DEVELOPMENT CONFIGURATION
> > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > >
------------------------------------------------------------------------------------------------------------- */

if (currentTask === 'dev') {
  // add loader to start of array
  cssConfig.use.unshift('style-loader');

  // options related to how webpack emits results
  config.output = {
    filename: '[name].bundle.js',
    // the target directory for all output files
    // must be an absolute path (use the Node.js path module)
    path: path.resolve(__dirname, 'src'),
    // path: paths.dist.root,
  };

  config.devServer = {
    before(app, server) {
      server._watch(`${paths.src}/**/*.html`);
    },
    contentBase: paths.src,
    hot: true, // hot module replacement. Depends on HotModuleReplacementPlugin
    port: 3000,
    host: '0.0.0.0',
    noInfo: false, // only errors & warns on hot reload
  };

  // Chosen mode tells webpack to use its built-in optimizations accordingly.
  config.mode = 'development';

  // set devtools with source maps
  config.devtool = 'source-map';
} // END DEVELOPMENT CONFIGURATION

/* START PRODUCTION CONFIGURATION
> > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > >
------------------------------------------------------------------------------------------------------------- */

if (currentTask === 'build') {
  // configuration regarding modules
  // rules for modules (configure loaders, parser options, etc.)
  config.module.rules.push({
    test: /\.js$/,
    exclude: /(node_modules)/,
    use: {
      // the loader which should be applied, it'll be resolved relative to the context
      loader: 'babel-loader',
    },
  });

  // add loader to start of array
  // cssConfig.use.unshift(MiniCssExtractPlugin.loader);
  cssConfig.use.unshift(MiniCssExtractPlugin.loader);

  // add plugin to end of postcss plugin array
  postCSSPlugins.push(require('cssnano'));

  // options related to how webpack emits results
  config.output = {
    // the filename template for entry chunks
    // filename: `[name].[chunkhash].js`,
    // chunkFilename: `[name].[chunkhash].js`,

    // the target directory for all output files
    // must be an absolute path (use the Node.js path module)
    // path: path.resolve(__dirname, 'dist')
    path: paths.dist.root,
    filename: `${paths.dist.scripts}/[name].[hash:10].js`,
    chunkFilename: `${paths.dist.scripts}/[name].js`,
  };

  // Chosen mode tells webpack to use its built-in optimizations accordingly.
  config.mode = 'production';

  config.optimization = {
    splitChunks: { chunks: 'all' },
  };

  config.plugins.push(
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      // the filename template for entry chunks
      filename: `styles.[chunkhash].css`,
      // filename: `${paths.dist.stylesheets}/styles.[chunkhash].css`
    }),
    new RunAfterCompile(),
  );
} // END PRODUCTION CONFIGURATION

module.exports = config;
