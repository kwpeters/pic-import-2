import * as tape from "tape";
import {Directory} from "./directory";
import {Datestamp} from "./datestamp";
import {PhotoLibrary, DateDirMap} from "./photoLibrary";

const noop: () => void = () => {};

tape("PhotoLibrary", function (t: tape.Test): void {


    const tmpDir: Directory = new Directory("tmp");

    let setup: () => void = () => {
        // Make sure the tmp directory is empty.
        tmpDir.emptySync();
    };


    t.test("static", function (t: tape.Test): void {


        t.test("createDateDirMap()", function (t: tape.Test): void {

            const libDir: Directory = new Directory(tmpDir, "lib");


            // This is a crappy way to do nested beforeEach()/setup() functions.  Tape sucks.
            setup = (function (): () => void {
                const outerSetup: () => void = setup || noop;
                return () => {
                    outerSetup();
                    libDir.ensureExistsSync();
                };
            })();


            t.test("will recognize a folder with a normal datestamp", function (t: tape.Test): void {

                setup();

                const dirA: Directory = new Directory(libDir, Datestamp.fromYMD(2016, 2, 20).toString());
                dirA.ensureExistsSync();

                const dirB: Directory = new Directory(libDir, Datestamp.fromYMD(2016, 2, 21).toString());
                dirB.ensureExistsSync();

                PhotoLibrary.createDateDirMap(libDir)
                .then((dateDirMap: DateDirMap) => {
                    t.equal(Object.keys(dateDirMap).length, 2);
                    t.equal(dateDirMap["2016-02-20"].toString(), "tmp/lib/2016-02-20");
                    t.equal(dateDirMap["2016-02-21"].toString(), "tmp/lib/2016-02-21");
                    t.end();
                });

            });


            t.test("will recognize a folder with additional text appended", function (t: tape.Test): void {

                setup();

                const dirA: Directory = new Directory(libDir, Datestamp.fromYMD(2016, 2, 20).toString() + " - event A");
                dirA.ensureExistsSync();
                const dirB: Directory = new Directory(libDir, Datestamp.fromYMD(2016, 2, 21).toString() + "_event_B");
                dirB.ensureExistsSync();

                PhotoLibrary.createDateDirMap(libDir)
                .then((dateDirMap: DateDirMap) => {
                    t.equal(Object.keys(dateDirMap).length, 2);
                    t.equal(dateDirMap["2016-02-20"].toString(), "tmp/lib/2016-02-20 - event A");
                    t.equal(dateDirMap["2016-02-21"].toString(), "tmp/lib/2016-02-21_event_B");
                    t.end();
                });

            });

        });


    });


    t.test("instance", function (t: tape.Test): void {


        t.test("can be created", function (t: tape.Test): void {

            // todo: Left off here!
            t.ok(false);
            t.end();

        });


    });


});
