import {ComparatorsByType} from '../ComparatorData';

/**
 * Describes the SQL table name and connection.
 * @public
 */
const SqlInfo = {
    tableName: 'session',
    connection: {
        host: 'localhost',
        user: 'quantummetric',
        password: 'challenge',
        database: 'quantum_metric'
    }
};

/**
 * SQL column name constants - code should reference these constants instead of hardcoding strings to prevent typos.
 */
const ColumnName = {
    id: 'id',
    user_first_name: 'user_first_name',
    user_last_name: 'user_last_name', 
    user_email: 'user_email', 
    domain: 'domain', 
    path: 'path',
    visits: 'visits',
    screen_width: 'screen_width',
    screen_height: 'screen_height',
    page_response: 'page_response'
};

/** 
 * Dictionary of column comparator type.
 */ 
const ColumnType = {
    [ColumnName.id]: 'string', 
    [ColumnName.user_first_name]: 'string',
    [ColumnName.user_last_name]: 'string',
    [ColumnName.user_email]: 'string',
    [ColumnName.domain]: 'string',
    [ColumnName.path]: 'string',
    [ColumnName.visits]: 'number',
    [ColumnName.screen_width]: 'number',
    [ColumnName.screen_height]: 'number',
    [ColumnName.page_response]: 'number'
};

/** 
 * Dictionary of UI-friendly column labels.
 */ 
const ColumnLabel = {
    [ColumnName.id]: 'Id', 
    [ColumnName.user_first_name]: 'First name',
    [ColumnName.user_last_name]: 'Last name',
    [ColumnName.user_email]: 'User email',
    [ColumnName.domain]: 'Domain',
    [ColumnName.path]: 'Page path',
    [ColumnName.visits]: '# of visits',
    [ColumnName.screen_width]: 'Screen width',
    [ColumnName.screen_height]: 'Screen height',
    [ColumnName.page_response]: 'Page response time (ms)'
};

/**
 * Describes the order and metadata of the field selector.
 */
const fields = [
    {
        label: ColumnLabel.user_email,
        value: ColumnName.user_email, // could have hardcoded "user_email" here but referencing constant is better to prevent typo
        type: ColumnType.user_email,
        inputHints: ['Enter email...']
    },
    {
        label: ColumnLabel.screen_width,
        value: ColumnName.screen_width,
        type: ColumnType.screen_width
    },
    {
        label: ColumnLabel.screen_height,
        value: ColumnName.screen_height,
        type: ColumnType.screen_height
    },
    {
        label: ColumnLabel.visits,
        value: ColumnName.visits,
        type: ColumnType.visits
    },
    {
        label: ColumnLabel.user_first_name,
        value: ColumnName.user_first_name,
        type: ColumnType.user_first_name
    },
    {
        label: ColumnLabel.user_last_name,
        value: ColumnName.user_last_name,
        type: ColumnType.user_last_name,
    },
    {
        label: ColumnLabel.page_response,
        value: ColumnName.page_response,
        type: ColumnType.page_response,
    },
    {
        label: ColumnLabel.domain,
        value: ColumnName.domain,
        type: ColumnType.domain,
    },
    {
        label: ColumnLabel.path,
        value: ColumnName.path,
        type: ColumnType.path
    }
];

/**
 * Describes supported fields and comparators for SQL query.
 * @typedef {object} SqlQueryInputInfo
 * @public
 */
const SqlQueryInputInfo = {
    fields: fields,
    comparators: ComparatorsByType
};

/**
 * Describes the column names, labels, and data type to display for the SQL query results.
 * @public
 */
const SqlQueryResultInfo = {
    columns: [ // column names for the search result
        ColumnName.id, // TODO: check if we want to show the id column in the search results; if not, remove this line
        ColumnName.user_first_name, // TODO: verify that these are the desired column order
        ColumnName.user_last_name,
        ColumnName.user_email,
        ColumnName.domain,
        ColumnName.path,
        ColumnName.visits,
        ColumnName.screen_width,
        ColumnName.screen_height,
        ColumnName.page_response
    ],
    get columnLabels() { 
        return this.columns.map(colName => ColumnLabel[colName]);
    },
    get columnTypes() { 
        return this.columns.map(colName => ColumnType[colName]);
    }
};

export {SqlInfo, SqlQueryInputInfo, SqlQueryResultInfo};
