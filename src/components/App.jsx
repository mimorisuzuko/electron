import React, { Component } from 'react';
import autobind from 'autobind-decorator';
import './App.scss';

class App extends Component {
	@autobind
	onClick() {
		console.log('Yeah!');
	}

	render() {
		return <div styleName='base'>Hello, World from React!</div>;
	}
}

export default App;
