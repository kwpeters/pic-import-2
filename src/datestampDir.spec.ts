import * as tape from "tape";
import {DatestampDir} from "./datestampDir";
import {Datestamp} from "./datestamp";


tape("DatestampDir", function (t: tape.Test): void {

    t.test("static", function (t: tape.Test): void {


        t.test("test()", function (t: tape.Test): void {


            t.test("will return null when given a path with no datestamp",
                function (t: tape.Test): void {
                    const datestamp: Datestamp|null = DatestampDir.test("./foo/bar/baz");
                    t.equal(datestamp, null);
                    t.end();
                }
            );


            t.test("will return the datestamp string when given a path that has one",
                function (t: tape.Test): void {
                    const datestamp: Datestamp|null = DatestampDir.test("./foo/2016-01-02/");
                    if (datestamp) {
                        t.equal(datestamp.toString(), "2016-01-02");
                        t.end();
                    } else {
                        t.fail("Expected a Datestamp object");
                    }
                }
            );


            t.test("will return the datestamp string when the path uses a different delimiter",
                function (t: tape.Test): void {
                    const datestamp: Datestamp|null = DatestampDir.test("./foo/2016_01_02/");
                    if (datestamp) {
                        t.equal(datestamp.toString(), "2016-01-02");
                        t.end();
                    } else {
                        t.fail("Expected a Datestamp object");
                    }
                }
            );


            t.test("will return the datestamp string when there is additional text",
                function (t: tape.Test): void {
                    const datestamp: Datestamp|null = DatestampDir.test("./foo/2016-01-02-some event");
                    if (datestamp) {
                        t.equal(datestamp.toString(), "2016-01-02");
                        t.end();
                    } else {
                        t.fail("Expected a Datestamp object");
                    }
                }
            );


        });


    });

});
