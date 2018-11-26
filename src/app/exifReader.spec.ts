import {getCreateDate} from "./exifReader";


describe("exifReader", () => {


    describe("getCreateDate()", () => {


        it("will read the creation date from an iPhone image", () => {
            return getCreateDate("test/input/2015-03-11 09.05.32.jpg")
            .then((creationDatestamp) => {
                expect(creationDatestamp.toString()).toEqual("2015-03-11");
            });
        });


        it("will read the creation date from a Canon image", (done) => {
            getCreateDate("test/input/IMG_8718-canon.JPG")
            .then((creationDatestamp) => {
                expect(creationDatestamp.toString()).toEqual("2015-12-30");
                done();
            });
        });


        it("will read the creation date from a Panasonic image", (done) => {
            getCreateDate("test/input/P1040165-panasonic.JPG")
            .then((creationDatestamp) => {
                expect(creationDatestamp.toString()).toEqual("2015-12-30");
                done();
            });
        });


    });
});
