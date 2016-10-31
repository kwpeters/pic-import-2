import * as path from "path";
import * as Promise from "bluebird";
import * as _ from "lodash";
import * as fs from "fs-extra";
import {reducePathParts, PathPart} from "./pathHelpers";
import {Stats} from "fs";

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
    };


    public equals(other: Directory): boolean {
        return this.absPath === other.absPath;
    };


    public split(): string[] {
        return this._dirPath.split(path.sep);
    }


    public getSubdirectories(): Promise<Directory[]> {
        // Convert these Node.js functions to return a Promise.
        const readdir: (path: string) => Promise<string[]> = Promise.promisify(fs.readdir);
        const stat: (path: string) => Promise<Stats> = Promise.promisify(fs.stat);


        return readdir(this._dirPath)
            .then((dirEntries: string[]) => {
                // Convert to full paths.
                dirEntries = _.map(
                    dirEntries,
                    (curDirEntry) => { return path.join(this._dirPath, curDirEntry); }
                );

                // Map each directory entry into a Promise for an object containing the
                // directory entry's name and its stats.
                const promises: Promise<{dirEntry: string, stats: Stats}>[] = _.map(
                    dirEntries,
                    (curDirEntry) => {
                        return stat(curDirEntry)
                            .then((stats: Stats) => {
                                return {dirEntry: curDirEntry, stats: stats};
                            });
                    }
                );
                return Promise.all(promises);
            })
            .then((dirEntryInfos: {dirEntry: string, stats: Stats}[]) => {
                // Keep only the directory entries that are directories.
                dirEntryInfos = _.filter(dirEntryInfos, (curDirEntryInfo) => {
                    return curDirEntryInfo.stats.isDirectory();
                });

                // Return a Directory instance wrappping each subdirectory.
                return _.map(dirEntryInfos, (curDirInfo) => {
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
        let dirEntryInfos: {dirEntry: string, stats: Stats}[] = _.map(
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


    ////////////////////////////////////////////////////////////////////////////////
    // Omitted for now...
    ////////////////////////////////////////////////////////////////////////////////


    /**
     * Deletes the contents of this directory
     * @method
     */
    public emptySync(): void {
        fs.emptyDirSync(this._dirPath);
    };


}
