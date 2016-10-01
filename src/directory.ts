import * as path from "path";
import * as fs from "fs-extra";
import {reducePathParts, PathPart} from "./pathHelpers";

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
