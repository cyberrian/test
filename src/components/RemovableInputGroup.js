import React from 'react';
import InputGroup from './InputGroup';
import Button from './Button';

/**
 * Component consisting of a remove button, PredicateInputGroup, and error label.
 * @param {PredicateInputGroup} inputGroup - The PredicateInputGroup element to display in this row.
 * @param {string} error - Error to display for this input group.
 * @param {boolean} [removable=true] - true to enable the remove button; false to disable it.
 * @param {function} onRemove - Callback when the remove button is clicked; onRemove's param is the input group's id.
 */
const RemovableInputGroup = ({inputGroup, error, removable = true, onRemove, ...otherProps}) => {
    const inputGroupId = inputGroup.props.id;
    const removeButtonProps = {
        onClick: onRemove(inputGroupId),
        children: '-'
    };

    if (!removable) {
        removeButtonProps.disabled = 'disabled';
    }

    return (
        <InputGroup id={`removableInputGroup-${inputGroupId}`} {...otherProps}>
            <Button className='removeButton' {...removeButtonProps} />
            {inputGroup}
            <label className='error'>{error}</label>
        </InputGroup>
    );
};

export default RemovableInputGroup;
