"use strict";
import * as path from "path";
import * as Promise from "bluebird";
import * as fs from "fs-extra";
import {Directory} from "./directory";
import {PathPart, reducePathParts} from "./pathHelpers";

export class File {

    private _filePath: string;


    constructor(pathPart: PathPart, ...pathParts: PathPart[]) {
        const allParts: PathPart[] = [pathPart].concat(pathParts);
        this._filePath = reducePathParts(allParts);
    }


    public toString(): string {
        return this._filePath;
    }


    public equals(other: File): boolean {
        return this.absPath === other.absPath;
    }


    public get absPath(): string {
        return path.resolve(this._filePath);
    }


    public get dirName(): string {
        return path.dirname(this._filePath) + path.sep;
    }


    public get baseName(): string {
        const extName: string = path.extname(this._filePath);
        return path.basename(this._filePath, extName);
    }


    public get fileName(): string {
        return path.basename(this._filePath);
    }


    public get extName(): string {
        return path.extname(this._filePath);
    }


    public get directory(): Directory {
        const dirName: string = path.dirname(this._filePath);
        return new Directory(dirName);
    }


    /**
     * Checks to see if this file exists.
     * @returns {Promise<fs.Stats>} A Promise that is fulfilled with the file's stats if it exists.
     * It is resolved with undefined otherwise.
     */
    public exists(): Promise<fs.Stats> {

        return new Promise<fs.Stats>((resolve: (result: fs.Stats) => void, reject: (err: any) => void) => {

            fs.stat(this._filePath, (err: NodeJS.ErrnoException, stats: fs.Stats) => {

                if (!err && stats.isFile()) {
                    resolve(stats);
                    return;
                }

                // Either fs.stat() failed or it is not a file.
                resolve(undefined);
            });
        });
    }


    /**
     * Checks to see if this file exists.
     * @returns {fs.Stats}  If the file exists, its fs.Stats object is returned.
     *  If the file does not exist, undefined is returned.
     */
    public existsSync(): fs.Stats {
        let stats: fs.Stats;

        try {
            stats = fs.statSync(this._filePath);
        } catch (ex) {
            return undefined;
        }

        return stats.isFile() ? stats : undefined;
    }


    public stats(): Promise<fs.Stats> {
        return this.exists();
    }


    public statsSync(): fs.Stats {
        return this.existsSync();
    }


    public copy(destDirOrFile: Directory | File, destFileName?: string): Promise<File> {
        return new Promise<File>((resolve: (result: File) => void, reject: (err: any) => void) => {
            let destFile: File;

            if (destDirOrFile instanceof File) {
                // The caller has specified the destination directory and file
                // name in the form of a File.
                destFile = destDirOrFile;
            } else if (destDirOrFile instanceof Directory) {
                // The caller has specified the destination directory and
                // optionally a new file name.
                if (destFileName === undefined) {
                    destFile = new File(destDirOrFile.toString(), this.fileName);
                } else {
                    destFile = new File(destDirOrFile.toString(), destFileName);
                }
            }

            fs.copy(this._filePath, destFile.toString(), (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(destFile);
            });

        });
    }


    public copySync(destDirOrFile: Directory | File, destFileName?: string): File {

        let destFile: File;

        if (destDirOrFile instanceof File) {
            // The caller has specified the destination directory and file name
            // in the form of a File.
            destFile = destDirOrFile;
        } else if (destDirOrFile instanceof Directory) {
            // The caller has specified the destination directory and optionally
            // a new file name.
            if (destFileName === undefined) {
                destFile = new File(destDirOrFile.toString(), this.fileName);
            } else {
                destFile = new File(destDirOrFile.toString(), destFileName);
            }
        }

        fs.copySync(this._filePath, destFile.toString());
        return destFile;
    }


    /**
     * Moves this file to the specified destination.
     * @method
     * @param {Directory|File} destDirOrFile - The destination directory or file name
     * @param {string} [destFilename] - If destDirOrFile is a Directory, this optional
     * parameter can specify the name of the destination file.  If not specified, the
     * file name of this file is used.
     * @returns {Promise} A promise that is resolved with the destination File object
     * if successful.  This promise is rejected if an error occurred.
     */
    public  move(destDirOrFile: Directory | File, destFileName?: string): Promise<File> {
        return new Promise<File>((resolve: (result: File) => void, reject: (err: any) => void) => {
            let destFile: File;

            if (destDirOrFile instanceof File) {
                // The caller has specified the destination directory and file
                // name in the form of a File.
                destFile = destDirOrFile;
            } else if (destDirOrFile instanceof Directory) {
                // The caller has specified the destination directory and
                // optionally a new file name.
                if (destFileName === undefined) {
                    destFile = new File(destDirOrFile.toString(), this.fileName);
                } else {
                    destFile = new File(destDirOrFile.toString(), destFileName);
                }
            }

            fs.move(this._filePath, destFile.toString(), {clobber: true}, (err: any) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(destFile);
            });

        });
    }


    /**
     * Moves this file to the specified destination.
     * @method
     * @param {Directory|File} destDirOrFile - The destination directory or file name
     * @param {string} [destFilename] - If destDirOrFile is a Directory, this optional
     * parameter can specify the name of the destination file.  If not specified, the
     * file name of this file is used.
     * @returns {File} A File object representing the destination file
     */
    public moveSync(destDirOrFile: Directory | File, destFileName?: string): File {
        //var srcFileParts = this.split(),
        let destFile: File;

        if (destDirOrFile instanceof File) {
            // The caller has specified the destination directory and file name in the
            // form of a File.
            destFile = destDirOrFile;
        } else if (destDirOrFile instanceof Directory) {
            // The caller has specified the destination directory and optionally a new
            // file name.

            if (destFileName === undefined) {
                destFile = new File(destDirOrFile.toString(), this.fileName);
            } else {
                destFile = new File(destDirOrFile.toString(), destFileName);
            }
        }

        // There is no easy way to move a file using fs.  fs.renameSync() will not
        // work when crossing partitions or using a virtual filesystem that does not
        // support moving files.  As a fallback, we will copy the file and then delete
        // this file.
        this.copySync(destFile);
        fs.unlinkSync(this._filePath);
        return destFile;
    }


    public write(text: string): Promise<undefined> {
        return new Promise<undefined>((resolve: (result: undefined) => void, reject: (err: any) => void) => {

            fs.outputFile(this._filePath, text, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(undefined);
            });
        });
    }


    public writeSync(text: string): void {
        fs.outputFileSync(this._filePath, text);
    };


    public read(): Promise<string> {
        return new Promise<string>((resolve: (result: string) => void, reject: (err: any) => void) => {

            fs.readFile(this._filePath, {encoding: "utf8"}, (err, text) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(text);
            });
        });
    }


    public readSync(): string {
        return fs.readFileSync(this._filePath, {encoding: "utf8"});
    }

}


