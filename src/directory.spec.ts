import * as path from "path";
import * as tape from "tape";
import * as fs from "fs-extra";
import * as _ from "lodash";
import {Directory} from "./directory";
import {File} from "./file";


tape(
    "File constructor", function (t: tape.Test): void {

        t.test("can create instances",
            function (t: tape.Test): void {
                const dir: Directory = new Directory(".");
                t.assert(dir !== undefined);
                t.end();
            }
        );


        t.test("will remove trailing directory separator character if present",
            function (t: tape.Test): void {
                const dir: Directory = new Directory("foo/bar/");
                t.equal(dir.toString(), "foo/bar");
                t.end();
            }
        );



        t.test("will join all arguments to form the directory path",
            function (t: tape.Test): void {
                const dir: Directory = new Directory("foo", "bar", "baz", "quux");
                t.equal(dir.toString(), "foo/bar/baz/quux");
                t.end();
            }
        );


        t.test("will accept an initial Directory argument",
            function (t: tape.Test): void {
                const dirA: Directory = new Directory("foo");
                const dirB: Directory = new Directory(dirA, "bar");
                t.equal(dirB.toString(), "foo/bar");
                t.end();
            }
        );

    }
);


tape(
    "File instance", function (t: tape.Test): void {

        t.test("toString()",
            function (t: tape.Test): void {

                t.test("will return the original path",
                    function (t: tape.Test): void {
                        const dir: Directory = new Directory("foo/bar/baz");
                        t.equal(dir.toString(), "foo/bar/baz");
                        t.end();
                    }
                );
            }
        );


        t.test("absPath()",
            function (t: tape.Test): void {

                t.test("will resolve a directory's absolute path",
                    function (t: tape.Test): void {
                        const dir: Directory = new Directory(__dirname);
                        t.equal(dir.absPath, "/Users/kwpeters/dev/pic-import-2/dist");
                        t.end();
                    }
                );

            }
        );


        t.test("equals()",
            function (t: tape.Test): void {

                t.test("will return true for two equal directories",
                    function (t: tape.Test): void {
                        const dir1: Directory = new Directory("foo/bar/");
                        const dir2: Directory = new Directory("foo/bar");
                        t.assert(dir1.equals(dir2));
                        t.end();
                    }
                );


                t.test("should return false for two directories that are not equal",
                    function (t: tape.Test): void {
                        const dir1: Directory = new Directory("foo/bar");
                        const dir2: Directory = new Directory("foo/baz");
                        t.false(dir1.equals(dir2));
                        t.end();
                    }
                );


                t.test("will return false for two directories named the same but in different folders",
                    function (t: tape.Test): void {
                        const dir1: Directory = new Directory("bar");
                        const dir2: Directory = new Directory("../bar");
                        t.false(dir1.equals(dir2));
                        t.end();
                    }
                );

            }
        );


        t.test("split()",
            function (t: tape.Test): void {


                t.test("will split the Directory's path into parts",
                    function (t: tape.Test): void {
                        const dir: Directory = new Directory("foo/bar/baz");
                        const parts: string[] = dir.split();
                        t.equal(parts.length, 3);
                        t.equal(parts[0], "foo");
                        t.equal(parts[1], "bar");
                        t.equal(parts[2], "baz");
                        t.end();
                    }
                );
            }
        );


        t.test("getSubdirectories()",
            function (t: tape.Test): void {


                t.test("will return the Directory's subdirectories",
                    function (t: tape.Test): void {
                        const dir: Directory = new Directory(path.join(__dirname, ".."));
                        dir.getSubdirectories()
                        .then((subdirs: Directory[]) => {
                            t.equal(subdirs.length, 7);
                            t.equal(subdirs[0].toString().slice(-4), ".git");
                            t.equal(subdirs[1].toString().slice(-5), ".idea");
                            t.equal(subdirs[2].toString().slice(-4), "dist");
                            t.equal(subdirs[3].toString().slice(-12), "node_modules");
                            t.equal(subdirs[4].toString().slice(-3), "src");
                            t.equal(subdirs[5].toString().slice(-4), "test");
                            t.equal(subdirs[6].toString().slice(-3), "tmp");
                            t.end();
                        });
                    }
                );


            }
        );


        t.test("getSubdirectoriesSync()",
            function (t: tape.Test): void {

                t.test("will return the Directory's subdirectories",
                    function (t: tape.Test): void {

                        const dir: Directory = new Directory(path.join(__dirname, ".."));
                        const subdirs: Directory[] = dir.getSubdirectoriesSync();

                        t.equal(subdirs.length, 7);
                        t.equal(subdirs[0].toString().slice(-4), ".git");
                        t.equal(subdirs[1].toString().slice(-5), ".idea");
                        t.equal(subdirs[2].toString().slice(-4), "dist");
                        t.equal(subdirs[3].toString().slice(-12), "node_modules");
                        t.equal(subdirs[4].toString().slice(-3), "src");
                        t.equal(subdirs[5].toString().slice(-4), "test");
                        t.equal(subdirs[6].toString().slice(-3), "tmp");
                        t.end();
                    }
                );

            }
        );


        t.test("getFiles()",
            function (t: tape.Test): void {

                let tmpDir: Directory;

                function setup(): void {
                    tmpDir = new Directory("tmp");
                    tmpDir.ensureExistsSync();
                    tmpDir.emptySync();

                    _.forEach([
                            "test/input/2015-03-11 09.05.32.jpg",
                            "test/input/IMG_8718-canon.JPG",
                            "test/input/P1040165-panasonic.JPG"],
                        (curFileName) => {
                            const file: File = new File(curFileName);
                            file.copySync(tmpDir);
                        }
                    );
                }

                t.test("will return the Directory's files",
                    function (t: tape.Test): void {
                        setup();
                        tmpDir.getFiles()
                        .then((files: File[]) => {
                            t.equal(files.length, 3);
                            t.equal(files[0].toString(), "tmp/2015-03-11 09.05.32.jpg");
                            t.equal(files[1].toString(), "tmp/IMG_8718-canon.JPG");
                            t.equal(files[2].toString(), "tmp/P1040165-panasonic.JPG");
                            t.end();
                        });
                    }
                );

            }
        );


        t.test("getFilesSync()",
            function (t: tape.Test): void {

                let tmpDir: Directory;

                function setup(): void {
                    tmpDir = new Directory("tmp");
                    tmpDir.ensureExistsSync();
                    tmpDir.emptySync();

                    _.forEach([
                            "test/input/2015-03-11 09.05.32.jpg",
                            "test/input/IMG_8718-canon.JPG",
                            "test/input/P1040165-panasonic.JPG"],
                        (curFileName) => {
                            const file: File = new File(curFileName);
                            file.copySync(tmpDir);
                        }
                    );
                }

                t.test("will return the Directory's files",
                    function (t: tape.Test): void {
                        setup();
                        const files: File[] = tmpDir.getFilesSync();

                        t.equal(files.length, 3);
                        t.equal(files[0].toString(), "tmp/2015-03-11 09.05.32.jpg");
                        t.equal(files[1].toString(), "tmp/IMG_8718-canon.JPG");
                        t.equal(files[2].toString(), "tmp/P1040165-panasonic.JPG");
                        t.end();
                    }
                );

            }
        );


        t.test("exists()",
            function (t: tape.Test): void {

                t.test("will be fulfuille with a truthy stats object when given an existing directory",
                    function (t: tape.Test): void {

                        const dir: Directory = new Directory(__dirname);

                        dir.exists()
                        .then((stats: fs.Stats|null) => {
                            if (stats) {
                                t.true(stats.isDirectory());
                                t.end();
                            } else {
                                t.fail("Expected a Stats object");
                            }
                        });
                    }
                );


                t.test("will be resolved with false when given a directory that does not exist",
                    function (t: tape.Test): void {

                        const dir: Directory = new Directory("foo/bar");
                        dir.exists()
                        .then((stats) => {
                            t.false(stats);
                            t.end();
                        });
                    }
                );


            }
        );


        t.test("existsSync()",
            function (t: tape.Test): void {

                t.test("will return a truthy stats object when given an existing directory",
                    function (t: tape.Test): void {
                        const dir: Directory = new Directory(__dirname);
                        const stats: fs.Stats|null = dir.existsSync();
                        if (stats) {
                            t.true(stats.isDirectory());
                            t.end();
                        } else {
                            t.fail("Expected a Stats object");
                        }
                    }
                );


                t.test("will return false when given a directory that does not exist",
                    function (t: tape.Test): void {
                        const dir: Directory = new Directory("foo/bar");
                        const stats: fs.Stats|null = dir.existsSync();
                        t.false(stats);
                        t.end();
                    }
                );


            }
        );


        t.test("ensureExists()",
            function (t: tape.Test): void {

                function setup(): void {
                    const tmpDir: Directory = new Directory("tmp");
                    tmpDir.emptySync();
                }

                t.test("will create a single directory that does not exist",
                    function (t: tape.Test): void {
                        setup();

                        const dir: Directory = new Directory("tmp/sample");
                        t.false(dir.existsSync());

                        dir.ensureExists()
                        .then(() => {
                            t.true(dir.existsSync());
                            t.end();
                        });
                    }
                );


                t.test("will create multiple directory levels that do not exist",
                    function (t: tape.Test): void {
                        setup();

                        const dir: Directory = new Directory("tmp/dirA/dirB/dirC");
                        t.false(dir.existsSync());

                        dir.ensureExists()
                        .then(() => {
                            t.true(dir.existsSync());
                            t.end();
                        });
                    }
                );

            }
        );


        t.test("ensureExistsSync()",
            function (t: tape.Test): void {

                function setup(): void {
                    const tmpDir: Directory = new Directory("tmp");
                    tmpDir.emptySync();
                }


                t.test("will create a single directory that does not exist",
                    function (t: tape.Test): void {
                        setup();

                        const dir: Directory = new Directory("tmp/sample");
                        t.false(dir.existsSync());

                        dir.ensureExistsSync();
                        t.true(dir.existsSync());

                        t.end();
                    }
                );


                t.test("will create multiple directory levels that do not exist",
                    function (t: tape.Test): void {
                        setup();

                        const dir: Directory = new Directory("tmp/dirA/dirB/dirC");
                        t.false(dir.existsSync());

                        dir.ensureExistsSync();
                        t.true(dir.existsSync());

                        t.end();
                    }
                );

            }
        );


        t.test("empty()",
            function (t: tape.Test): void {


                t.test("will delete existing items in the specified directory",
                    function (t: tape.Test): void {

                        const tmpDir: Directory = new Directory("tmp");
                        const dirA:   Directory = new Directory("tmp/dirA");

                        dirA.ensureExistsSync();

                        tmpDir.empty()
                        .then(() => {
                            t.false(dirA.existsSync());
                            t.true(tmpDir.existsSync());
                            t.end();
                        });
                    }
                );
            }
        );


        t.test("emptySync()",
            function (t: tape.Test): void {


                t.test("will delete existing items in the specified directory",
                    function (t: tape.Test): void {


                        const tmpDir: Directory = new Directory("tmp");
                        const dirA:   Directory = new Directory("tmp/dirA");
                        dirA.ensureExistsSync();

                        tmpDir.emptySync();
                        t.false(dirA.existsSync());
                        t.true(tmpDir.existsSync());
                        t.end();
                    }
                );

            }
        );



    }
);
