import {Directory} from "./directory";
import {File} from "./file";
import * as Promise from "bluebird";
import * as _ from "lodash";
import {Datestamp} from "./datestamp";
import {DatestampDir} from "./datestampDir";
import {getDatestamp} from "./photoDatestamp";
import {FileTask} from "./fileTask";


////////////////////////////////////////////////////////////////////////////////
// Types
////////////////////////////////////////////////////////////////////////////////
export interface IDateDirMap {
    [s: string]: Directory;
}


export class PhotoLibrary {


    /**
     * Creates a mapping from date (string) to Directory for the specified photo
     * library directory.
     * @static
     * @param libraryDir - The library directory for which the map is to be
     * generated
     * @returns A mapping from date (string) to Directory objects for the photo
     * library directory
     */
    public static createDateDirMap(libraryDir: Directory): Promise<IDateDirMap> {

        return libraryDir.getSubdirectories()
        .then((subdirs: Directory[]) => {
            // We are only concerned with the subdirectories that have a date in them.
            return _.reduce(
                subdirs,
                (acc: IDateDirMap, curSubdir: Directory) => {
                    const datestamp: Datestamp|null = DatestampDir.test(curSubdir.toString());
                    if (datestamp) {
                        acc[datestamp.toString()] = curSubdir;
                    }
                    return acc;
                },
                {}
            );
        });

    }


    private _rootDir: Directory;
    private _dateDirMapPromise: Promise<IDateDirMap>;


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


    /**
     * Creates a FileTask that can be used to import the specified file into
     * this PhotoLibrary.
     * @method
     * @param fileToImport - The file to import
     * @return {Promise<FileTask>} A Promise for a FileTask that will import the file.
     */
    public importFile(fileToImport: File): Promise<FileTask> {

        const datestampPromise: Promise<Datestamp> =  getDatestamp(fileToImport);

        return Promise.all([datestampPromise, this._dateDirMapPromise])
        .then(([datestamp, dateDirMap]: [Datestamp, IDateDirMap]) => {

            const datestampStr: string = datestamp.toString();
            let destDir: Directory = dateDirMap[datestampStr];

            if (destDir) {
                // A directory already exists for the file.  Use it.
                return Promise.resolve(destDir);
            } else {
                // A directory does not exist for the file being imported.
                // Create it.
                destDir = new Directory(this._rootDir, datestampStr);
                return destDir.ensureExists();
            }
        })
        .then((destDir: Directory) => {
            return new FileTask(fileToImport, destDir);
        });
    }


    /**
     * Creates FileTasks to import all files in the specified directory into
     * this PhotoLibrary.
     * @method
     * @param {Directory} importDirectory - A directory containing the files to
     * be imported.
     * @return {Promise<FileTask[]>} A Promise for an array of FileTask objects.
     *  Each FileTask represents a task to be run in order to import a file.
     */
    public importDirectory(importDirectory: Directory): Promise<FileTask[]> {

        // todo:  Add a parameter to recursively find all files in importDirectory.

        return importDirectory.getFiles()
        .then((filesToImport: File[]) => {

            const promises: Array<Promise<FileTask>> = _.map(filesToImport, (curImportFile) => {
                return this.importFile(curImportFile);
            });

            return Promise.all(promises);
        });
    }
}
