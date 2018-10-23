import React, {Component} from 'react';
import Header from '../components/Header';
import Body from '../components/Body';
import Footer from '../components/Footer';
import Button from '../components/Button';
import InputGroup from '../components/InputGroup';
import PredicateInputGroup from '../components/PredicateInputGroup';
import RemovableInputGroup from '../components/RemovableInputGroup';
import SearchResultTable from '../components/SearchResultTable';
import {getSearchSessionInputInfo, searchSession} from '../api';

/**
 * "Search for Sessions" screen.
 */
export default class SearchSessionScreen extends Component {
    state = {
        submitError: {details: [], summary: ''}, // submitError.details[i] contains server validation error for this._submitValues[i]; empty string if no error
        predicateInputGroups: [], // array of PredicateInputGroup component to be rendered
        searchResult: {} // contains { columns: [], data: [], sqlQuery: string } when updated with search results
    };

    _nextId = 0; // _createInput increments this to generate next id
    _predicateFields = []; // updated in componentDidMount()
    _predicateComparators = {}; // updated in componentDidMount()
    _submitValues = new Map(); // ES6 Map indexed by PredicateInputGroup's id; value is object {field: string, comparator: string, comparatorArgs: Array}

    componentDidMount() {
        getSearchSessionInputInfo() // server call to get available fields to search on
            .then(({fields, comparators}) => {
                this._predicateFields = fields;
                this._predicateComparators = comparators;
                this._addInputGroup(); // initially start with one PredicateInputGroup
            })
            .catch(console.error); // TODO: show error in UI for "production code"
    }

    _createInputGroup = () => {
        const id = String(++this._nextId);
        return (
            <PredicateInputGroup
                key={id}
                id={id}
                fields={this._predicateFields}
                comparators={this._predicateComparators}
                onChange={this._onInputGroupChange}
            />
        );
    }

    /**
     * Appends a PredicateInputGroup component to the screen.
     */
    _addInputGroup = () => {
        this.setState({
            predicateInputGroups: [...this.state.predicateInputGroups, this._createInputGroup()]
        });    
    }

    /**
     * Gets the submit error details at the specified index.
     * @param {number} index - The index of the error details to retrieve.
     */
    _getSubmitErrorDetails = (index) => {
        const {submitError = {}} = this.state;
        const {details = []} = submitError;
        return details[index] || '';
    }

    /**
     * Change handler for PredicateInputGroup.
     * @param {string} id - Id of the PredicateInputGroup component.
     * @param {*} values - Other key/values of the PredicateInputGroup, excluding the id.
     */
    _onInputGroupChange = ({id, ...values}) => {
        this._submitValues.set(id, {...values});

        // find index of id in submitValue
        const changedIndex = [...this._submitValues.keys()].indexOf(id); // O(n) but we aren't going to have that many rows

        // clear submit error for changed input
        const detailsCopy = [...this.state.submitError.details];
        detailsCopy[changedIndex] = '';

        this.setState({
            submitError: { details: detailsCopy, summary: '' }
        });
    };

    /**
     * Returns a handler to be used with the remove button's onClick prop.
     * @param {string} inputGroupId - Id of the PredicateInputGroup component to remove.
     * @returns {function} The remove button's click handler.
     */
    _removeButtonClickCallback = (inputGroupId) => () => {
        this._submitValues.delete(inputGroupId);
        const updatedState = this.state.predicateInputGroups.filter(inputGroup => inputGroup.props.id !== inputGroupId);
        this.setState({
            predicateInputGroups: updatedState
        });
    }

    /**
     * Click handler for the Search button.
     */
    _onSearchButtonClick = () => {
        const queries = [...this._submitValues.values()];
        searchSession(queries)
            .then(result => {
                this.setState({ // validation passed so clear errors
                    submitError: { details: [], summary: '' }
                });

                this.setState({ searchResult: result });
            })
            .catch(error => {
                const errorWithDefaults = {
                    response: { data: {} },
                    ...error
                };
                const {summary = '', details = [], sqlQuery = ''} = errorWithDefaults.response.data;
                this.setState({
                    submitError: { summary, details },
                    searchResult: { sqlQuery }
                });
            });
    }

    render() {
        const isRemovable = (this.state.predicateInputGroups.length > 1); // predicate inputs are removable if there are more than one

        return (
            <div className='SearchSessionScreen'>
                <Header>
                    <span className='heading'>SEARCH FOR SESSIONS</span>
                    <Button className='todayButton' primary={true}>Today</Button>
                </Header>
                <hr/>
                <Body>
                    <div>
                        {this.state.predicateInputGroups.map((inputGroup, i) => 
                            <RemovableInputGroup 
                                key={`removable-input-group-${inputGroup.props.id}`}
                                inputGroup={inputGroup} 
                                error={this._getSubmitErrorDetails(i)}
                                removable={isRemovable}
                                onRemove={this._removeButtonClickCallback}
                            />
                        )}
                        <br/>
                        <Button className='andButton' primary={true} onClick={this._addInputGroup}>AND</Button>
                    </div>
                </Body>
                <Footer>
                    <span>
                        {this.state.searchResult.data &&
                            `Returned ${this.state.searchResult.data.length} results`
                        }
                    </span>
                    <span>
                        <InputGroup className='align-right' id='footerButtonGroup'>
                            <Button disabled>Export</Button>
                            <Button className='savePresetButton'>Save Preset</Button>
                            <Button primary={true} className='searchButton' onClick={this._onSearchButtonClick}>Search</Button>
                        </InputGroup>
                        <div className='error align-right'>
                            {this.state.submitError.summary}&nbsp;
                        </div>
                    </span>
                </Footer>
                {
                    this.state.searchResult.sqlQuery &&
                        <div>
                            SQL query:
                            <br/>
                            <textarea className='sqlQueryInput' readOnly value={this.state.searchResult.sqlQuery} />
                        </div>
                }
                <SearchResultTable {...this.state.searchResult} />
            </div>
        );
    }
}
