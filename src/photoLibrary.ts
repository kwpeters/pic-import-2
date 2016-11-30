import {Directory} from "./directory";
import * as Promise from "bluebird";
import * as _ from "lodash";
import {Datestamp} from "./datestamp";
import {DatestampDir} from "./datestampDir";


////////////////////////////////////////////////////////////////////////////////
// Types
////////////////////////////////////////////////////////////////////////////////
export type DateDirMap = {[s: string]: Directory};


export class PhotoLibrary {

    private _rootDir: Directory;
    private _dateDirMapPromise: Promise<DateDirMap>;


    /**
     * Creates a mapping from date (string) to Directory for the specified photo
     * library directory.
     * @static
     * @param libraryDir - The library directory for which the map is to be
     * generated
     * @returns A mapping from date (string) to Directory objects for the photo
     * library directory
     */
    public static createDateDirMap(libraryDir: Directory): Promise<DateDirMap> {

        return libraryDir.getSubdirectories()
        .then((subdirs: Directory[]) => {
            // We are only concerned with the subdirectories that have a date in them.
            return _.reduce(
                subdirs,
                (acc: DateDirMap, curSubdir: Directory) => {
                    const datestamp: Datestamp = DatestampDir.test(curSubdir.toString());
                    if (datestamp) {
                        acc[datestamp.toString()] = curSubdir;
                    }
                    return acc;
                },
                {}
            );
        });

    }


    /**
     * Constructs a new PhotoLibrary.
     * @param rootDir - The root directory of the photo library
     */
    constructor(rootDir: Directory) {

        if (!rootDir.existsSync()) {
            throw new Error(`Directory does not exist: ${rootDir.toString()}`);
        }

        this._rootDir = rootDir;
        this._dateDirMapPromise = PhotoLibrary.createDateDirMap(rootDir);

    }


}
