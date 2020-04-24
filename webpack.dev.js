const path = require('path');
const HtmlWebPackPlugin = require("html-webpack-plugin")
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
    entry: './src/index.js',    
    mode: 'development',
    devtool: 'source-map',  
    module: {
        rules: [{
            test: '/\.js$/',            
            exclude: [ /node_modules/ ],            
            loader: 'babel-loader',
            options: {            
                presets: [ "@babel/preset-env" ],
                plugins: [ "@babel/plugin-proposal-class-properties" ]
            }
        }, {
            test: /\.scss$/,
            use: ['style-loader', 'css-loader', 'sass-loader']
        }, {
            test: /\.css$/,
            use: [
                MiniCssExtractPlugin.loader,
                'css-loader', 'postcss-loader'
            ]
        }]
    },
    plugins: [        
        new HtmlWebPackPlugin({
            template: "./src/views/index.html",
            filename: "./index.html",
        }),
        new MiniCssExtractPlugin({
            filename: 'index.css',
            chunkFilename: 'index.css'
        }),
        new CleanWebpackPlugin({
            // Simulate the removal of files
            dry: true,
            // Write Logs to Console
            verbose: false,
            // Automatically remove all unused webpack assets on rebuild
            cleanStaleWebpackAssets: true,
            protectWebpackAssets: false
        })        
    ]
}