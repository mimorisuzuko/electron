import webpack from 'webpack';
import libpath from 'path';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import ButternutWebpackPlugin from 'butternut-webpack-plugin';

const dst = 'app/dst';
const generateScopedName = '[name]__[local]';
const context = libpath.join(__dirname, 'src/');

export default {
	entry: context,
	output: {
		path: libpath.join(__dirname, dst),
		filename: 'index.js'
	},
	module: {
		loaders: [
			{
				test: /\.jsx$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
				query: {
					presets: ['react'],
					plugins: [
						'transform-decorators-legacy',
						['react-css-modules',
							{
								context,
								generateScopedName,
								filetypes: {
									'.scss': {
										syntax: 'postcss-scss'
									}
								}
							}
						]
					]
				}
			},
			{
				test: /\.scss$/,
				use: [
					'style-loader',
					`css-loader?importLoader=1&modules&localIdentName=${generateScopedName}`,
					'postcss-loader',
					'sass-loader'
				]
			}
		]
	},
	resolve: {
		extensions: ['.js', '.jsx']
	},
	plugins: [
		new CleanWebpackPlugin([dst], {
			root: __dirname,
			verbose: false,
			dry: false,
			exclude: ['index.html', 'index.css']
		}),
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: JSON.stringify('production')
			}
		}),
		new ButternutWebpackPlugin({})
	],
	externals: {
		'react': 'React',
		'react-dom': 'ReactDOM'
	},
	node: {
		__filename: false,
		__dirname: false
	},
	target: 'electron'
};