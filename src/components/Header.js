import React from 'react';
import PropTypes from 'prop-types';
import {joinClassNames} from './utils';

/**
 * Header component.
 */
const Header = ({className, ...props}) =>
    <div className={joinClassNames('Header', className)} {...props} />;

Header.propTypes = {
    /**
     * Native React prop to add css class.
     */
    className: PropTypes.string
};

export default Header;
