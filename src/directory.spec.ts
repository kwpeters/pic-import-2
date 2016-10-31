import * as path from "path";
import * as tape from "tape";
import {Directory} from "./directory";



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


        // Todo: left off here.
        t.test("exists()",
            function (t: tape.Test): void {




            }
        );



    }
);
