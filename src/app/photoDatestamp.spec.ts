import * as photoDatestamp from "./photoDatestamp";
import {File} from "../lib/depot/file";


describe("getDatestampExif()", () => {


    it("will fulfill with the correct datestamp", (done) => {
        const imageFile = new File("test/input/2015-03-11 09.05.32.jpg");
        photoDatestamp.getDatestampExif(imageFile)
        .then((actualDatestamp) => {
            expect(actualDatestamp.toString()).toEqual("2015-03-11");
            done();
        });
    });


    it("will reject when there is no exif data", (done) => {
        const imageFile = new File("test/input/no_exif_data.txt");
        photoDatestamp.getDatestampExif(imageFile)
        .catch(() => {
            done();
        });
    });


});


describe("getDatestampFilename()", () => {


    it("will fulfill with the correct datestamp", (done) => {
        const imageFile = new File("test/input/no_exif_data 2015-03-11 09.05.32.txt");
        photoDatestamp.getDatestampFilename(imageFile)
        .then((actualDatestamp) => {
            expect(actualDatestamp.toString()).toEqual("2015-03-11");
            done();
        });
    });


    it("will reject when given a file with no datestamp in the name", (done) => {
        const imageFile = new File("test/input/no_exif_data.txt");
        photoDatestamp.getDatestampFilename(imageFile)
        .catch(() => {
            done();
        });
    });


});


describe("getDatestampStats()", () => {


    it("will fulfill with the correct datestamp when the creation time is further in the past", (done) => {
        const imageFile = new File("test/input/created_on_jan01_modified_on_oct06.txt");
        photoDatestamp.getDatestampStats(imageFile)
        .then((actualDatestamp) => {
            // The datestamp should be the oldest time value found in the file's stats.
            // In this case, that is the 5th.
            expect(actualDatestamp.toString()).toEqual("2018-01-01");
            done();
        });
    });


});
