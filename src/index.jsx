import React from 'react';
import { render } from 'react-dom';
import App from './components/App';
import { AppContainer } from 'react-hot-loader';
import './index.scss';

const $main = document.querySelector('main');

render(
	<AppContainer>
		<App />
	</AppContainer>,
	$main
);

if (module.hot) {
	module.hot.accept('./components/App', () => {
		const { default: NextApp } = require('./components/App');

		render(
			<AppContainer>
				<NextApp />
			</AppContainer>,
			$main
		);
	});
}
