import * as tape from "tape";
import {getCreateDate} from "./exifReader";



tape("exifReader", function (t: tape.Test): void {

    t.test("getCreateDate", function (t: tape.Test): void {


        t.test("will read the creation date from an iPhone image", function (t: tape.Test): void {
            getCreateDate("test/input/2015-03-11 09.05.32.jpg")
            .then((creationDatestamp) => {
                t.equal(creationDatestamp.toString(), "2015-03-11");
                t.end();
            });
        });


        t.test("will read the creation date from a Canon image", function (t: tape.Test): void {
            getCreateDate("test/input/IMG_8718-canon.JPG")
            .then((creationDatestamp) => {
                t.equal(creationDatestamp.toString(), "2015-12-30");
                t.end();
            });
        });


        t.test("will read the creation date from a Panasonic image", function (t: tape.Test): void {
            getCreateDate("test/input/P1040165-panasonic.JPG")
            .then((creationDatestamp) => {
                t.equal(creationDatestamp.toString(), "2015-12-30");
                t.end();
            });
        });

    });

});
