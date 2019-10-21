import React, { Component } from 'react';
import autobind from 'autobind-decorator';
import { css } from 'emotion';

class App extends Component {
    @autobind
    onClick() {
        console.log('Yeah!');
    }

    render() {
        return (
            <div
                className={css({
                    backgroundColor: 'gray'
                })}
                onClick={this.onClick}
            >
                Hello, World from React!
            </div>
        );
    }
}

export default App;
