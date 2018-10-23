import React, {PureComponent, Fragment} from 'react';
import PropTypes from 'prop-types';

/**
 * Functional component which renders text input(s) to allow user to enter values for the comparator.
 * @param {number} [numArgs = 1]
 * If 2, two text inputs will be rendered to enable a min and max input.
 * Else, a single text input will be rendered. Defaults to 1.
 * 
 * @param {PredicateComparatorArgsChangeCallback} onChange
 * Callback when the input value(s) change.
 * 
 * @param {Array.<string>} [placeholders=[]]
 * Array of placeholder strings to assign to the inputs.
 * placeholders[0] is for the first input.
 * If numArgs = 2, placeholders[1] is for the second input. 
 * NOTE: a placeholder string provides a short hint describing the expected value of the input.
 */
export default class PredicateComparatorArgs extends PureComponent {
    static defaultProps = {
        numArgs: 1,
        placeholders: []
    };

    static propTypes = {
        numArgs: PropTypes.number,
        onChange: PropTypes.func,
        placeholders: PropTypes.arrayOf(PropTypes.string)
    };

    render () {
        const {numArgs, placeholders, onChange} = this.props;

        if (numArgs === 2) {
            return <TwoArgs placeholders={placeholders} onChange={onChange} />;
        }
        return <OneArg placeholder={placeholders[0]} onChange={onChange} />;
    }
}


/**
 * Inner component which renders one text input.
 */
class OneArg extends PureComponent {
    static propTypes = {
        onChange: PropTypes.func,
        placeholder: PropTypes.string
    }

    componentDidMount() {
        const {onChange} = this.props;

        if (onChange) {
            onChange(['']); // when first mounted, notify caller of empty arg value
        }
    }

    _onChange = (evt) => {
        const {onChange} = this.props;
        if (onChange) {
            onChange([evt.target.value]);
        }
    }

    render () {
        const {placeholder} = this.props;
        return <input type='text' onChange={this._onChange} placeholder={placeholder}/>; 
    } 
}

/**
 * Inner component which renders two text inputs.
 */
class TwoArgs extends PureComponent {
    static propTypes = {
        onChange: PropTypes.func,
        placeholders: PropTypes.arrayOf(PropTypes.string)
    }

    state = {
        values: []
    }

    componentDidMount() {
        const {onChange} = this.props;

        if (onChange) {
            onChange(this.changeArg); // when first mounted, notify caller of empty arg values
        }
    }

    /**
     * Returns arg for the onChange callback.
     * @returns {object}
     */
    get changeArg() {
        const [value1 = '', value2 = ''] = this.state.values;

        // array with two elements; element value defaults to empty string if undefined
        return [ value1, value2 ];
    }

    /**
     * @param {number} argIndex - 0 if the first input changed; 1 if the second input changed.
     * @returns an event handler
     */
    _onChange = (argIndex) => (evt) => {
        const values = [...this.state.values]; // copy previous state value
        values[argIndex] = evt.target.value; // set value at index

        this.setState({values}, () => // update state then notify caller of change
            this.props.onChange(this.changeArg));
    };

    render () {
        const {placeholders} = this.props;
        return (
            <Fragment>
                <input type='text' key='min' placeholder={placeholders[0]} onChange={this._onChange(0)} />
                <span key='and' className='predicateInputLabel'>and</span>
                <input type='text' key='max' placeholder={placeholders[1]} onChange={this._onChange(1)} />
            </Fragment>
        );
    } 
}


/*************************************************
 * Documentation for custom variable types below.
 *************************************************/

/**
 * Callback when one of the args change.
 * @callback PredicateComparatorArgsChangeCallback
 * @param {Array} The values array.
 */
