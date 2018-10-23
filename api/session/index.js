import express from 'express';
import bodyParser from 'body-parser';
import mysql from 'mysql';

import {
    SqlInfo,
    SqlQueryInputInfo,
    SqlQueryResultInfo
} from './data';

import {getValuesFromObjectArray, validatePredicates, buildSqlWhereClause} from '../utils';

const dbConnection = mysql.createConnection(SqlInfo.connection);

const router = express.Router();
router.use(bodyParser.json()); // needed to support JSON-encoded body for POST

/**
 * Returns fields and comparators metadata for session search.
 * Absolute route: /api/session/inputInfo
 */
router.get('/inputInfo', (req, res) => {
    res.json(SqlQueryInputInfo);
});

/**
 * Returns result of session search.
 * Absolute route: /api/session/search
 */
router.post('/search', (req, res) => {
    const predicates = req.body.data || [];
    const error = validatePredicates(predicates, SqlQueryInputInfo);

    if (error.summary) { // error.summary is non-empty if there is an error
        res.status(422).json(error); // 422 means Unprocessessable Entity
        return;
    }

    const sqlSelect = `SELECT ${SqlQueryResultInfo.columns.join(',')}`;
    const sqlFrom = `FROM ${SqlInfo.tableName}`;
    const sqlWhere = buildSqlWhereClause(predicates, SqlQueryInputInfo);
    const sqlQuery = [sqlSelect, sqlFrom, sqlWhere].join(' ');

    console.log(`SQL query:\n${sqlQuery}`); // eslint-disable-line no-console

    dbConnection.query(sqlQuery, (error, results) => {
        const {columns, columnLabels, columnTypes} = SqlQueryResultInfo;
        if (error) {
            res.status(500).json({
                // TODO: 
                // error.sqlMessage is for debugging only and might expose sensitive database information!
                // Replace with more user-friendly error for production.
                // Example error.sqlMessage: "Access denied for user 'quantummetric'@'localhost' to database 'quantum_metric'"
                // which means user "quantummetric" does not have privilege to the database "quantum_metric".
                summary: error.sqlMessage,
                details: [],
                columnLabels,
                columnTypes,
                data: [],
                sqlQuery
            });
        } else {
            const data = getValuesFromObjectArray(results, columns); 
            res.json({
                columnLabels,
                columnTypes,
                data: data,
                sqlQuery
            });
        }

        res.end();
    });
});

export default router;
