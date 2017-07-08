import * as tape from "tape";
import * as _ from "lodash";
import {Directory} from "./directory";
import {Datestamp} from "./datestamp";
import {PhotoLibrary, IDateDirMap} from "./photoLibrary";
import {FileTask} from "./fileTask";
import {File} from "./file";

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

        const libDir: Directory = new Directory(tmpDir, "lib");


        setup = (function (): () => void {
            const outerSetup: () => void = setup || noop;
            return () => {
                outerSetup();

                // Create the photo library directory.
                libDir.ensureExistsSync();
            };
        })();


        t.test("can be created", function (t: tape.Test): void {
            setup();
            const pl: PhotoLibrary = new PhotoLibrary(new Directory(__dirname));
            t.true(pl);
            t.end();

        });


        t.test("importFile()", function (t: tape.Test): void {

            t.test("will resolve to a FileTask with the destination set to an existing directory",
                function (t: tape.Test): void {

                    setup();

                    const fileToImport: File = new File("test/input/2015-03-11 09.05.32.jpg");

                    // Create a directory matching the timestamp of the file to be imported.
                    const march112015Dir: Directory = new Directory(libDir, "2015-03-11 - some event");
                    march112015Dir.ensureExistsSync();

                    const photoLibrary: PhotoLibrary = new PhotoLibrary(libDir);
                    photoLibrary.importFile(fileToImport)
                    .then((fileTask: FileTask) => {
                        const expected: string = "tmp/lib/2015-03-11 - some event/2015-03-11 09.05.32.jpg";
                        t.equal(fileTask.dstFile.absPath.slice(-1 * expected.length), expected);
                        t.end();
                    });
                }
            );

            t.test("will resolve to a FileTask with the destination set to a new directory",
                function (t: tape.Test): void {
                    setup();

                    const fileToImport: File = new File("test/input/2015-03-11 09.05.32.jpg");

                    const photoLibrary: PhotoLibrary = new PhotoLibrary(libDir);
                    photoLibrary.importFile(fileToImport)
                    .then((fileTask: FileTask) => {
                        const expected: string = "tmp/lib/2015-03-11/2015-03-11 09.05.32.jpg";
                        t.equal(fileTask.dstFile.absPath.slice(-1 * expected.length), expected);
                        t.end();
                    });
                }
            );

        });


        t.test("importDirectory()",
            function (t: tape.Test): void {

                t.test("can import all files in a directory",
                    function (t: tape.Test): void {

                        setup();

                        // Setup files to import.
                        const importDir: Directory = new Directory("test/input");

                        const photoLibrary: PhotoLibrary = new PhotoLibrary(libDir);
                        photoLibrary.importDirectory(importDir)
                        .then((fileTasks: FileTask[]) => {

                            t.equal(fileTasks.length, 6, "The correct number of files were imported.");

                            // Put the fileTasks in a deterministic order.
                            fileTasks = _.sortBy(fileTasks, (curTask) => curTask.dstFile);

                            // Each destination file should be in the expected libDir subdirectory
                            let expected: string = "/tmp/lib/2015-03-11/2015-03-11 09.05.32.jpg";
                            t.equal(fileTasks[0].dstFile.absPath.slice(-1 * expected.length), expected);

                            expected = "tmp/lib/2015-03-11/no_exif_data 2015-03-11 09.05.32.txt";
                            t.equal(fileTasks[1].dstFile.absPath.slice(-1 * expected.length), expected);

                            expected = "/tmp/lib/2015-12-30/IMG_8718-canon.JPG";
                            t.equal(fileTasks[2].dstFile.absPath.slice(-1 * expected.length), expected);

                            expected = "/tmp/lib/2015-12-30/P1040165-panasonic.JPG";
                            t.equal(fileTasks[3].dstFile.absPath.slice(-1 * expected.length), expected);

                            expected = "/tmp/lib/2017-03-04/no_exif_data.txt";
                            t.equal(fileTasks[4].dstFile.absPath.slice(-1 * expected.length), expected);

                            expected = "/tmp/lib/2017-03-05/created_on_5th_modified_on_6th.txt";
                            t.equal(fileTasks[5].dstFile.absPath.slice(-1 * expected.length), expected);

                            t.end();
                        });
                    }
                );
            }
        );
    });
});
