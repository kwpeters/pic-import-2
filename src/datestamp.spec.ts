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
