import * as S from "string";

/**
 * @class
 * @classdesc Represents a date
 */
export class Datestamp {

    ////////////////////////////////////////////////////////////////////////////////
    // Data Members
    ////////////////////////////////////////////////////////////////////////////////
    private _date: Date;


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
