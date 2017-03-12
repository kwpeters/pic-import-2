import {File} from "./file";
import {Directory} from "./directory";
import * as Promise from "bluebird";

export enum FileOperation {
    copy,
    move
}

export class FileTask {

    private _srcFile:   File;
    private _dst:       File|Directory;
    private _operation: FileOperation;

    constructor(srcFile: File, dst: File|Directory, operation: FileOperation = FileOperation.copy) {
        this._srcFile   = srcFile;
        this._dst       = dst;
        this._operation = operation;
    }

    public get operation(): FileOperation {
        return this._operation;
    }

    public get srcFile(): File {
        return this._srcFile;
    }

    public get dstFile(): File {
        // If the destination was specified as a File, use it.
        if (this._dst instanceof File) {
            return this._dst;
        }

        // The destination was specified as a Directory.  Build the full file
        // path by reusing the file name from the source.
        return new File(this._dst, this._srcFile.fileName);
    }

    public execute(): Promise<File> {
        if (this._operation === FileOperation.copy) {
            return this._srcFile.copy(this.dstFile);
        } else {
            return this._srcFile.move(this.dstFile);
        }
    }
}
