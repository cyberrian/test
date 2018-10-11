import React, {Component} from 'react';
import axios from 'axios';

export default class App extends Component {
    state = {
        ajaxData: {}
    };

    componentDidMount() {
        console.log('did mount');
        axios.get('/api/data')
            .then(resp => {
                console.log('Got data from /api/data', resp);
                this.setState({ajaxData: resp.data});
            })
            .catch(console.error);
    }

    componentWillUnmount() {
        console.log('will unmount');
    }

    render() {
        return (
            <div className='App testStyle'>
                <h2>Test AJAX data:</h2>
                <pre>
                    <code className='subStyle'>
                        { JSON.stringify(this.state.ajaxData, null, '\t') }
                    </code>
                </pre>
            </div>
        );
    }
}
