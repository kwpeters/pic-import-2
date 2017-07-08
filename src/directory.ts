import * as path from "path";
import * as Promise from "bluebird";
import * as _ from "lodash";
import * as fs from "fs-extra";
import {reducePathParts, PathPart} from "./pathHelpers";
import {Stats} from "fs";
import {File} from "./file";

// Convert these Node.js functions to return a Promise.
const readdirAsync: (path: string) => Promise<string[]> = Promise.promisify(fs.readdir);
const statAsync: (path: string) => Promise<Stats> = Promise.promisify(fs.stat);


export class Directory {

    private _dirPath: string;

    constructor(pathPart: PathPart, ...pathParts: PathPart[]) {
        const allParts: PathPart[] = [pathPart].concat(pathParts);
        this._dirPath = reducePathParts(allParts);

        // Remove trailing directory seperator characters.
        while (this._dirPath.endsWith(path.sep)) {
            this._dirPath = this._dirPath.slice(0, -1);
        }
    }


    public toString(): string {
        return this._dirPath;
    }


    public get absPath(): string {
        return path.resolve(this._dirPath);
    }


    public equals(other: Directory): boolean {
        return this.absPath === other.absPath;
    }


    public split(): string[] {
        return this._dirPath.split(path.sep);
    }


    public getSubdirectories(): Promise<Directory[]> {

        return readdirAsync(this._dirPath)
        .then((dirEntries: string[]) => {
            // Convert to full paths.
            dirEntries = _.map(
                dirEntries,
                (curDirEntry) => path.join(this._dirPath, curDirEntry)
            );

            // Map each directory entry into a Promise for an object containing the
            // directory entry's name and its stats.
            const promises:  Array<Promise<{dirEntry: string, stats: Stats}>> = _.map(
                dirEntries,
                (curDirEntry) => {
                    return statAsync(curDirEntry)
                    .then((stats: Stats) => {
                        return {dirEntry: curDirEntry, stats: stats};
                    });
                }
            );
            return Promise.all(promises);
        })
        .then((dirEntryInfos: Array<{dirEntry: string, stats: Stats}>) => {
            // Keep only the directory entries that are directories.
            dirEntryInfos = _.filter(dirEntryInfos, (curDirEntryInfo) => {
                return curDirEntryInfo.stats.isDirectory();
            });

            // Return a Directory instance wrappping each subdirectory.
            return _.map(dirEntryInfos, (curDirInfo): Directory => {
                return new Directory(curDirInfo.dirEntry);
            });
        });
    }


    public getSubdirectoriesSync(): Directory[] {
        let dirEntries: string[] = fs.readdirSync(this._dirPath);
        // Convert to full paths.
        dirEntries = _.map(dirEntries, (curDirEntry: string): string => {
            return path.join(this._dirPath, curDirEntry);
        });

        // Map each directory entry to an object containing the directory
        // entry's name and its stats.
        let dirEntryInfos: Array<{dirEntry: string, stats: Stats}> = _.map(
            dirEntries,
            (curDirEntry: string): {dirEntry: string, stats: Stats} => {
                const stats: Stats = fs.statSync(curDirEntry);
                return {
                    dirEntry: curDirEntry,
                    stats: stats
                };
            }
        );

        // Keep only the directory entries that are directories.
        dirEntryInfos = _.filter(dirEntryInfos, (curDirEntryInfo): boolean => {
            return curDirEntryInfo.stats.isDirectory();
        });

        // Return a Directory instance wrapping each subdirectory.
        return _.map(dirEntryInfos, (curDirEntryInfo): Directory => {
            return new Directory(curDirEntryInfo.dirEntry);
        });
    }


