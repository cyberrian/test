import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import InputGroup from './InputGroup';
import FieldSelector from './PredicateFieldSelector';
import ComparatorSelector from './PredicateComparatorSelector';
import ComparatorArgs from './PredicateComparatorArgs';
import {joinClassNames} from './utils';

/**
 * Component containing inputs to specify the field name, comparator, and values to build a predicate.
 * 
 * Example #1 - when selected field is type string:
 * [Field selector] [String comparator selector] [String text input]
 * 
 * Example #2a - when selected field is type number:
 * [Field selector] is [Number comparator selector] [Number text input]
 * 
 * Example #2b - when selected field is type number and selected number comparator is "range", allowing a min and max input:
 * [Field selector] is [Number comparator selector] [Min text input] and [Max text input]
 * 
 * NOTE:
 * [Field selector]  
 * This is a drop down to select the field name.
 * Drop down options:
 * User email, Screen width, Screen height, # of visits, First name, Last name, Page response time (ms), Domain, Page path.
 * 
 * [String comparator selector]  
 * This is the drop down shown when the selected field is type string.
 * Drop down options:
 *   - starts with
 *   - does not start with
 *   - equals
 *   - does not equal
 *   - contains
 *   - does not contain
 *   - in list
 *   - not in list
 *   - contains all
 * 
 * [Number comparator selector]
 * This is the drop down shown when the selected field is type number.
 * Drop down options:
 *   - range
 *   - less than or equal
 *   - equals
 *   - does not equal
 *   - greater than or equal
 */
export default class PredicateInputGroup extends PureComponent {
    static defaultProps = {
        fields: []
    };
    
    static propTypes = {
        id: PropTypes.string.isRequired,
    
        /**
         * Array of PredicateField objects describing the available fields which can be selected.
         * @type {Array.<PredicateField>}
         */
        fields: PropTypes.arrayOf(PropTypes.shape({
            label: PropTypes.string.isRequired,
            value: PropTypes.any,
            type: PropTypes.oneOf([
                'string', 
                'number'
            ]).isRequired
        })),

        /**
         * Object desribing the available comparators.
         * @type {PredicateComparators}
         */
        comparators: PropTypes.object,

        /**
         * @type {PredicateInputGroupChangeCallback}
         */
        onChange: PropTypes.func
    };

    state = { // not necessary to set to undefined but useful to expose the keys being used
        fieldType: undefined, // ComparatorSelector component uses state.fieldType for its "type" prop
        fieldInputHints: [], 
        numComparatorArgs: 1, // ComparatorArgs component uses state.numComparatorArgs for its "numArgs" prop

        fieldValue: undefined, // updated when the FieldSelector value changes
        comparatorValue: undefined, // updated when the ComparatorSelector value changes
        comparatorArgsValue: [], // updated when the ComparatorArgs value changes
    };

    /**
     * Calls this.props.onChange with the updated values of the field selector, comparator selector, and comparator args.
     */
    _notifyChange = () => {
        const {onChange, id} = this.props;
        const {
            fieldValue,
            comparatorValue,
            comparatorArgsValue
        } = this.state;

        if (onChange) {
            onChange({
                id,
                field: fieldValue,
                comparator: comparatorValue,
                comparatorArgs: comparatorArgsValue
            });
        }
    }

    /**
     * Callback when the field selector changes.
     * @param {object} predicateField - See typedef PredicateFieldSelector.PredicateField for documentation.
     */
    _onFieldChange = (predicateField) => {
        const {value, type, inputHints = []} = predicateField;
        const stateValue = {
            fieldValue: value,
            fieldType: type,
            fieldInputHints: inputHints
        };

        this.setState(stateValue, this._notifyChange);
    }

    /**
     * Callback when the comparator selector changes.
     * @param {object} predicateComparator - See typedef PredicateComparatorSelector.PredicateComparator for documentation.
     */
    _onComparatorChange = (predicateComparator) => {
        const {value, numArgs} = predicateComparator;
        const stateValue = {
            comparatorValue: value,
            numComparatorArgs: numArgs
        };

        this.setState(stateValue, this._notifyChange); 
    }

