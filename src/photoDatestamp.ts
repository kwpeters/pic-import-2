import * as Promise from "bluebird";
import * as _ from "lodash";
import {File} from "./file";
import {Datestamp} from "./datestamp";
import {getCreateDate} from "./exifReader";
import * as fs from "fs";


export function getDatestamp(file: File): Promise<Datestamp> {
    "use strict";

    return getDatestampExif(file)
    .catch(() => {
        return getDatestampFilename(file);
    })
    .catch(() => {
        return getDatestampStats(file);
    });
}


export function getDatestampExif(file: File): Promise<Datestamp> {
    "use strict";

    return getCreateDate(file.toString());
}


export function getDatestampFilename(file: File): Promise<Datestamp> {
    "use strict";

    const timestampRegex: RegExp = /^.*(\d{4})[-_](\d{2})[-_](\d{2})\D?.*?[.](.*)/;
    const match: RegExpExecArray|null = timestampRegex.exec(file.fileName);
    if (match) {
        const ds: Datestamp = Datestamp.fromYMD(
            parseInt(match[1], 10),
            parseInt(match[2], 10),
            parseInt(match[3], 10));
        return Promise.resolve(ds);
    } else {
        return Promise.reject(new Error(`The file ${file.toString()} does not contain a datestamp.`));
    }
}


export function getDatestampStats(file: File): Promise<Datestamp> {
    "use strict";

    return new Promise<Datestamp>((resolve: (result: Datestamp) => void, reject: (err: any) => void) => {
        fs.stat(file.absPath, (err: NodeJS.ErrnoException, stats: fs.Stats) => {
            if (err) {
                reject(err);
                return;
            }

            const consideredTimeValues: number[] = [];
            consideredTimeValues.push(stats.atime.valueOf());
            consideredTimeValues.push(stats.mtime.valueOf());
            consideredTimeValues.push(stats.ctime.valueOf());

            // According to the Node.js documentation, birthtime may be set to
            // the unix epoch time 0 on filesystems where birthtime is not
            // available.  If this has been done, then don't consider the
            // birthtime field.
            if (stats.birthtime.valueOf()) {
                consideredTimeValues.push(stats.birthtime.valueOf());
            }

            const oldestTime: number = _.min(consideredTimeValues);
            resolve(new Datestamp(new Date(oldestTime)));
        });
    });
}
