var webpack = require('webpack'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    path = require('path');


function initPlugins(rootPath) {
    var plugins = [
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
            template: path.join(rootPath, 'src/pages/goods/goods.html'),
            filename: 'index.html',
            inject: 'body',
            chunks: ['index']
        }),
        new HtmlWebpackPlugin({
            template: path.join(rootPath, 'src/pages/gooddetail/gooddetail.html'),
            filename: 'gooddetail.html',
            inject: 'body',
            chunks: ['gooddetail']
        }),
        new HtmlWebpackPlugin({
            template: path.join(rootPath, 'src/pages/pay/pay.html'),
            filename: 'pay.html',
            inject: 'body',
            chunks: ['pay']
        }),
        new HtmlWebpackPlugin({
            template: path.join(rootPath, 'src/pages/shopcar/shopcar.html'),
            filename: 'shopcar.html',
            inject: 'body',
            chunks: ['shopcar']
        }),
        new HtmlWebpackPlugin({
            template: path.join(rootPath, 'src/pages/orders/orders.html'),
            filename: 'orders.html',
            inject: 'body',
            chunks: ['orders']
        })
    ];


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

    return plugins;
}

module.exports = initPlugins;
