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
            <div className='App testStyle'>
                {this.state.body}
                <br/>
                <code className='subStyle'>
                    Some awesome code.
                </code>
            </div>
        );
    }
}
