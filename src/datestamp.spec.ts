import * as tape from "tape";
import {Datestamp} from "./datestamp";


tape("Datestamp", function (t: tape.Test): void {

    t.test("static",
        function (t: tape.Test): void {

            t.test("fromYMD()",
                function (t: tape.Test): void {

                    t.test("will convert from a year, month and day to a Datestamp",
                        function (t: tape.Test): void {
                            const datestamp: Datestamp = Datestamp.fromYMD(2016, 1, 22);
                            t.equal(datestamp.toString(), "2016-01-22");
                            t.end();
                        }
                    );
                }
            );


            t.test("fromString()",
                function (t: tape.Test): void {


                    t.test("will extract the date when it is present at the beginning", function (t: tape.Test): void {
                        const ds: Datestamp|null = Datestamp.fromString("./foo/2015-12-30blah.jpg");
                        if (ds) {
                            t.equal(ds.toString(), "2015-11-30");
                            t.end();
                        } else {
                            t.fail("Expected a Datestamp object");
                        }
                    });


                    t.test("will extract the date when it is present in the middle", function (t: tape.Test): void {
                        const ds: Datestamp|null = Datestamp.fromString("./foo/bar2015-12-30baz.jpg");
                        if (ds) {
                            t.equal(ds.toString(), "2015-11-30");
                            t.end();
                        } else {
                            t.fail("Expected a Datestamp object");
                        }
                    });


                    t.test("will extract the date when it is present at the end", function (t: tape.Test): void {
                        const ds: Datestamp|null = Datestamp.fromString("./foo/bar2015-12-30.jpg");
                        if (ds) {
                            t.equal(ds.toString(), "2015-11-30");
                            t.end();
                        } else {
                            t.fail("Expected a Datestamp object");
                        }
                    });


                    t.test("will extract the date when it is delimited with .", function (t: tape.Test): void {
                        const ds: Datestamp|null = Datestamp.fromString("./foo/bar2015.12.30.jpg");
                        if (ds) {
                            t.equal(ds.toString(), "2015-11-30");
                            t.end();
                        } else {
                            t.fail("Expected a Datestamp object");
                        }
                    });


                    t.test("will extract the date when it is delimited with _", function (t: tape.Test): void {
                        const ds: Datestamp|null = Datestamp.fromString("./foo/bar2015_12_30.jpg");
                        if (ds) {
                            t.equal(ds.toString(), "2015-11-30");
                            t.end();
                        } else {
                            t.fail("Expected a Datestamp object");
                        }
                    });


                    t.test("will extract the date when it is delimited with -", function (t: tape.Test): void {
                        const ds: Datestamp|null = Datestamp.fromString("./foo/bar2015-12-30.jpg");
                        if (ds) {
                            t.equal(ds.toString(), "2015-11-30");
                            t.end();
                        } else {
                            t.fail("Expected a Datestamp object");
                        }
                    });


                    t.test("will return null when a date is not present", function (t: tape.Test): void {
                        const ds: Datestamp|null = Datestamp.fromString("./foo/bar-baz.jpg");
                        t.equal(ds, null);
                        t.end();
                    });

                }
            );
        }
    );


    t.test("instance",
        function (t: tape.Test): void {


            t.test("can be constructed",
                function (t: tape.Test): void {
                    const datestamp: Datestamp = new Datestamp(new Date(2016, 1, 1));
                    t.true(datestamp);
                    t.end();
                }
            );


            t.test("toString() will return a properly formatted string",
                function (t: tape.Test): void {
                    const datestamp: Datestamp = new Datestamp(new Date(2016, 0, 2));
                    t.equal(datestamp.toString(), "2016-01-02");
                    t.end();
                }
            );


        }
    );
});
