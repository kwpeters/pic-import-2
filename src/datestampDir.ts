import {Datestamp} from "./datestamp";


const datestampRegex: RegExp = /(\d{4})[-_](\d{2})[-_](\d{2})/;


export class DatestampDir {


    /**
     * Creates a corresponding Datestamp object if the specified path matches
     * the pattern of a timestamped directory.
     * @static
     * @param {string} path - The path to test
     * @returns {Datestamp | null} The corresponding Datestamp if the path is a
     * timestamped directory.  null otherwise.
     */
    public static test(path: string): Datestamp | null {
        const match: RegExpExecArray | null = datestampRegex.exec(path);

        if (!match) {
            return null;
        }

        const year: number  = parseInt(match[1], 10);
        const month: number = parseInt(match[2], 10);
        const day: number   = parseInt(match[3], 10);

        return Datestamp.fromYMD(year, month, day);
    }


}
