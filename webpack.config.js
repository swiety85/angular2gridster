var webpack = require('webpack');
var path = require('path');
var webpackMerge = require('webpack-merge');
var UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');

var ENV = process.env.npm_lifecycle_event;

var isBundled = ENV === 'webpack:umd' || ENV === 'webpack:umd:min';
var isMin = ENV === 'webpack:umd:min';

// Webpack Config
var webpackConfig = {
  entry: {
    'main': './demo/main.ts',
  },

  output: {
    publicPath: '',
    path: path.resolve(__dirname, 'dist')
  },

  plugins: [
    new webpack.ContextReplacementPlugin(
      // The (\\|\/) piece accounts for path separators in *nix and Windows
      /angular(\\|\/)core(\\|\/)src(\\|\/)linker/,
      path.resolve(__dirname, './demo'),
      {
        // your Angular Async Route paths relative to this root directory
      }
    ),
  ],

  module: {
    loaders: [
      {
      test: /\.ts$/,
      loaders: ['angular2-template-loader','awesome-typescript-loader'],
      exclude: [/\.(spec|e2e)\.ts$/]
    },
    /* Embed files. */
    { 
      test: /\.(html|css)$/, 
      loader: 'raw-loader'
    },
    /* Async loading. */
    {
      test: /\.async\.(html|css)$/, 
      loaders: ['file?name=[name].[hash].[ext]', 'extract']
    }
    ]
  }

};

if(isBundled){
    webpackConfig.entry.main = './index.ts';
    webpackConfig.output = {
      publicPath: '',
      path: path.resolve(__dirname, 'dist'),
      libraryTarget: 'umd',
      filename: 'angular2gridster.umd.js',
      library: 'angular2gridster'
    };
    webpackConfig.externals =  [/^\@angular\//, /^rxjs\//];
    if(isMin){
        webpackConfig.output.filename = 'angular2gridster.umd.min.js';
        webpackConfig.plugins.push(
          new UglifyJsPlugin({
                beautify: false,
                comments: false
        }));
    }
}


// Our Webpack Defaults
var defaultConfig = {
  devtool: 'source-map',

  output: {
    filename: '[name].bundle.js',
    sourceMapFilename: '[name].map',
    chunkFilename: '[id].chunk.js'
  },

  resolve: {
    extensions: [ '.ts', '.js' ],
    modules: [ path.resolve(__dirname, 'node_modules') ]
  },

  devServer: {
    historyApiFallback: true,
    watchOptions: { aggregateTimeout: 300, poll: 1000 }
  },

  node: {
    global: true,
    crypto: 'empty',
    __dirname: true,
    __filename: true,
    process: true,
    Buffer: false,
    clearImmediate: false,
    setImmediate: false
  }
};


module.exports = webpackMerge(defaultConfig, webpackConfig);