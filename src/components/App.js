import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {joinClassNames} from './utils';
import SearchSessionScreen from '../screens/SearchSessionScreen';

export default class App extends Component {
    static propTypes = {
        /**
         * Native React prop to add css class.
         */
        className: PropTypes.string
    };
    
    render() {
        const {className, ...props} = this.props;

        return (
            <div className={joinClassNames('App', className)} {...props}>
                <SearchSessionScreen />
            </div>
        );
    }
}
