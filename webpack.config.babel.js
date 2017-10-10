import { DefinePlugin, HotModuleReplacementPlugin, optimize, LoaderOptionsPlugin } from 'webpack';
import libpath from 'path';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import { NODE_ENV, WATCH, isProduction } from './env';
import UglifyJSPlugin from 'uglifyjs-webpack-plugin';

const { AggressiveMergingPlugin } = optimize;
const dst = 'app/dst';
const generateScopedName = '[name]__[local]_[hash:base64:5]';
const context = libpath.join(__dirname, 'src/');
const presets = ['react'];

const plugins = [
	new CleanWebpackPlugin([dst], {
		root: __dirname,
		verbose: false,
		dry: false,
		exclude: ['index.html']
	}),
	new DefinePlugin({
		'process.env': {
			NODE_ENV: JSON.stringify(NODE_ENV)
		}
	}),
	new LoaderOptionsPlugin({
		options: {
			context
		}
	})
];

if (isProduction) {
	presets.push('es2015', 'stage-3');
	plugins.push(
		new UglifyJSPlugin({
			uglifyOptions: { compress: { warnings: false }, mangle: true }
		}),
		new AggressiveMergingPlugin(),
	);
} else {
	plugins.push(new HotModuleReplacementPlugin());
}

const config = {
	entry: ['babel-polyfill', context],
	output: {
		path: libpath.join(__dirname, dst),
		publicPath: 'http://localhost:3000/',
		filename: 'index.js'
	},
	module: {
		loaders: [
			{
				test: /\.js(x?)$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
				query: {
					presets,
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
	plugins,
	node: {
		__filename: false,
		__dirname: false
	},
	target: 'electron-renderer'
};

if (WATCH) {
	Object.assign(config, {
		entry: [
			'webpack-dev-server/client?http://0.0.0.0:3000',
			'webpack/hot/only-dev-server',
			'react-hot-loader/patch',
			context
		],
		devServer: {
			hot: true,
			port: 3000,
			host: '0.0.0.0',
			contentBase: libpath.join(__dirname, dst)
		}
	});
}

export default config;