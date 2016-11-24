import {Datestamp} from "./datestamp";


const datestampRegex: RegExp = /(\d{4})[-_](\d{2})[-_](\d{2})/;


export class DatestampDir {


    public static test(path: string): Datestamp {
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
