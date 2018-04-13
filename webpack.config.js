var path = require('path');
var webpack = require('webpack');

//console.log(process.env.NODE_ENV)
var m = process.env.NODE_ENV
var p = null;
var ent = {
    login: path.resolve(__dirname, 'public/Scripts/src/login/login.js'),
    vendors: ['react', 'react-dom', 'redux', 'react-redux', 'redux-thunk', 'react-addons-update', 'moment', path.resolve(__dirname, 'public/Scripts/comm/comm-run')]
};

if (m === "development") {
    p = {
        entry: ent,
        output: {
            path: path.resolve(__dirname, 'public/Scripts/build/app'),
            filename: '[name].js'
        },
        externals: {
            jquery: "jQuery"
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: 'babel-loader',
                            options: { presets: ['es2015', "stage-0"] }
                        }
                    ]
                },
                {
                    test: /\.css$/,
                    use: ['style-loader', 'css-loader']
                }
            ]
        },
        resolve: {
            alias: {
                moment: "moment/moment.js"
            },
            extensions: ['.js', '.css']
        },
        plugins: [
            new webpack.optimize.CommonsChunkPlugin({ name: 'vendors', filename: 'vendors.js', minChunks: Infinity }),
            new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /zh-tw/),
        ]
    }
} else {
    p = {
        entry: ent,
        output: {
            path: path.resolve(__dirname, 'public/Scripts/build/app'),
            filename: '[name].js'
        },
        externals: {
            jquery: "jQuery"
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: 'babel-loader',
                            options: { presets: ['es2015', "stage-0"] }
                        }
                    ]
                },
                {
                    test: /\.css$/,
                    use: ['style-loader', 'css-loader']
                }
            ]
        },
        resolve: {
            alias: {
                moment: "moment/moment.js"
            },
            extensions: ['.js', '.css']
        },
        plugins: [
            new webpack.optimize.CommonsChunkPlugin({ name: 'vendors', filename: 'vendors.js', minChunks: Infinity }),
            new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /zh-tw/),
            new webpack.optimize.ModuleConcatenationPlugin(),
            new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify('production') }),
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false,
                    screw_ie8: true,
                    conditionals: true,
                    unused: true,
                    comparisons: true,
                    sequences: true,
                    dead_code: true,
                    evaluate: true,
                    if_return: true,
                    join_vars: true
                },
                output: {
                    comments: false
                }
            }),
            new webpack.HashedModuleIdsPlugin()
        ]
    }
}
module.exports = p;