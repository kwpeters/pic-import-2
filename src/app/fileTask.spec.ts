import {File} from "../lib/depot/file";
import {Directory} from "../lib/depot/directory";
import {FileTask, FileOperation} from "./fileTask";


describe("FileTask", () => {


    describe("instance", () => {


        it("is creatable", () => {
            const fileTask = new FileTask(new File("src.txt"), new File("dest.txt"));
            expect(fileTask).toBeTruthy();
        });


        it("srcFile will return the value passed into the constructor", () => {
            const fileTask = new FileTask(new File("src.txt"), new File("dest.txt"));
            expect(fileTask.srcFile.toString()).toEqual("src.txt");
        });


        it("dstFile will return the file passed into the constructor", () => {
            const fileTask = new FileTask(new File("src.txt"), new File("dest.txt"));
            expect(fileTask.dstFile.toString()).toEqual("dest.txt");
        });


        it("dstFile will use the file name of the source when a destination Directory is specified", () => {
            const fileTask = new FileTask(new File("src.txt"), new Directory(".."));
            expect(fileTask.dstFile.toString()).toEqual("../src.txt");
        });


        it("will default to a copy operation", () => {
            const fileTask = new FileTask(new File("src.txt"), new File("dest.txt"));
            expect(fileTask.operation).toEqual(FileOperation.copy);
        });


        describe("execute()", () => {

            it("will copy a file as expected", (done) => {
                const tmpDir = new Directory("./tmp");
                tmpDir.emptySync();

                const srcFile = new File(new Directory("tmp/src"), "file.txt");
                srcFile.writeSync("abc");

                const dstDir = new Directory("tmp/dst");

                const fileTask = new FileTask(srcFile, dstDir);
                fileTask.execute()
                .then((dstFile) => {
                    expect(dstFile.existsSync()).toBeTruthy();
                    expect(dstFile.readSync()).toEqual("abc");
                    expect(srcFile.existsSync()).toBeTruthy();
                    done();
                });
            });


            it("will move a file as expected", (done) => {
                const tmpDir = new Directory("./tmp");
                tmpDir.emptySync();

                const srcFile = new File(new Directory("tmp/src"), "file.txt");
                srcFile.writeSync("abc");

                const dstDir = new Directory("tmp/dst");

                const fileTask = new FileTask(srcFile, dstDir, FileOperation.move);
                fileTask.execute()
                .then((dstFile) => {
                    expect(dstFile.existsSync()).toBeTruthy();
                    expect(dstFile.readSync()).toEqual("abc");
                    expect(srcFile.existsSync()).toBeFalsy();
                    done();
                });
            });


            it("will create the destination directory when it does not already exist",
                (done) => {
                    const tmpDir = new Directory("./tmp");
                    tmpDir.emptySync();

                    const srcFile = new File(new Directory("tmp/src"),
                        "file.txt");
                    srcFile.writeSync("abc");

                    const dstDir = new Directory("tmp/dst/foo/bar");

                    const fileTask = new FileTask(srcFile, dstDir);
                    fileTask.execute()
                    .then((dstFile) => {
                        expect(dstFile.existsSync()).toBeTruthy();
                        expect(dstFile.absPath().indexOf("tmp/dst/foo/bar")).toBeGreaterThan(0);
                        expect(dstFile.readSync()).toEqual("abc");
                        done();
                    });
                });
            }


        );
    });
});
