"use strict";
import * as path from "path";
import * as Promise from "bluebird";
import * as fs from "fs-extra";
import {Directory} from "./directory";
import {PathPart, reducePathParts} from "./pathHelpers";

export class File {

    private _filePath: string;
    private _stats: fs.Stats;


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

                // Either fs.stat failed or it is not a file.
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



}


