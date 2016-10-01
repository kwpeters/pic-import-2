export class Directory {

    private _dirPath: string;

    constructor(dirPath: string) {
        this._dirPath = dirPath;
    }

    public toString(): string {
        return this._dirPath;
    }
}
