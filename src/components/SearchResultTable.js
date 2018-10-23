import React from 'react';
import PropTypes from 'prop-types';

/**
 * Functional component for search result table.
 * @param {Array.<string>} [columnLabels=[]] - Column display names.
 * @param {Array.<string>} [columnTypes=[]] - Describes the type of data shown in column[i]; columnTypes[i] is either "string" or "number".
 * @param {Array.<Arrary} [data=[]] - Table data; data[i] is an array of data for the current table row[i].
 */
const SearchResultTable = ({columnLabels, columnTypes, data}) => {
    const uniqueNum = new Date().getTime();

    const getColumns = (rowData, rowKey) =>
        rowData.map((colData, colIdx) => {
            const colType = columnTypes[colIdx] || 'string';
            return (
                <td key={`${rowKey}-${colIdx}`} className={colType}>
                    {colData}
                </td>
            );
        });

    return (
        <table className='SearchResultTable'>
            <thead>
                <tr>
                    {columnLabels.map((label, i) => 
                        <th key={label} className={columnTypes[i]}>{label}</th>)}
                </tr>
            </thead>
            <tbody>
                {data.map((rowData, rowIdx) => {
                    const rowKey = `${uniqueNum}-${rowIdx}`;
                    return (
                        <tr key={rowKey}>
                            {getColumns(rowData, rowKey)}
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};

SearchResultTable.defaultProps = {
    columnLabels: [],
    columnTypes: [],
    data: []
};

SearchResultTable.propTypes = {
    columnLabels: PropTypes.arrayOf(PropTypes.string),
    columnTypes: PropTypes.arrayOf(PropTypes.string),
    data: PropTypes.arrayOf(PropTypes.array)
};

export default SearchResultTable;
