import * as fs from "fs";
import * as tape from "tape";
import {File} from "./file";
import {Directory} from "./directory";

tape(
    "File constructor",
    function (t: tape.Test): void {


        t.test("should join all constructor arguments to form the file's path",
            function (t: tape.Test): void {
                const file: File = new File("foo", "bar", "baz.txt");
                t.equal(file.toString(), "foo/bar/baz.txt");
                t.end();
            }
        );


        t.test("should convert Directory objects to strings when joining arguments",
            function (t: tape.Test): void {
                const file: File = new File(new Directory("foo"), "baz.txt");
                t.equal(file.toString(), "foo/baz.txt");
                t.end();
            }
        );


        t.test("when a Directory is present everything that precedes it should be discarded",
            function (t: tape.Test): void {
                const file: File = new File(new Directory("foo"), new Directory("bar"), "baz.txt");
                t.equal(file.toString(), "bar/baz.txt");
                t.end();
            }
        );

    }
);


tape(
    "File instance",
    function (t: tape.Test): void {

        t.test("toString() should return a string representation",
            function (t: tape.Test): void {
                const file: File = new File("foo/bar.txt");
                t.equal(file.toString(), "foo/bar.txt");
                t.end();
            }
        );


        t.test("absPath() will resolve a file's absolute path",
            function (t: tape.Test): void {
                const file: File = new File(__filename);
                t.equal(file.absPath, "/Users/kwpeters/dev/pic-import-2/dist/file.spec.js");
                t.end();
            }
        );


        t.test("equals()",
            function (t: tape.Test): void {

                t.test("will return true for two equal Files",
                    function (t: tape.Test): void {
                        const file1: File = new File("foo/bar/baz.txt");
                        const file2: File = new File("foo", "bar", "baz.txt");
                        t.assert(file1.equals(file2));
                        t.end();
                    }
                );


                t.test("will return false when two files are not equal",
                    function (t: tape.Test): void {
                        const file1: File = new File("foo/bar/baz.txt");
                        const file2: File = new File("foo", "bar", "baz.xt");
                        t.notOk(file1.equals(file2));
                        t.end();
                    }
                );


                t.test("will return false for two files with the same name in different directories",
                    function (t: tape.Test): void {
                        const file1: File = new File("../baz.txt");
                        const file2: File = new File("../../baz.txt");
                        t.notOk(file1.equals(file2));
                        t.end();
                    }
                );

            }
        );


        t.test("dirName, baseName, fileName, extName",
            function (t: tape.Test): void {


                t.test("will give the appropriate parts of a normal file path",
                    function (t: tape.Test): void {
                        const file: File = new File("../tmp/bar/baz.foo");
                        t.equal(file.dirName, "../tmp/bar/");
                        t.equal(file.baseName, "baz");
                        t.equal(file.fileName, "baz.foo");
                        t.equal(file.extName, ".foo");
                        t.end();
                    }
                );


                t.test("will give the appropriate parts of a file path with no directory",
                    function (t: tape.Test): void {
                        const file: File = new File("baz.foo");
                        t.equal(file.dirName, "./");
                        t.equal(file.baseName, "baz");
                        t.equal(file.fileName, "baz.foo");
                        t.equal(file.extName, ".foo");
                        t.end();
                    }
                );


                t.test("will give the appropriate parts of a file path with no extension",
                    function (t: tape.Test): void {
                        const file: File = new File("../tmp/bar/baz");
                        t.equal(file.dirName, "../tmp/bar/");
                        t.equal(file.baseName, "baz");
                        t.equal(file.fileName, "baz");
                        t.equal(file.extName, "");
                        t.end();
                    }
                );


                t.test("will return the name of a dotfile as the baseName",
                    function (t: tape.Test): void {
                        const file: File = new File("../tmp/bar/.baz");
                        t.equal(file.dirName, "../tmp/bar/");
                        t.equal(file.baseName, ".baz");
                        t.equal(file.fileName, ".baz");
                        t.equal(file.extName, "");
                        t.end();
                    }
                );


            }
        );


        t.test("concatenating parts",
            function (t: tape.Test): void {


                t.test("of a file path with an extension should reconstruct the original file path",
                    function (t: tape.Test): void {
                        const filePath: string = "../tmp/bar/baz.foo";
                        const file: File       = new File(filePath);
                        t.equal(file.dirName + file.baseName + file.extName, filePath);
                        t.end();
                    }
                );


                t.test("of a file with no extension should reconstruct the original file path",
                    function (t: tape.Test): void {
                        const filePath: string = "../tmp/bar/baz";
                        const file: File       = new File(filePath);
                        t.equal(file.dirName + file.baseName + file.extName, filePath);
                        t.end();
                    }
                );


            }
        );


        t.test("directory",
            function (t: tape.Test): void {


                t.test("will return a Directory object representing the directory containing the file",
                    function (t: tape.Test): void {
                        const dir: Directory = new Directory("../foo/bar");
                        const file: File     = new File(dir.toString(), "baz.txt");
                        t.equal(file.directory.toString(), dir.toString());
                        t.end();
                    }
                );


            }
        );

        t.test("exists()",
            function (t: tape.Test): void {


                t.test("will resolve with the file's stats when the file exists",
                    function (t: tape.Test): void {
                        const file: File = new File(__filename);
                        file.exists()
                            .then((stats) => {
                                t.assert(stats);
                                t.end();
                            });
                    }
                );


                t.test("will resolve with undefined when the file does not exist",
                    function (t: tape.Test): void {
                        const file: File = new File("./foo/bar.txt");
                        file.exists()
                            .then((stats) => {
                                t.equal(stats, undefined);
                                t.end();
                            });
                    }
                );


            }
        );


        t.test("existsSync()",
            function (t: tape.Test): void {


                t.test("will return the file's stats when the file exists",
                    function (t: tape.Test): void {
                        const file: File = new File(__filename);
                        const stats: fs.Stats = file.existsSync();
                        t.assert(stats);
                        t.end();
                    }
                );

                t.test("will return undefined when the file does not exist",
                    function (t: tape.Test): void {
                        const file: File = new File("./foo/bar.txt");
                        const stats: fs.Stats = file.existsSync();
                        t.equal(stats, undefined);
                        t.end();
                    }
                );

            }
        );


    }
);


