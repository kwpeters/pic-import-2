const dateRegex: RegExp = /(\d{4})[._-](\d{2})[-_.](\d{2})/;


// todo: This should just be in a string helpers library.


/**
 * Gets the date from a string
 * @param {string} str - The string to search
 * @returns {Date} The Date that was found in the string or undefined if no Date was found.
 */
export function getDate(str: string): Date {
    "use strict";

    const matches: RegExpExecArray = dateRegex.exec(str);
    if (matches) {
        const year: number  = parseInt(matches[1], 10);
        const month: number = parseInt(matches[2], 10) - 1; // Make it 0-based
        const day: number   = parseInt(matches[3], 10);

        return new Date(year, month, day);
    }

    return undefined;
}
