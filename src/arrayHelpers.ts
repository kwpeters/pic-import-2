/**
 * Tests the strings in arr and return the first non-null match.
 * @param {string[]} arr - The array of strings to search
 * @param {RegExp} regex - The pattern to search for
 * @returns {RegExp} The first match found.  undefined if no match was found.
 */
export function anyMatchRegex(arr: string[], regex: RegExp): RegExpExecArray {
    "use strict";

    for (let itemIndex: number = 0; itemIndex < arr.length; ++itemIndex) {
        const curMatch: RegExpExecArray = regex.exec(arr[itemIndex]);
        if (curMatch) {
            return curMatch;
        }
    }

    return undefined;
}