    /**
     * Gets an array of files located in this Directory.
     * @method
     * @return {Promise<File[]>} A Promise for an array of File objects.  Each
     * File object is a file in this directory.
     */
    public getFiles(): Promise<File[]> {

        return readdirAsync(this._dirPath)
        .then((dirEntries: string[]) => {
            // Convert to full paths.
            dirEntries = _.map(
                dirEntries,
                (curDirEntry) => path.join(this._dirPath, curDirEntry)
            );

            // Map each directory entry into a Promise for an object containing the
            // directory entry's name and its stats.
            const promises: Array<Promise<{dirEntry: string, stats: Stats}>> = _.map(
                dirEntries,
                (curDirEntry) => {
                    return statAsync(curDirEntry)
                    .then((stats: Stats) => {
                        return {dirEntry: curDirEntry, stats: stats};
                    });
                }
            );
            return Promise.all(promises);
        })
        .then((dirEntryInfos: Array<{dirEntry: string, stats: Stats}>) => {
            // Keep only the directory entries that are files.
            dirEntryInfos = _.filter(dirEntryInfos, (curDirEntryInfo) => {
                return curDirEntryInfo.stats.isFile();
            });

            // Return a File instance wrappping each file.
            return _.map(dirEntryInfos, (curDirInfo): File => {
                return new File(curDirInfo.dirEntry);
            });
        });
    }


    /**
     * Gets an array of files located in this Directory.
     * @method
     * @return {File[]} An array of File objects, each one representing a file
     * in this Directory.
     */
    public getFilesSync(): File[] {
        let dirEntries: string[] = fs.readdirSync(this._dirPath);
        // Convert to full paths.
        dirEntries = _.map(dirEntries, (curDirEntry: string): string => {
            return path.join(this._dirPath, curDirEntry);
        });

        // Map each directory entry to an object containing the directory
        // entry's name and its stats.
        let dirEntryInfos: Array<{dirEntry: string, stats: Stats}> = _.map(
            dirEntries,
            (curDirEntry: string): {dirEntry: string, stats: Stats} => {
                const stats: Stats = fs.statSync(curDirEntry);
                return {
                    dirEntry: curDirEntry,
                    stats: stats
                };
            }
        );

        // Keep only the directory entries that are directories.
        dirEntryInfos = _.filter(dirEntryInfos, (curDirEntryInfo): boolean => {
            return curDirEntryInfo.stats.isFile();
        });

        // Return a Directory instance wrapping each subdirectory.
        return _.map(dirEntryInfos, (curDirEntryInfo): File => {
            return new File(curDirEntryInfo.dirEntry);
        });
    }


    public exists():Promise<fs.Stats|null> {
        return new Promise<fs.Stats|null>((resolve: (result: fs.Stats|null) => void, reject: (err: any) => void) => {
            fs.stat(
                this._dirPath,
                (err: NodeJS.ErrnoException, stats: Stats) => {
                    if (stats && stats.isDirectory()) {
                        resolve(stats);
                        return;
                    }

                    // Either fs.stat() failed or it is not a directory.
                    resolve(null);
                }
            );
        });
    }


    public existsSync(): fs.Stats|null {
        let stats: fs.Stats;

        try {
            stats = fs.statSync(this._dirPath);
        } catch (ex) {
            return null;
        }

        return stats.isDirectory() ? stats : null;
    }


    /**
     * Ensures that this Directory exists.  If it does not, it is created.
     * @method
     * @returns {Promise<Directory>} A Promise that is fulfilled with the
     * resulting Directory once the directory exists.
     */
    public ensureExists(): Promise<Directory> {
        return new Promise<Directory>((resolve: (dir: Directory) => void, reject: (err: Error) => void) => {
            fs.ensureDir(this._dirPath, (err: Error) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(new Directory(this._dirPath));
                }
            });
        });
    }


    /**
     * Ensures that this Directory exists.  If it does not, it is created.
     * @method
     * @returns {Directory} The resulting Directory
     */
    public ensureExistsSync(): Directory {
        fs.ensureDirSync(this._dirPath);
        return new Directory(this._dirPath);
    }


    /**
     * Deletes the contents of this Directory.
     * @method
     * @returns {Promise<void>} A Promise that is fulfilled when this Directory
     * is successfully emptied.  The Promise is rejected if an error occurs.
     */
    public empty(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            fs.emptyDir(this._dirPath, (err: Error) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve();
            });
        });
    }


    /**
     * Deletes the contents of this directory
     * @method
     */
    public emptySync(): void {
        fs.emptyDirSync(this._dirPath);
    }


}
