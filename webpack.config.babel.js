import webpack from 'webpack';
import path from 'path';


module.exports = (env, argv) => {
  const { prod } = env;
  return {
    context: path.resolve(__dirname, 'src'),
    entry: prod ? './index.prod.js' : './index.dev.js',
    mode: prod ? 'production' : 'development',
  
    output: {
      path: path.resolve(__dirname, 'build'),
      publicPath: '/build',
      filename: 'bundle.js',
      libraryTarget: 'umd'
    },
  
    resolve: {
      extensions: ['', '.jsx', '.js', '.json', '.scss'],
      modules: [
        path.resolve(__dirname, 'src/lib'),
        path.resolve(__dirname, 'node_modules'),
        'node_modules'
      ],
      alias: {
        components: path.resolve(__dirname, 'src/components'), // used for tests
        style: path.resolve(__dirname, 'src/style'),
        "react": "preact/compat",
        "react-dom/test-utils": "preact/test-utils",
        "react-dom": "preact/compat",     // Must be below test-utils
        "react/jsx-runtime": "preact/jsx-runtime"
      }
    },
  
    module: {
      rules: [
        { test: /\.jsx?$/, exclude: /node_modules/, use: 'babel-loader' },
        {
          // Transform our own .(scss|css) files with PostCSS and CSS-modules
          test: /\.(scss|css)$/,
          include: [path.resolve(__dirname, 'src/components')],
          use: [
            `style-loader`,
            {loader: 'css-loader', options: { sourceMap: !prod, modules: true, importLoaders: 1 }},
            'postcss-loader',
            {loader: 'sass-loader', options: { sourceMap: !prod }},
          ]
        },
        {
          test: /\.(scss|css)$/,
          exclude: [path.resolve(__dirname, 'src/components')],
          use: [
            `style-loader`,
            {loader: 'css-loader', options: { sourceMap: !prod }},
            'postcss-loader',
            {loader: 'sass-loader', options: { sourceMap: !prod }},
          ]
        },
        { test: /\.json$/, use: 'json-loader' },
        { test: /\.(xml|html|txt|md)$/, use: 'raw-loader' },
        {
          test: /\.(svg|woff2?|ttf|eot|jpe?g|png|gif)(\?.*)?$/i,
          use: prod ? 'file-loader?name=[path][name]_[hash:base64:5].[ext]' : 'url-loader'
        }
      ]
    },
  
    plugins: [new webpack.NoEmitOnErrorsPlugin()],
    stats: { colors: true },
    devtool: prod ? false : 'source-map',
  
    devServer: {
      port: env.port || 9009,
      hot: true, 
      // inline: true,
      // static: __dirname,  // use index.html at root
      static: {
        directory: path.resolve(__dirname, 'static'),
        publicPath: '/',
      },
      // colors: true,
      historyApiFallback: true,
      open: true
    },
    watchOptions: {
      ignored: '/static/'
    },
  }
};
