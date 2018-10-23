import {SqlTranslatorsByType} from './ComparatorData';

/**
 * Contains server utility functions.
 */

/**
 * Gets values from an object array.
 * @param {object[]} objArray - The object array. 
 * @param {Array.<string>} objKeys - The object keys to get values from.
 * @returns {Array.<Array>} The values of each element in the object array.
 * Example:
 * const sqlQueryResults = [
 *   {column1: 'A', column2: 1}, 
 *   {column1: 'B', column2: 2}
 * ];
 * 
 * const sqlColumns = ['column2', 'column1'];
 * 
 * getValuesFromObjectArray(sqlQueryResults, sqlColumns) // example usage with sql query results
 * returns the 2-d array
 * [
 *    [1, 'A'],
 *    [2, 'B']
 * ]
 */
export function getValuesFromObjectArray(objArray = [], objKeys = []) {
    const getObjValues = (obj, keys) => keys.map(k => obj[k]);
    return objArray.map(resultRow => getObjValues(resultRow, objKeys));
}

/**
 * Validates an array of predicate object.
 * @param {Array.<predicate>} predicates - The predicate objects.
 * @param {SqlQueryInputInfo} sqlQueryInputInfo - The object describing the supported fields and comparators.
 * @returns {PredicatesValidationError}
 */
export function validatePredicates(predicates, sqlQueryInputInfo) {
    const error = { details: [], summary: '' };

    if (predicates.length === 0) {
        error.summary = 'No search queries found!';
    } else {
        // build field and comparator maps for efficient lookups
        const fieldMap = buildFieldMap(sqlQueryInputInfo.fields);
        const comparatorTypeMap = {};
        for (let [comparatorType, comparators] of Object.entries(sqlQueryInputInfo.comparators)) {
            comparatorTypeMap[comparatorType] = buildComparatorMap(comparators);
        }

        predicates.forEach((predicate, i) => {
            error.details[i] = validatePredicate(predicate, fieldMap, comparatorTypeMap);
            if (error.details[i].length > 0) { // if validation results in non-empty string
                error.summary = 'Resolve the errors';
            }
        });
    }

    return error;
}

/**
 * Validates a single predicate.
 * @param {Predicate} predicate - The predicate object.
 * @param {object.<string, field>} fieldMap - Map where key is field value and value is field object.
 * @param {object.<string, ComparatorMap>} comparatorTypeMap - Map where key is comparator type (e.g. "number" or "string") and value is a ComparatorMap.
 * @returns {string} Empty string if validation passes; otherwise the error string.
 */
function validatePredicate(predicate, fieldMap, comparatorTypeMap) {
    // check that field and comparator are specified
    if (!predicate.field) {
        return 'Field is required';
    } 
    
    if (!predicate.comparator) {
        return 'Comparator is required';
    } 
    
    // check that field value is supported
    const fieldInfo = fieldMap[predicate.field]; // find field info for the predicate's field
    if (fieldInfo === undefined) {
        return 'Field is unsupported';
    } 

    // check that comparator is supported
    let comparatorInfo;
    const comparatorMap = comparatorTypeMap[fieldInfo.type];
    
    if (comparatorMap !== undefined) { // if have comparators for field type (should always be true unless data.js has bad data)
        comparatorInfo = comparatorMap[predicate.comparator];
    } else {
        return `Internal error: missing data for comparator type "${fieldInfo.type}"!`;
    }

    if (!comparatorInfo) {
        return 'Comparator is invalid';
    }

    // check that correct number of comparator args are specified
    const {comparatorArgs = []} = predicate;
    const {numArgs = 1} = comparatorInfo;

    // if client didn't submit enough args for comparator args
    if (numArgs !== comparatorArgs.length || !comparatorArgs.every(x => typeof x === 'string' && x.length > 0)) {
        return 'Required';
    }

    // check that numeric comparator args are number strings
    if (fieldInfo.type === 'number') {
        const validNumber = comparatorArgs.every(x => !isNaN(x));
        if (!validNumber) {
            return 'Invalid number';
        }

        // if 2 number args, check that min is less than or equal to max
        if (numArgs ) {
            if (parseFloat(comparatorArgs[1]) < parseFloat(comparatorArgs[0])) {
                return 'Maximum value cannot be less than minimum';
            }
        }
    }

    return '';
}

