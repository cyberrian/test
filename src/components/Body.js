import React from 'react';
import PropTypes from 'prop-types';
import {joinClassNames} from './utils';

/**
 * Body component.
 */
const Body = ({classNames, ...props}) =>
    <div className={joinClassNames('Body', classNames)} {...props} />;

Body.propTypes = {
    /**
     * Native React prop to add css class.
     */
    className: PropTypes.string
};

export default Body;