    /**
     * Callback when a comparator arg value changes.
     * Recall comparator args are values from text input(s) right of the comparator selector.
     * @param {Array} values - The comparator arg values. 
     * If the selected comparator supports two arguments, values will contain two elements; otherwise values will contain one element.
     */
    _onComparatorArgsChange = (values) => {
        this.setState({
            comparatorArgsValue: values
        }, this._notifyChange);
    }

    render() {
        /* eslint-disable no-unused-vars */
        const {
            // exclude some custom props not supported by rendered element below
            className, 
            comparators,
            fields,
            onChange,

            ...props
        } = this.props;

        return (
            <InputGroup className={joinClassNames('PredicateInputGroup', className)} {...props}>
                <FieldSelector 
                    data={fields} 
                    onChange={this._onFieldChange} 
                />
                
                <ComparatorSelector 
                    comparators={comparators} 
                    type={this.state.fieldType} 
                    onChange={this._onComparatorChange} 
                />
                
                <ComparatorArgs 
                    numArgs={this.state.numComparatorArgs} 
                    placeholders={this.state.fieldInputHints}
                    type={this.state.fieldType} // if type is "number" ComparatorArgs will make text fields narrower
                    onChange={this._onComparatorArgsChange} 
                />
            </InputGroup>
        );
    }
}


/*************************************************
 * Documentation for custom variable types below.
 *************************************************/

/**
 * Object describing the field.
 * @typedef {Object} PredicateField
 * @property {string} text - The display text of the field.
 * @property {*} value - The value of the field.
 * @property {"string"|"number"} type - The field data type which is either "string" or "number".
 */

/**
 * Object describing the string comparator.
 * @typedef {Object} PredicateStringComparator
 * @property {string} text - The display text of the comparator.
 * @property {*} value - The value of the comparator.
 */

/**
 * Object describing the number comparator.
 * @typedef {Object} PredicateNumberComparator
 * @property {string} text - The display text of the comparator.
 * @property {*} value - The value of the comparator
 * @property {number} numArgs - The number of parameters for this comparator. 
 * If numArgs = 1, a single text input will be shown along side this comparator. If numArgs = 2, a min and max text input will be shown.
 */

/**
 * Object desribing the available comparators.
 * Object key is the comparator type "string" or "number".
 * If object key is "string", the object value is an array of PredicateStringComparator.
 * If object key is "number", the object value is an array of PredicateNumberComparator.
 * Example:
 * {
 *      "string": Array.<PredicateStringComparator>,
 *      "number": Array.<PredicateNumberComparator>
 * }
 * 
 * Example with data:
 * {
 *      "string": [
 *           {   // object of type PredicateStringComparator
 *               label: 'starts with',
 *               value: 'starts_with' // internal value used by server to generate sql query
 *           },
 *           {
 *               label: 'does not start with',
 *               value: 'does_not_start_with'
 *           }
 *      ],
 *      "number": [
 *           {   // object of type PredicateNumberComparator
 *               label: 'range',
 *               value: 'range', // internal value used by server to generate sql query
 *               numArgs: 2    // 2 for min and max params for range comparator
 *           },
 *           {
 *               label: 'less than or equal',
 *               value: 'less_than_or_equal',
 *               numArgs: 1
 *           }
 *      ]
 * }
 * @typedef {Object.<string, object>} PredicateComparators
 */

/**
 * Callback when the field selector, comparator selector, or comparator arg values change.
 * @callback PredicateInputGroupChangeCallback
 * @param {object} $0 - The object param.
 * @param {string} $0.id - The id of this PredicateInputGroup.
 * @param {*} $0.field - The field selector's value.
 * @param {*} $0.comparator - The comparator selector's value.
 * @param {Array} $0.comparatorArgs - The comparator arg values.
 */
