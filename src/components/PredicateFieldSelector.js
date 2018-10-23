import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

/**
 * Component for the field selector.
 */
export default class PredicateFieldSelector extends PureComponent { 
    static defaultProps = {
        data: []
    };
    
    static propTypes = {
        /**
         * Array of PredicateField object describing the options' label, value, and field type.
         * @type {Array.<PredicateField>} 
         */
        data: PropTypes.arrayOf(PropTypes.shape({
            label: PropTypes.string,
            value: PropTypes.any,
            type: PropTypes.oneOf(['string', 'number'])
        })),
    
        /**
         * Callback when the selection changes.
         * @type {FieldSelectorChangeCallback} 
         */
        onChange: PropTypes.func
    };

    componentDidMount() {
        // when selector is first mounted, notify caller of the selected data (first data element)
        const {onChange, data} = this.props;
        if (onChange) {
            onChange(data[0]);
        }
    }

    _onChange = (evt) => {
        const {onChange} = this.props;

        if (onChange) {
            const {target} = evt;
            const selectedOption = target.options[target.selectedIndex];

            // NOTE: 
            // domElement.dataset is an object with key/values of the element's data-* attributes.
            // The object keys are in camel-case. 
            // Example, given <option data-field-data="myValue">
            // option.dataset is the object { fieldData: "myValue" }
            const fieldData = JSON.parse(selectedOption.dataset.fieldData);
            onChange(fieldData);
        }
    };

    render() { 
        return (
            <select onChange={this._onChange}>
                {
                    this.props.data.map(fieldData =>
                        <option 
                            key={fieldData.value} 
                            value={fieldData.value} 
                            data-field-data={JSON.stringify(fieldData)} 
                        >
                            {fieldData.label}
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
 * Object describing the field.
 * @typedef {Object} PredicateField
 * @property {string} label - The display label of the field.
 * @property {*} value - The value of the field.
 * @property {"string"|"number"} type - The field data type which is either "string" or "number".
 * @property {Array.<string>} inputHints - String array of hints for expected PredicateComparatorArgs input value(s).
 */

/**
 * Callback when the selection changes.
 * @typedef {function} FieldSelectorChangeCallback
 * @param {object} evt - The change event.
 * @param {object} $0 - The data object.
 * @property {string} $0.label - The display label of the field.
 * @property {*} $0.value - The value of the field.
 * @property {"string"|"number"} $0.type - The field type which is either "string" or "number".
 */
