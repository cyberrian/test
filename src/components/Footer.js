import React from 'react';
import PropTypes from 'prop-types';
import {joinClassNames} from './utils';

/**
 * Footer component.
 */
const Footer = ({className, ...props}) =>
    <div className={joinClassNames('Footer', className)} {...props} />;

Footer.propTypes = {
    /**
     * Native React prop to add css class.
     */
    className: PropTypes.string
};

export default Footer;
