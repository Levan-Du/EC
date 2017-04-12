var webpack = require('webpack'),
    path = require('path'),
    ExtractTextPlugin = require('extract-text-webpack-plugin');

var plugins = require('./config/webpack.plugins.config')(__dirname);

module.exports = {
    entry: {
        index: path.join(__dirname, 'src/pages/goods/index.js'),
        gooddetail: path.join(__dirname, 'src/pages/gooddetail/index.js'),
        pay: path.join(__dirname, 'src/pages/pay/index.js'),
        shopcar: path.join(__dirname, 'src/pages/shopcar/index.js'),
        orders: path.join(__dirname, 'src/pages/orders/index.js')
    },
    output: {
        path: path.join(__dirname, 'dist'),
        publicPath: '/',
        filename: 'js/[name].js'
    },
    module: {
        rules: [{
            test: /\.js$/,
            use: 'babel-loader'
        }, {
            test: /\.css$/,
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: 'css-loader!postcss-loader'
            })
        }, {
            //文件加载器，处理文件静态资源
            test: /\.(woff|woff2|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            include: [path.join(__dirname, 'src/assets')],
            use: 'file-loader?name=css/iconfont/[name].[ext]'
        }]
    },
    plugins: plugins,
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        port: 8080,
        inline: true
    }
}
