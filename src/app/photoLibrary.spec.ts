import * as _ from "lodash";
import {Directory} from "../lib/depot/directory";
import {File} from "../lib/depot/file";
import {Datestamp} from "./datestamp";
import {PhotoLibrary, IDateDirMap} from "./photoLibrary";
import {FileTask} from "./fileTask";


describe("PhotoLibrary", () => {


    const tmpDir: Directory = new Directory("tmp");
    beforeEach(() => {
        // Make sure the tmp directory is empty.
        tmpDir.emptySync();
    });


    describe("static", () => {


        describe("createDateDirMap()", () => {


            const libDir: Directory = new Directory(tmpDir, "lib");
            beforeEach(() => {
                libDir.ensureExistsSync();
            });


            it("will recognize a folder with a normal datestamp", (done) => {
                const dirA = new Directory(libDir, Datestamp.fromYMD(2016, 2, 20).toString());
                dirA.ensureExistsSync();

                const dirB = new Directory(libDir, Datestamp.fromYMD(2016, 2, 21).toString());
                dirB.ensureExistsSync();

                PhotoLibrary.createDateDirMap(libDir)
                .then((dateDirMap) => {
                    expect(Object.keys(dateDirMap).length).toEqual(2);
                    expect(dateDirMap["2016-02-20"].toString()).toEqual("tmp/lib/2016-02-20");
                    expect(dateDirMap["2016-02-21"].toString()).toEqual("tmp/lib/2016-02-21");
                    done();
                });

            });


            it("will recognize a folder with additional text appended", (done) => {
                const dirA = new Directory(libDir, Datestamp.fromYMD(2016, 2, 20).toString() + " - event A");
                dirA.ensureExistsSync();
                const dirB = new Directory(libDir, Datestamp.fromYMD(2016, 2, 21).toString() + "_event_B");
                dirB.ensureExistsSync();

                PhotoLibrary.createDateDirMap(libDir)
                .then((dateDirMap: IDateDirMap) => {
                    expect(Object.keys(dateDirMap).length).toEqual(2);
                    expect(dateDirMap["2016-02-20"].toString()).toEqual("tmp/lib/2016-02-20 - event A");
                    expect(dateDirMap["2016-02-21"].toString()).toEqual("tmp/lib/2016-02-21_event_B");
                    done();
                });


            });
        });
    });


    describe("instance", () => {


        const libDir: Directory = new Directory(tmpDir, "lib");
        beforeEach(() => {
            // Create the photo library directory.
            libDir.ensureExistsSync();
        });


        it("can be created", () => {
            const pl = new PhotoLibrary(new Directory(__dirname));
            expect(pl).toBeTruthy();
        });


        describe("importFile()", () => {


            it("will resolve to a FileTask with the destination set to an existing directory", (done) => {
                const fileToImport = new File("test/input/2015-03-11 09.05.32.jpg");

                // Create a directory matching the timestamp of the file to be imported.
                const march112015Dir = new Directory(libDir, "2015-03-11 - some event");
                march112015Dir.ensureExistsSync();

                const photoLibrary = new PhotoLibrary(libDir);
                photoLibrary.importFile(fileToImport)
                .then((fileTask) => {
                    const expected = "tmp/lib/2015-03-11 - some event/2015-03-11 09.05.32.jpg";
                    expect(fileTask.dstFile.absPath().slice(-1 * expected.length)).toEqual(expected);
                    done();
                });
            });


            it("will resolve to a FileTask with the destination set to a new directory", (done) => {
                const fileToImport = new File("test/input/2015-03-11 09.05.32.jpg");

                const photoLibrary = new PhotoLibrary(libDir);
                photoLibrary.importFile(fileToImport)
                .then((fileTask) => {
                    const expected = "tmp/lib/2015-03-11/2015-03-11 09.05.32.jpg";
                    expect(fileTask.dstFile.absPath().slice(-1 * expected.length)).toEqual(expected);
                    done();
                });
            });


        });


        describe("importDirectory()", () => {


            it("can import all files in a directory", (done) => {

                // Setup files to import.
                const importDir = new Directory("test/input");

                const photoLibrary = new PhotoLibrary(libDir);
                photoLibrary.importDirectory(importDir)
                .then((fileTasks) => {
                    // The correct number of files were imported.
                    expect(fileTasks.length).toEqual(6);

                    // Put the fileTasks in a deterministic order.
                    fileTasks = _.sortBy<FileTask>(fileTasks, (curTask) => curTask.dstFile.toString());

                    // Each destination file should be in the expected libDir subdirectory
                    let expected = "/tmp/lib/2015-03-11/2015-03-11 09.05.32.jpg";
                    expect(fileTasks[0].dstFile.absPath().slice(-1 * expected.length)).toEqual(expected);

                    expected = "tmp/lib/2015-03-11/no_exif_data 2015-03-11 09.05.32.txt";
                    expect(fileTasks[1].dstFile.absPath().slice(-1 * expected.length)).toEqual(expected);

                    expected = "/tmp/lib/2015-12-30/IMG_8718-canon.JPG";
                    expect(fileTasks[2].dstFile.absPath().slice(-1 * expected.length)).toEqual(expected);

                    expected = "/tmp/lib/2015-12-30/P1040165-panasonic.JPG";
                    expect(fileTasks[3].dstFile.absPath().slice(-1 * expected.length)).toEqual(expected);

                    expected = "/tmp/lib/2018-01-01/created_on_jan01_modified_on_oct06.txt";
                    expect(fileTasks[4].dstFile.absPath().slice(-1 * expected.length)).toEqual(expected);

                    expected = "/tmp/lib/2018-01-01/no_exif_data.txt";
                    expect(fileTasks[5].dstFile.absPath().slice(-1 * expected.length)).toEqual(expected);

                    done();
                });
            });


        });
    });
});
