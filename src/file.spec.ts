import * as fs from "fs";
import * as tape from "tape";
import {File} from "./file";
import {Directory} from "./directory";
import createStream = tape.createStream;

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


        t.test("copy()",
            function (t: tape.Test): void {

                const destDir: Directory = new Directory("tmp");

                function setup(): void {
                    destDir.emptySync();
                }


                t.test("will copy the file to the specified destination directory",
                    function (t: tape.Test): void {
                        setup();

                        const srcFile: File = new File("test/input/2015-03-11 09.05.32.jpg");
                        srcFile.copy(destDir)
                            .then((destFile: File) => {
                                t.equal(destFile.toString(), "tmp/2015-03-11 09.05.32.jpg");
                                t.assert(destFile.existsSync());
                                t.end();
                            });
                    }
                );


                t.test("will rename the file when a directory and filename is specified",
                    function (t: tape.Test): void {
                        setup();

                        const srcFile: File = new File("test/input/2015-03-11 09.05.32.jpg");
                        srcFile.copy(destDir, "foo.jpg")
                            .then((destFile: File) => {
                                t.equal(destFile.toString(), "tmp/foo.jpg");
                                t.assert(destFile.existsSync());
                                t.end();
                            });
                    }
                );


                t.test("will rename the file when a destination File is specified",
                    function (t: tape.Test): void {
                        setup();

                        const srcFile: File = new File("test/input/2015-03-11 09.05.32.jpg");
                        const destFile: File = new File("tmp/foo2.jpg");
                        srcFile.copy(destFile)
                            .then((destFile: File) => {
                                t.equal(destFile.toString(), "tmp/foo2.jpg");
                                t.assert(destFile.existsSync());
                                t.end();
                            });
                    }
                );


                t.test("will reject if the source file does not exist",
                    function (t: tape.Test): void {
                        setup();

                        const srcFile: File = new File("test/input/does_not_exist.jpg");
                        srcFile.copy(destDir)
                            .catch(() => {
                                const destFile: File = new File(destDir.toString(), "does_not_exist.jpg");
                                t.assert(!destFile.existsSync());
                                t.end();
                            });
                    }
                );


                t.test("will overwrite an existing destination file",
                    function (t: tape.Test): void {
                        setup();

                        // Create a small text file and get its size.
                        const origFile: File = new File(destDir, "test.txt");
                        origFile.writeSync("abc");
                        const origSize: number = origFile.statsSync().size;

                        // Create another file and get its size.
                        const newFile: File = new File(destDir, "source.txt");
                        newFile.writeSync("abcdefghijklmnopqrstuvwxyz");
                        const newSize: number = newFile.statsSync().size;

                        // Copy newFile over origFile.  Get the size of the copied file.
                        // It should equal the size of newFile.
                        newFile.copy(origFile)
                            .then(
                                (destFile: File) => {
                                    t.equal(destFile.statsSync().size, newSize);
                                    t.notEqual(destFile.statsSync().size, origSize);
                                    t.end();
                                }
                            );
                    }
                );


            }
        );


        t.test("copySync()",
            function (t: tape.Test): void {

                const destDir: Directory = new Directory("tmp");

                function setup(): void {
                    destDir.emptySync();
                }

                t.test("will copy the file to the specified destination directory",
                    function (t: tape.Test): void {
                        const srcFile: File = new File("test/input/2015-03-11 09.05.32.jpg");
                        const destFile: File = srcFile.copySync(destDir);
                        t.equal(destFile.toString(), "tmp/2015-03-11 09.05.32.jpg");
                        t.assert(destFile.existsSync());
                        t.end();
                    }
                );


            }
        );

    }
);


