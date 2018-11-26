import {Datestamp} from "./datestamp";


describe("Datestamp", () => {


    describe("static", () => {


        describe("fromYMD()", () => {


            it("will convert from a year, month and day to a Datestamp", () => {
                const datestamp = Datestamp.fromYMD(2016, 1, 22);
                expect(datestamp.toString()).toEqual("2016-01-22");
            });


        });


        describe("fromString()", () => {


            it("will extract the date when it is present at the beginning", () => {
                const ds = Datestamp.fromString("./foo/2015-12-30blah.jpg");
                expect(ds).toBeTruthy();
                expect(ds!.toString()).toEqual("2015-11-30");
            });


            it("will extract the date when it is present in the middle", () => {
                const ds = Datestamp.fromString("./foo/bar2015-12-30baz.jpg");
                expect(ds).toBeTruthy();
                expect(ds!.toString()).toEqual("2015-11-30");
            });


            it("will extract the date when it is present at the end", () => {
                const ds = Datestamp.fromString("./foo/bar2015-12-30.jpg");
                expect(ds).toBeTruthy();
                expect(ds!.toString()).toEqual("2015-11-30");
            });


            it("will extract the date when it is delimited with .", () => {
                const ds = Datestamp.fromString("./foo/bar2015.12.30.jpg");
                expect(ds).toBeTruthy();
                expect(ds!.toString()).toEqual("2015-11-30");
            });


            it("will extract the date when it is delimited with _", () => {
                const ds = Datestamp.fromString("./foo/bar2015_12_30.jpg");
                expect(ds).toBeTruthy();
                expect(ds!.toString()).toEqual("2015-11-30");
            });


            it("will extract the date when it is delimited with -", () => {
                const ds = Datestamp.fromString("./foo/bar2015-12-30.jpg");
                expect(ds).toBeTruthy();
                expect(ds!.toString()).toEqual("2015-11-30");
            });


            it("will return null when a date is not present", () => {
                const ds = Datestamp.fromString("./foo/bar-baz.jpg");
                expect(ds).toEqual(null);
            });


        });


    });


    describe("instance", () => {


        it("can be constructed", () => {
            const datestamp = new Datestamp(new Date(2016, 1, 1));
            expect(datestamp).toBeTruthy();
        });


        it("toString() will return a properly formatted string", () => {
            const datestamp = new Datestamp(new Date(2016, 0, 2));
            expect(datestamp.toString()).toEqual("2016-01-02");
        });


    });


});
