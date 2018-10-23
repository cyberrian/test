import React from 'react';
import PropTypes from 'prop-types';
import {joinClassNames} from './utils';

/**
 * Component to group and add consistent spacing between inputs.
 * Use as parent container to hold multiple inputs.
 * Example button bar:
 * <InputGroup>
 *  <Button>Button 1</Button>
 *  <Button>Button 2</Button>
 *  <Button>Button 3</Button>
 * </InputGroup>
 * 
 * Example row of button and inputs:
 * <InputGroup>
 *  <Button>Button 1</Button>
 *  <Select />
 *  <Select />
 *  <input />
 * </InputGroup>
 */
const InputGroup = ({className, ...props}) =>
    <span className={joinClassNames('InputGroup', className)} {...props} />;

InputGroup.propTypes = {
    /**
     * Id of the group.
     */
    id: PropTypes.string.isRequired,

    /**
     * Native React prop to add css class.
     */
    className: PropTypes.string
};

export default InputGroup;
