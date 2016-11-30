import * as tape from "tape";
import {getDate} from "./filenameReader";


tape("filenameReader", function (t: tape.Test): void {


    t.test("getDate",
        function (t: tape.Test): void {


            t.test("will extract the date when it is present at the beginning", function (t: tape.Test): void {
                const date: Date = getDate("./foo/2015-12-30blah.jpg");
                t.equal((date as Date).getTime(), new Date(2015, 11, 30).getTime());
                t.end();
            });


            t.test("will extract the date when it is present in the middle", function (t: tape.Test): void {
                const date: Date = getDate("./foo/bar2015-12-30baz.jpg");
                t.equal((date as Date).getTime(), new Date(2015, 11, 30).getTime());
                t.end();
            });


            t.test("will extract the date when it is present at the end", function (t: tape.Test): void {
                const date: Date = getDate("./foo/bar2015-12-30.jpg");
                t.equal((date as Date).getTime(), new Date(2015, 11, 30).getTime());
                t.end();
            });


            t.test("will extract the date when it is delimited with .", function (t: tape.Test): void {
                const date: Date = getDate("./foo/bar2015.12.30.jpg");
                t.equal((date as Date).getTime(), new Date(2015, 11, 30).getTime());
                t.end();
            });


            t.test("will extract the date when it is delimited with _", function (t: tape.Test): void {
                const date: Date = getDate("./foo/bar2015_12_30.jpg");
                t.equal((date as Date).getTime(), new Date(2015, 11, 30).getTime());
                t.end();
            });


            t.test("will return false when a date is not present", function (t: tape.Test): void {
                const date: Date = getDate("./foo/bar-baz.jpg");
                t.equal(date, undefined);
                t.end();
            });


        }
    );
});
