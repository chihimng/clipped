const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')

const isDevelopement = process.env.NODE_ENV && process.env.NODE_ENV.includes('dev')

module.exports = (clipped, opt = {babel: {options: {}}}) => {
  clipped.config.dev = {enableLint: false}
  
  try {
    clipped.config.webpack = {
      context: clipped.config.context,
      entry: {
        index: [path.join(clipped.config.src, 'index.js')]
      },
      output: {
        pathinfo: true,
        path: clipped.config.dist
      },
      externals: {
        // react-native and nodejs socket excluded to make skygear work
        'react-native': 'undefined',
        'websocket': 'undefined'
      },
      resolveLoader: {
        modules: [
          'node_modules',
          clipped.resolve('node_modules'),
          path.join(__dirname, 'node_modules')
        ]
      },
      resolve: {
        alias: {
          '@': clipped.config.src,
          '~': clipped.config.src
        },
        extensions: ['*', '.js', '.vue', '.jsx', '.json', '.marko', '.ts', '.tsx'],
        modules: [
          'node_modules',
          clipped.resolve('node_modules'),
          path.join(__dirname, 'node_modules')
        ]
      },
      performance: {
        hints: false
      },
      devtool: false,
      plugins: [],
      module: {
        rules: []
      }
    }

    clipped.config.webpack
      .plugins
        .use('clean', CleanWebpackPlugin, [[clipped.config.dist], {
          root: clipped.config.context
        }])
        .use('define', webpack.DefinePlugin, [{
          'process.env': {
            NODE_ENV: isDevelopement ? '"development"' : '"production"'
          }
        }])

    clipped.config.webpack
      .module
        .rules
          .set('babel', {
            test: /\.jsx?$/,
            include: [clipped.config.src],
            exclude: /(node_modules|bower_components)/,
            use: []
          })
            .babel
              .use
                .set('babel', {
                  loader: require.resolve('babel-loader'),
                  options: {
                    presets: []
                  }
                })
                  .babel
                    .options
                      .presets
                        .set('env', [require.resolve('babel-preset-env'), { modules: false }])

    if (!isDevelopement) {
      clipped.config.webpack
        .module
          .rules.babel.use.babel.options.presets
            .set('uglify', [require.resolve('babel-preset-minify')])
    }

    const getWebpackInstance = () =>
      webpack(clipped.config.webpack.toJSON())

    clipped.hook('watch')
      .add('default', clipped =>
        new Promise((resolve, reject) => {
          const webpackInstance = getWebpackInstance()
          webpackInstance.watch({}, (err, stats) => {
            if (err || stats.hasErrors()) {
              console.error(err)
            }

            console.log(stats.toString({
              chunks: false, // Makes the build much quieter
              colors: true // Shows colors in the console
            }))
          })
        })
      )

    clipped.hook('build')
      .add('default', clipped =>
        new Promise((resolve, reject) => {
          process.env.NODE_ENV = 'production'
          
          const webpackInstance = getWebpackInstance()
          webpackInstance.run((err, stats = {}) => {
            if (err || stats.hasErrors()) {
              console.error(err)
              reject(err)
            }

            console.log(stats.toString({
              chunks: false, // Makes the build much quieter
              colors: true // Shows colors in the console
            }))
            resolve()
          })
        })
      )
  } catch (e) {
    console.error(e)
    process.exit(0)
  }
}
