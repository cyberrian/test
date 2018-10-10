import React, {Component} from 'react';

export default class App extends Component {
    state = {
        body: 'App content'
    };

    componentDidMount() {
        console.log('did mount');
    }

    componentWillUnmount() {
        console.log('will unmount');
    }

    render() {
        return (
            <div className='App'>
                {this.state.body}
            </div>
        );
    }
}
