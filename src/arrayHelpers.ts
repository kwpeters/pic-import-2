/**
 * Tests the strings in strings and return the first non-null match.
 * @param {string[]} strings - The array of strings to search
 * @param {RegExp} regex - The pattern to search for
 * @returns {RegExp|null} The first match found.  null if no match was found.
 */
export function anyMatchRegex(strings: string[], regex: RegExp): RegExpExecArray|null {
    "use strict";

    for (const curString of strings) {
        const curMatch: RegExpExecArray|null = regex.exec(curString);
        if (curMatch) {
            return curMatch;
        }
    }

    return null;
}
