/**
 * Contains common data for comparators.
 * Comparators data are ultimately used to build UI selectors,
 * allowing user to select the comparator (e.g. starts_with, equals, etc) of a predicate statement.
 * 
 * Given the predicate statement "user_email starts_with 'abc'",
 * "contains" is the comparator.
 */

/**
 * Describes the order and metadata of the number comparator.
 */
const numberComparators = [
    {
        label: 'range',
        value: 'range', // internal value used by server to generate sql query
        numArgs: 2 // 2 for min and max args for range comparator
    },
    {
        label: 'less than or equal',
        value: 'less_than_or_equal',
        numArgs: 1
    },
    {
        label: 'equals',
        value: 'equals',
        numArgs: 1
    },
    {
        label: 'does not equal',
        value: 'does_not_equal',
        numArgs: 1
    },
    {
        label: 'greater than or equal',
        value: 'greater_than_or_equal',
        numArgs: 1
    }
];

/**
 * Describes the order and metadata of the number comparator.
 */
const stringComparators = [
    {
        label: 'starts with',
        value: 'starts_with' // internal value used by server to generate sql query
    },
    {
        label: 'does not start with',
        value: 'does_not_start_with'
    },
    {
        label: 'equals',
        value: 'equals'
    },
    {
        label: 'does not equal',
        value: 'does_not_equal'
    },
    {
        label: 'contains',
        value: 'contains'
    },
    {
        label: 'does not contain',
        value: 'does_not_contain'
    },
    {
        label: 'in list',
        value: 'in_list'
    },
    {
        label: 'not in list',
        value: 'not_in_list'
    },
    {
        label: 'contains all',
        value: 'contains_all'
    }
];

/**
 * Dictionary from number comparator to SQL translator function.
 */
const NumberComparatorTranslator = {
    range: (columnName, ...values) =>
        `${columnName} BETWEEN ${values[0]} AND ${values[1]}`,

    less_than_or_equal: (columnName, value) =>
        `${columnName} <= ${value}`,

    equals: (columnName, value) =>
        `${columnName} = ${value}`,

    does_not_equal: (columnName, value) =>
        `${columnName} != ${value}`,

    greater_than_or_equal: (columnName, value) =>
        `${columnName} >= ${value}`
};

/**
 * Dictionary from string comparator to SQL translator function.
 */
const StringComparatorTranslator = {
    starts_with: (columnName, keyword) => 
        `${columnName} LIKE '${keyword}%'`,

    does_not_start_with: (columnName, keyword) => 
        `${columnName} NOT LIKE '${keyword}%'`,

    equals: (columnName, keyword) => 
        `${columnName} = '${keyword}'`,

    does_not_equal: (columnName, keyword) => 
        `${columnName} != '${keyword}'`,

    contains: (columnName, keyword) => 
        `${columnName} LIKE '%${keyword}%'`,

    does_not_contain: (columnName, keyword) => 
        `${columnName} NOT LIKE '%${keyword}%'`,

    in_list: (columnName, csv) => {
        const quotedCsv = singleQuoteCsv(csv);
        return `${columnName} IN (${quotedCsv})`;
    },

    not_in_list: (columnName, csv) => {
        const quotedCsv = singleQuoteCsv(csv);
        return `${columnName} NOT IN (${quotedCsv})`;
    },

    /**
     * NOTE: this function returns the most compatible SQL string. 
     * If using Oracle SQL, can optimize using REGEXP_LIKE (columnName, 'csv[0] ... | csv[n-1]').
     * If using SQL Server 2005+ with full-text indexing enabled, can optimize using CONTAINS(columnName, '"csv[0]" ...AND "csv[n-1]"')
     */
    contains_all: (columnName, csv) => {
        // single quote + wrap comma-separated values with 'LIKE %value%'
        // e.g. given csv = "foo bar, baz"
        // singleQuoteCsvArr = ["'LIKE %foo bar%'", "'LIKE %baz%'"]
        const singleQuoteCsvArr = csv.split(', ').map(v => `${columnName} LIKE '%${v}%'`);

        // join singleQuoteCsvArr with AND 
        // e.g. given singleQuoteCsvArr = ["'x'", "'y'"]
        // joinedSingleQuoteCsv = "'x' AND 'y'"
        const joinedSingleQuoteCsv = singleQuoteCsvArr.join(' AND ');
        return joinedSingleQuoteCsv;
    }
};

/**
 * Adds single quotes around comma-separated values.
 * Example:
 * singleQuoteCsv("foo bar, baz")
 * returns "'foo bar', 'baz'"
 * @param {string} csv - Comma-separated value.
 * @returns {string}
 */
function singleQuoteCsv(csv) {
    return csv.split(', ') // split by comma + space
        .map(v => `'${v}'`) // surround value with single quote
        .join(', '); // restore csv string format
}

/**
 * Dictionary where keys are comparator types and values are Array.<ComparatorInfo>.
 */
export const ComparatorsByType = {
    string: stringComparators,
    number: numberComparators
};

/**
 * Dictionary where keys are comparator types and values are comparator translator maps.
 * A comparator translator map is a map where map key is a comparator value (e.g. "starts_with") and map value is a function.
 */
export const SqlTranslatorsByType = {
    string: StringComparatorTranslator,
    number: NumberComparatorTranslator
};
