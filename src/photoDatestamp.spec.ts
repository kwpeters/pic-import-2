import * as tape from "tape";
import * as photoDatestamp from "./photoDatestamp";
import {File} from "./file";
import {Datestamp} from "./datestamp";

tape("getDatestampExif()",
    function (t: tape.Test): void {

        t.test("will fulfill with the correct datestamp",
            function (t: tape.Test): void {
                const imageFile: File = new File("test/input/2015-03-11 09.05.32.jpg");
                photoDatestamp.getDatestampExif(imageFile)
                .then((actualDatestamp: Datestamp) => {
                    t.equal(actualDatestamp.toString(), "2015-03-11");
                    t.end();
                });
            }
        );


        t.test("will reject when there is no exif data",
            function (t: tape.Test): void {
                const imageFile: File = new File("test/input/no_exif_data.txt");
                photoDatestamp.getDatestampExif(imageFile)
                .then((actualDatestamp: Datestamp) => {
                    t.fail("Should not have resolved.");
                })
                .catch((error) => {
                    t.pass("Promise correctly rejected.");
                    t.end();
                });
            }
        );

    }
);

tape("getDatestampFilename()",
    function (t: tape.Test): void {


        t.test("will fulfill with the correct datestamp",
            function (t: tape.Test): void {
                const imageFile: File = new File("test/input/no_exif_data 2015-03-11 09.05.32.txt");
                photoDatestamp.getDatestampFilename(imageFile)
                .then((actualDatestamp: Datestamp) => {
                    t.equal(actualDatestamp.toString(), "2015-03-11");
                    t.end();
                });
            }
        );


        t.test("will reject when given a file with no datestamp in the name",
            function (t: tape.Test): void {
                const imageFile: File = new File("test/input/no_exif_data.txt");
                photoDatestamp.getDatestampFilename(imageFile)
                .then((actualDatestamp: Datestamp) => {
                    t.fail("Should not have resolved.");
                })
                .catch((error) => {
                    t.pass("Promise correctly rejected.");
                    t.end();
                });
            }
        );
    }
);


tape("getDatestampStats()",
    function (t: tape.Test): void {

        t.test("will fulfill with the correct datestamp when the creation time is further in the past",
            function (t: tape.Test): void {
                const imageFile: File = new File("test/input/created_on_5th_modified_on_6th.txt");
                photoDatestamp.getDatestampStats(imageFile)
                .then((actualDatestamp: Datestamp) => {
                    // The datestamp should be the oldest time value found in the file's stats.
                    // In this case, that is the 5th.
                    t.equal(actualDatestamp.toString(), "2017-03-05");
                    t.end();
                });
            }
        );
    }
);
