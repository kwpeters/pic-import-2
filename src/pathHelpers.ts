import * as _ from "lodash";
import * as path from "path";
import {Directory} from "./directory";


export type PathPart = Directory | string;


export function reducePathParts(pathParts: PathPart[]): string {
    "use strict";

    return _.reduce(
        pathParts,
        (accum: string, curPathPart: PathPart): string => {
            if (curPathPart instanceof Directory) {
                return curPathPart.toString();
            }
            return path.join(accum, curPathPart.toString());
        },
        ""
    );

}
