import * as tape from "tape";
import {anyMatchRegex} from "./arrayHelpers";


tape("anyMatchRegex()", function (t: tape.Test): void {


    t.test("will return the a truthy match object when there is a match",
        function (t: tape.Test): void {
            const strings: string[] = ["abc", "a-b-c"];
            const match: RegExpExecArray|null = anyMatchRegex(strings, /a.b.c/);
            t.true(match);
            t.equal((match as RegExpExecArray)[0], "a-b-c");
            t.end();
        }
    );


    t.test("will return false when there is no match",
        function (t: tape.Test): void {
            const strings: string[] = ["abc", "a-b-c"];
            const match: RegExpExecArray|null = anyMatchRegex(strings, /a_b_c/);
            t.equal(match, null);
            t.end();
        }
    );


});

