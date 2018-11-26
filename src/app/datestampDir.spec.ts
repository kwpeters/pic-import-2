import {DatestampDir} from "./datestampDir";

describe("DatestampDir", () => {

    describe("static", () => {


        describe("test()", () => {


            it("will return null when given a path with no datestamp", () => {
                const datestamp = DatestampDir.test("./foo/bar/baz");
                expect(datestamp).toEqual(null);
            });


            it("will return the datestamp string when given a path that has one", () => {
                const datestamp = DatestampDir.test("./foo/2016-01-02/");
                expect(datestamp).toBeTruthy();
                expect(datestamp!.toString()).toEqual("2016-01-02");
            });


            it("will return the datestamp string when the path uses a different delimiter", () => {
                const datestamp = DatestampDir.test("./foo/2016_01_02/");
                expect(datestamp).toBeTruthy();
                expect(datestamp!.toString()).toEqual("2016-01-02");
            });


            it("will return the datestamp string when there is additional text", () => {
                const datestamp = DatestampDir.test("./foo/2016-01-02-some event");
                expect(datestamp).toBeTruthy();
                expect(datestamp!.toString()).toEqual("2016-01-02");
            });


        });


    });

});