/**
 * Builds the SQL "WHERE clause" given an array of predicate object.
 * Example:
 * Given the SQL statement "SELECT column_names FROM table_name WHERE column_name BETWEEN value1 AND value2;",
 * the "WHERE clause" is "column_name BETWEEN value1 AND value2"
 * @param {Array.<Predicate>} predicates - Array of Predicate object.
 * @param {SqlQueryInputInfo} SqlQueryInputInfo - Object describing supported fields and comparators for SQL query.
 * @returns {string} The SQL WHERE clause, e.g. "WHERE column_name BETWEEN value1 AND value2"
 */
export function buildSqlWhereClause(predicates, SqlQueryInputInfo) {
    const fieldMap = buildFieldMap(SqlQueryInputInfo.fields);
    
    // for each predicate object, translate to SQL predicate
    const sqlPredicates = predicates.map(({field, comparator, comparatorArgs}) => {
        const fieldType = fieldMap[field].type;
        const comparatorTranslator = SqlTranslatorsByType[fieldType][comparator];
        const sqlPredicate = comparatorTranslator(field, ...comparatorArgs); // e.g. sqlComparator = "visits BETWEEN 1 AND 2"
        return sqlPredicate; // e.g. visits BETWEEN 1 AND 2
    }).join(' AND '); // e.g. visits BETWEEN 1 AND 2 AND screen_width >= 800

    const sqlWhere = sqlPredicates.length > 0 ? `WHERE ${sqlPredicates}` : ''; // include WHERE if there is at least one SQL predicate
    return sqlWhere;
}

/**
 * Builds a map where map key is the field value and map value is the FieldInfo object.
 * @param {Array.<FieldInfo>} fields - Array of FieldInfo object.
 * @returns {FieldMap} The map.
 */
function buildFieldMap(fields) {
    // build map of field value to field type
    const fieldMap = {};
    fields.forEach(f => {
        fieldMap[f.value] = f;
    });

    return fieldMap;
}

/**
 * Builds a map where map key is the comparator value and map value is the ComparatorInfo object.
 * @param {Array.<ComparatorInfo>} comparators - Array of ComparatorInfo object.
 * @returns {ComparatorMap>} The map.
 */
function buildComparatorMap(comparators) {
    const comparatorsMap = {};
    comparators.forEach(c => {
        comparatorsMap[c.value] = c;
    });
    return comparatorsMap;
}

/**
 * Object describing a predicate.
 * @typedef {object} Predicate
 * @property {string} field - The field value.
 * @property {string} comparator - The comparator value.
 * @property {Array} comparatorArgs - The array of comparator values.
 * 
 * Example #1:
 * Given client predicate "First name starts with 'Jo'",
 * field = "user_first_name"
 * comparator = "starts_with"
 * comparatorArgs = ["Jo"]
 * 
 * Example #2:
 * Given client predicate "# of visits is range 100 and 999",
 * field = "visits"
 * comparator = "range"
 * comparatorArgs = [100, 999]
 */

/**
 * Object describing a field.
 * @typedef {object} FieldInfo
 * @property {string} label - The UI-friendly display label.
 * @property {string} value - The field value.
 * @property {string} type - The field type, e.g. "number" or "string"
 * @property {Array.<string>} inputHints - UI placeholder strings describing expected input values for the field.
 */

/**
 * Object describing a comparator.
 * @typedef {object} ComparatorInfo
 * @property {string} label - The UI-friendly display label.
 * @property {string} value - The comparator value, e.g. "starts_with".
 * @property {number} numArgs - The number of arguments the comparator requires. 
 * For example, for comparator "range", numArgs is 2 because range requires the min and max input.
 */

/**
 * Map where map key is comparator value and map value is ComparatorInfo object.
 * @typedef {object.<string, ComparatorInfo>} ComparatorMap
 */ 

/**
 * Map where map key is field value and map value is FieldInfo object.
 * @typedef {object.<string, FieldInfo>} FieldMap
 */

/**
 * Object describing the validation error of predicates.
 * @typedef {object} PredicatesValidationError
 * @property {Array.<string>} details
 * Validation error string for each predicate. If predicates[i] passes validation, details[i] is an empty string.
 * @property {string} summary
 * The error summary. A non-empty string if there is at least one validation error.
 */

/**
 * Object describing supported fields and comparators for SQL query.
 * @typedef {object} SqlQueryInputInfo
 * @property {Array.<FieldInfo>} fields - The array of supported fields.
 * @property {object.<string, Array.<ComparatorInfo>} comparators - Map where map key is comparator type (e.g. "number" or "string") and map value is array of ComparatorInfo object.
 */
