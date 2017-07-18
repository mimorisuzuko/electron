import webpack from 'webpack';
import libpath from 'path';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import ButternutWebpackPlugin from 'butternut-webpack-plugin';

const dst = 'app/dst';

export default {
	entry: libpath.join(__dirname, 'src/'),
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
				}
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