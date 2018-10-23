import React from 'react';
import PropTypes from 'prop-types';
import {joinClassNames} from './utils';

/**
 * Button component.
 */
const Button = ({className, primary, ...props}) => {
    let classNames = 'Button';

    if (primary) {
        classNames += ' primary';
    }

    return (
        <button {...props} className={joinClassNames(classNames, className)} />
    );
};

Button.defaultProps = {
    primary: false
};

Button.propTypes = {
    /**
     * Native React prop to add css class.
     */
    className: PropTypes.string,

    /**
     * Set to true to make this a primary button (styled with a blue background).
     * If false, button is styled with a white background.
     * Defaults to false.
     * See sass/style.scss and search for the .Button class for more styling details.
     */
    primary: PropTypes.bool
};

export default Button;
