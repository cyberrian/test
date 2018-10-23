/**
 * Contains UI utility functions.
 */

/**
 * Concatenates two groups of css class names.
 * @param {string} a - First class name group to concat.
 * @param {string} b - Second class name group to concat.
 * Example:
 * joinClassNames('a b', 'c') => returns 'a b c'
 * 
 */
export function joinClassNames(a = '', b = '') {
    return a.trim() + ' ' + b.trim();
}
