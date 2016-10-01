import * as tape from "tape";
import * as pathHelpers from "./pathHelpers";
import {Directory} from "./directory";

tape("reducePathParts()",
    function (t: tape.Test): void {

        t.test("should join the path parts",
            function (t: tape.Test): void {
        
                const resultPath: string = pathHelpers.reducePathParts(["foo", "bar", "baz.txt"]);
                t.equal(resultPath, "foo/bar/baz.txt");
                t.end();
        
            }
        );


        t.test("should discard items preceding any Directory object",
            function (t: tape.Test): void {
                const result: string = pathHelpers.reducePathParts([
                    "foo",
                    new Directory("bar"),
                    "baz.txt"]);
                t.equal(result, "bar/baz.txt");
                t.end();
            }
        );


    }
);
