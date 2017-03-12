import * as Promise from "bluebird";
import {Datestamp} from "./datestamp";

// No .d.ts file available for exif package.
// tslint:disable-next-line:variable-name no-require-imports no-var-requires
const ExifImage: any = require("exif").ExifImage;


const dateRegex: RegExp = /(\d{4}):(\d{2}):(\d{2})/;

/**
 * Gets a Datestamp for the specified image file.
 * @param {string} imageFile - The path to the file to query
 * @returns {Promise<Datestamp>} A Promise for a Datestamp corresponding to the
 * CreateDate within the image's exif data.  The Promise will reject if it could
 * not be obtained.
 */
export function getCreateDate(imageFile: string): Promise<Datestamp> {
    "use strict";

    return new Promise<Datestamp>((resolve, reject) => {

        try {
            // tslint:disable-next-line:no-unused-new
            new ExifImage({image: imageFile}, (err: any, exifData: any) => {

                if (err) {
                    reject(err);
                    return;
                }

                const matches: RegExpExecArray | null = dateRegex.exec(exifData.exif.CreateDate);
                if (matches) {
                    const datestamp: Datestamp = Datestamp.fromYMD(
                        parseInt(matches[1], 10), parseInt(matches[2], 10), parseInt(matches[3], 10));
                    resolve(datestamp);
                } else {
                    reject("Unknown CreateDate string format");
                }

            });
        } catch (error) {
            reject(error);
        }

    });

}
