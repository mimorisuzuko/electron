import { DefinePlugin, HotModuleReplacementPlugin, NamedModulesPlugin, optimize } from 'webpack';
import libpath from 'path';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import { NODE_ENV, WATCH, isProduction } from './env';

const { UglifyJsPlugin, AggressiveMergingPlugin } = optimize;
const dst = 'app/dst';
const generateScopedName = '[name]__[local]';
const context = libpath.join(__dirname, 'src/');
const presets = ['react'];

const plugins = [
	new CleanWebpackPlugin([dst], {
		root: __dirname,
		verbose: false,
		dry: false,
		exclude: ['index.html', 'index.css']
	}),
	new DefinePlugin({
		'process.env': {
			NODE_ENV: JSON.stringify(NODE_ENV)
		}
	}),
	new NamedModulesPlugin()
];

if (isProduction) {
	presets.push('es2015');
	plugins.push(
		new UglifyJsPlugin({ compress: { warnings: false }, mangle: true }),
		new AggressiveMergingPlugin(),
		new HotModuleReplacementPlugin()
	);
}

const config = {
	entry: context,
	output: {
		path: libpath.join(__dirname, dst),
		publicPath: 'http://localhost:3000/',
		filename: 'index.js'
	},
	module: {
		loaders: [
			{
				test: /\.jsx$/,
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
	externals: ['electron'],
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