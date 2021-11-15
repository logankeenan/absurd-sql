import {File} from "../sqlite-file";
import {BytesNotAvailable} from "./error";

export class FileOps {
    constructor(filename, meta, databaseBytes) {
        this.filename = filename;
        this.locked = true;
        this.meta = meta;
        this.databaseBytes = databaseBytes;
    }

    lock() {
        return true;
    }

    unlock() {
        return true;
    }

    open() {
    }

    close() {
        return true;
    }

    delete() {
    }

    startStats() {
    }

    stats() {
    }

    readMeta() {
        return this.meta;
    }

    writeMeta(meta) {
    }

    readBlocks(positions, blockSize) {
        const bytes = this.databaseBytes.getBytes(positions, blockSize);

        if (bytes.length === 0) {
            this.databaseBytes.setParamsForNextFetchBytesCall(positions, blockSize);
            throw new BytesNotAvailable("Bytes not in memory");
        }
        return bytes;
    }

    writeBlocks(writes, blockSize) {
    }
}

export default class HttpAsyncBackend {
    constructor(dbLocation, databaseBytes) {
        this.dbLocation = dbLocation;
        this.databaseBytes = databaseBytes;
    }

    async init() {
        const response = await fetch(this.dbLocation, {
            method: "HEAD",
        })
        this.fileSize = response.headers.get("content-length");
    }

    createFile(filename) {
        let meta = {
            size: this.fileSize,
            blockSize: 4096
        };
        this.meta = meta;
        const fileOps = new FileOps(filename, meta, this.databaseBytes);
        this.file = new File(filename, fileOps);
        return this.file
    }

    getFile(filename) {
        return this.file;
    }

    startProfile() {
    }

    stopProfile() {
    }
}