const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const Dotenv = require('dotenv-webpack')

module.exports = {
	entry: './src/main.js',
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist')
	},
	devtool: 'eval-source-map',
	devServer: {
		contentBase: './dist'
	},
	plugins: [
		new UglifyJsPlugin({ sourceMap: true }),
		new UglifyJsPlugin(),
		new CleanWebpackPlugin(['dist']),
		new HtmlWebpackPlugin({
			title: 'rpg',
			template: './src/index.html',
			inject: 'body'
		}),
		new CopyPlugin([
			{from:'src/DBs', to: 'DBs'}
		]),
		new Dotenv()
	],
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [
					'style-loader',
					'css-loader'
				]
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: "eslint-loader"
			},
			{
				test: /\.(png|svg|jpg|gif)$/,
				use: [
					'file-loader'
				]
			},
			{
				test: /\.js$/,
				exclude: [
					/node_modules/,
					/spec/
				],
				loader: "eslint-loader"
			},
			{
				test: /\.js$/,
				exclude: [
					/node_modules/,
					/spec/
				],
				loader: "babel-loader",
				options: {
					presets: ['es2015']
				}
			}
		]
	}
};
