import React, {PureComponent, Fragment} from 'react';
import PropTypes from 'prop-types';

/**
 * Component for the comparator selector.
 * If type is "string", renders the StringComparatorSelector component.
 * If type is "number", renders the NumberComparatorSelector component.
 * Example: 
 * Renders a StringComparatorSelector component which is a <select> with options "contains", "does not contain", "equals", etc.
 */
export default class PredicateComparatorSelector extends PureComponent {
    static defaultProps = {
        comparators: {}
    };
    
    static propTypes = {
        /**
         * Comparators object with keys for each available comparator type.
         * @type {PredicateComparators}
         */
        comparators: PropTypes.object,

        /**
         * Comparator type - either "string" or "number"; else, nothing will be rendered.
         * @type {"string"|"number"}
         */
        type: PropTypes.oneOf(['number', 'string']),

        /**
         * Callback when selector changes.
         * @type {PredicateComparatorSelectorChangeCallback}
         */
        onChange: PropTypes.func
    };

    render() {
        const {comparators, type, onChange} = this.props;

        if (type === 'string') {
            return <StringComparatorSelector data={comparators[type]} onChange={onChange} />;
        } else if (type === 'number') {
            return (
                <Fragment>
                    <span className='predicateInputLabel'>is</span>
                    <NumberComparatorSelector data={comparators[type]} onChange={onChange} />
                </Fragment>
            );
        }
        
        return null;
    }
}

const utils = {
    /**
     * Notifies caller of a change event using an event object.
     * @param {function} onChange - The callback to call.
     * @param {object} evt - The change event object.
     */
    fireChangeWithEvent: (onChange, evt) => {
        if (onChange) {
            const {target} = evt;
            const selectedOption = target.options[target.selectedIndex];

            // NOTE: 
            // domElement.dataset is an object with key/values of the element's data-* attributes.
            // The object keys are in camel-case. 
            // Example, given <option data-comparator-data="myValue">
            // option.dataset is the object { comparatorData: "myValue" }
            const comparatorData = JSON.parse(selectedOption.dataset.comparatorData);
            onChange({
                numArgs: 1, // default to 1
                ...comparatorData
            });
        }
    },

    /**
     * Notifies caller of a change event using a PredicateComparator object.
     * @param {function} onChange - The callback to call.
     * @param {PredicateComparator} comparatorData - The PredicateComparator object.
     */
    fireChangeWithData: (onChange, comparatorData) => {
        if (onChange) {
            onChange({
                numArgs: 1, // default to 1
                ...comparatorData
            });
        }
    }
};

/**
 * Inner component for the string comparator selector.
 * @param {Array.<PredicateComparator>} data - Object array describing the options' label, value, etc.
 * @param {function} onChange - Callback when the selection changes.
 */
class StringComparatorSelector extends PureComponent {
    static defaultProps = {
        data: []
    };

    static propTypes = {
        data: PropTypes.arrayOf(PropTypes.shape({
            label: PropTypes.string,
            value: PropTypes.any,
            numArgs: PropTypes.number
        })),
        onChange: PropTypes.func
    };

    componentDidMount() {
        // when selector is first mounted, notify caller of the selected data (first data element)
        const {onChange, data} = this.props;
        utils.fireChangeWithData(onChange, data[0]);
    }

    _onChange = (evt) => utils.fireChangeWithEvent(this.props.onChange, evt);

    render() {
        const {data} = this.props;
        return (
            <select onChange={this._onChange}>
                {
                    data.map(comparatorData => 
                        <option 
                            key={comparatorData.value} 
                            value={comparatorData.value} 
                            data-comparator-data={JSON.stringify(comparatorData)}
                        >
                            {comparatorData.label}
                        </option>)
                }
            </select>
        );
    }
}

/**
 * Inner component for the number comparator selector.
 * @param {Array.<PredicateComparator>} data - Object array describing the options' label, value, etc.
 * @param {function} onChange - Callback when the selection changes.
 */
class NumberComparatorSelector extends PureComponent {
    static defaultProps = {
        data: []
    };

    static propTypes = {
        data: PropTypes.arrayOf(PropTypes.shape({
            label: PropTypes.string,
            value: PropTypes.any,
            numArgs: PropTypes.number
        })),
        onChange: PropTypes.func
    };

    componentDidMount() {
        // when selector is first mounted, notify caller that selector is set to first data element
        const {onChange, data} = this.props;
        utils.fireChangeWithData(onChange, data[0]);
    }

    _onChange = (evt) => utils.fireChangeWithEvent(this.props.onChange, evt);

    render() {
        const {data} = this.props;
        return (
            <select onChange={this._onChange}>
                {
                    data.map(comparatorData =>
                        <option 
                            key={comparatorData.value} 
                            value={comparatorData.value} 
                            data-comparator-data={JSON.stringify(comparatorData)}
                        >
                            {comparatorData.label}
                        </option>)
                }
            </select>
        );
    }
}


/*************************************************
 * Documentation for custom variable types below.
 *************************************************/

/**
 * Callback when the selection changes.
 * @typedef {function} PredicateComparatorSelectorChangeCallback
 * @param {object} evt - The change event.
 * @param {object} $0 - The data object.
 * @property {string} $0.label - The display label of the comparator.
 * @property {*} $0.value - The value of the comparator.
 * @property {number} $0.numArgs - The number of arguments supported by the selected comparator.
 */

/**
 * Object describing the comparator.
 * @typedef {Object} PredicateComparator
 * @property {string} label - The display label of the comparator.
 * @property {*} value - The value of the comparator
 * @property {number} [numArgs = 1] - The number of arguments this comparator supports.
 * If numArgs = 2, two text inputs will be shown.
 * Else, a single text input will be shown to the right of this comparator. 
 * Defaults to 1.
 * @property {Array.<string>} inputHints - String array of hints for expected PredicateComparatorArgs input value(s).
 */

/**
 * Object desribing the available comparators.
 * Object key is the comparator type "string" or "number".
 * Object value is an array of PredicateComparator. 
 * Example:
 * {
 *      "string": Array.<PredicateComparator>,
 *      "number": Array.<PredicateComparator>
 * }
 * 
 * Example with data:
 * {
 *      "string": [
 *           {   // object of type PredicateStringComparator
 *               label: 'starts with',
 *               value: 'starts_with' // internal value used by server to generate sql query
 *               // numArgs default to 1 if not specified
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
 *               numArgs: 2    // 2 for min and max args for range comparator
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
