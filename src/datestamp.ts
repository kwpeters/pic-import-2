import * as S from "string";


const dateRegex: RegExp = /(\d{4})[._-](\d{2})[-_.](\d{2})/;


/**
 * @class
 * @classdesc Represents a date
 */
export class Datestamp {


    /**
     * Creates a Datestamp from a sensible year, month and day
     * @static
     * @param {number} year - The year number
     * @param {number} month - The month number (1 - 12)
     * @param {number} day - The day of the month (1 - 31)
     * @returns {Datestamp} ReturnDescription
     */
    public static fromYMD(year: number, month: number, day: number): Datestamp {
        return new Datestamp(new Date(
            year,
            month - 1, // convert from 1-based to 0-based
            day));
    }


    /**
     * Creates a Datestamp from a string that contains an appropriate pattern.
     * @static
     * @param str - A string containing a datestamp pattern
     * @returns {Datestamp|null} The datestamp found.  null if a datestamp was
     * not found.
     */
    public static fromString(str: string): Datestamp|null {
        const matches: RegExpExecArray|null = dateRegex.exec(str);
        if (matches) {
            const year: number  = parseInt(matches[1], 10);
            const month: number = parseInt(matches[2], 10) - 1; // Make it 0-based
            const day: number   = parseInt(matches[3], 10);

            return Datestamp.fromYMD(year, month, day);
        }

        return null;
    }


    ////////////////////////////////////////////////////////////////////////////////
    // Data Members
    ////////////////////////////////////////////////////////////////////////////////
    private _date: Date;


    /**
     * Constructs a new Datestamp.
     *
     * @class
     * @classdesc classDesc
     *
     * @param {Date} date - The date corresponding to this Datestamp
     */
    constructor(date: Date) {
        this._date = date;
    }


    /**
     * Converts this Datestamp to a string
     * @method
     * @returns {string} The string representation of this Datestamp
     */
    public toString(): string {
        return this._date.getFullYear()                        + "-" +
                S(this._date.getMonth() + 1).padLeft(2, "0").s + "-" +
                S(this._date.getDate()).padLeft(2, "0").s;
    }

}
