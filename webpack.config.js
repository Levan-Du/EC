var webpack = require('webpack'),
    path = require('path'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    path = require('path');

var plugins = [];
if (process.env.NODE_ENV === 'production') {
    plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            test: /(\.jsx|\.js)$/,
            compress: {
                warnings: false
            }
        })
    );
}

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
            exclude: /node_modules/,
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
    plugins: [
        new webpack.ProvidePlugin({
            $: 'n-zepto'
        }),
        // new webpack.optimize.CommonsChunkPlugin({
        //     name: 'vendors', // 将公共模块提取，生成名为`vendors`的chunk
        //     chunks: ['index', 'gooddetail', 'pay', 'shopcar', 'orders'], //提取哪些模块共有的部分
        //     minChunks: 3 // 提取至少3个模块共有的部分
        // }),
        new ExtractTextPlugin('css/[name].css?[contenthash]'),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'src/pages/goods/goods.html'),
            filename: 'index.html',
            inject: 'body',
            chunks: ['index']
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'src/pages/gooddetail/gooddetail.html'),
            filename: 'gooddetail.html',
            inject: 'body',
            chunks: ['gooddetail']
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'src/pages/pay/pay.html'),
            filename: 'pay.html',
            inject: 'body',
            chunks: ['pay']
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'src/pages/shopcar/shopcar.html'),
            filename: 'shopcar.html',
            inject: 'body',
            chunks: ['shopcar']
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'src/pages/orders/orders.html'),
            filename: 'orders.html',
            inject: 'body',
            chunks: ['orders']
        })
    ].concat(plugins),
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        port: 8080,
        inline: true
    }
}
