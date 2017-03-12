import * as tape from "tape";
// import * as _ from "lodash";
import {File} from "./file";
import {Directory} from "./directory";
import {FileTask, FileOperation} from "./fileTask";

tape("FileTask", function (t: tape.Test): void {

    t.test("instance", function (t: tape.Test): void {


        t.test("is creatable", function (t: tape.Test): void {
            const fileTask: FileTask = new FileTask(new File("src.txt"), new File("dest.txt"));
            t.assert(fileTask);
            t.end();
        });

        t.test("srcFile will return the value passed into the constructor",
            function (t: tape.Test): void {
                const fileTask: FileTask = new FileTask(new File("src.txt"), new File("dest.txt"));
                t.equal(fileTask.srcFile.toString(), "src.txt");
                t.end();
            }
        );

        t.test("dstFile will return the file passed into the constructor",
            function (t: tape.Test): void {
                const fileTask: FileTask = new FileTask(new File("src.txt"), new File("dest.txt"));
                t.equal(fileTask.dstFile.toString(), "dest.txt");
                t.end();
            }
        );

        t.test("dstFile will use the file name of the source when a destination Directory is specified",
            function (t: tape.Test): void {
                const fileTask: FileTask = new FileTask(new File("src.txt"), new Directory(".."));
                t.equal(fileTask.dstFile.toString(), "../src.txt");
                t.end();
            }
        );

        t.test("will default to a copy operation",
            function (t: tape.Test): void {

                const fileTask: FileTask = new FileTask(new File("src.txt"), new File("dest.txt"));
                t.equal(fileTask.operation, FileOperation.copy);
                t.end();
            }
        );


        t.test("execute()",
            function (t: tape.Test): void {

                t.test("will copy a file as expected",
                    function (t: tape.Test): void {

                        const tmpDir: Directory = new Directory("./tmp");
                        tmpDir.emptySync();

                        const srcFile: File = new File(new Directory("tmp/src"), "file.txt");
                        srcFile.writeSync("abc");

                        const dstDir: Directory = new Directory("tmp/dst");

                        const fileTask: FileTask = new FileTask(srcFile, dstDir);
                        fileTask.execute()
                        .then((dstFile: File) => {
                            t.assert(dstFile.existsSync());
                            t.equal(dstFile.readSync(), "abc");
                            t.assert(srcFile.existsSync());
                            t.end();
                        });
                    }
                );

                t.test("will move a file as expected",
                    function (t: tape.Test): void {

                        const tmpDir: Directory = new Directory("./tmp");
                        tmpDir.emptySync();

                        const srcFile: File = new File(new Directory("tmp/src"), "file.txt");
                        srcFile.writeSync("abc");

                        const dstDir: Directory = new Directory("tmp/dst");

                        const fileTask: FileTask = new FileTask(srcFile, dstDir, FileOperation.move);
                        fileTask.execute()
                        .then((dstFile: File) => {
                            t.assert(dstFile.existsSync());
                            t.equal(dstFile.readSync(), "abc");
                            t.false(srcFile.existsSync());
                            t.end();
                        });
                    }
                );

                t.test("will create the destination directory when it does not already exist",
                    function (t: tape.Test): void {

                        const tmpDir: Directory = new Directory("./tmp");
                        tmpDir.emptySync();

                        const srcFile: File = new File(new Directory("tmp/src"), "file.txt");
                        srcFile.writeSync("abc");

                        const dstDir: Directory = new Directory("tmp/dst/foo/bar");

                        const fileTask: FileTask = new FileTask(srcFile, dstDir);
                        fileTask.execute()
                        .then((dstFile: File) => {
                            t.assert(dstFile.existsSync());
                            t.assert(dstFile.absPath.indexOf("tmp/dst/foo/bar") > 0);
                            t.equal(dstFile.readSync(), "abc");
                            t.end();
                        });
                    }
                );

            }
        );

    });

});
