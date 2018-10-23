/**
 * These functions are called by SearchSessionScreen.js to make server calls.
 */

import axios from 'axios';

/**
 * Gets input metadata for session fields and comparators.
 * Client will use these input metadata to build the field and comparator selectors.
 */
export const getSearchSessionInputInfo = () =>
    axios.get('api/session/inputInfo')
        .then(resp => resp.data); // resp.data is an object {fields: Array, comparators: {string: Array, number: Array}}

/**
 * Searches session using specified queries.
 * @param {object[]} queries - Object array of queries.
 * @returns {Promise}
 */
export const searchSession = (queries) =>
    axios.post('api/session/search', {data: queries})
        .then(resp => resp.data);
        