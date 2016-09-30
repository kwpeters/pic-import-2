"use strict";
import * as path from "path";


export class File {

    private _filePath: string;


    constructor(filePath: string) {
        this._filePath = filePath;
    }


    public toString(): string {
        return this._filePath;
    }


    public absPath(): string {
        return path.resolve(this._filePath);
    }

}


