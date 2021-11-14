import {File} from "../sqlite-file";
import {httpReadSync} from "./utils";

export class FileOps {
    constructor(filename, meta) {
        this.filename = filename;
        this.locked = true;
        this.meta = meta;
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

    writeMeta(meta) {}

    readBlocks(positions, blockSize) {
        return positions.map(pos => {
            let buffer = httpReadSync(pos, blockSize);
            return {pos, data: buffer};
        });
    }

    writeBlocks(writes, blockSize) {
    }
}

export default class HttpBackend {
    constructor(fileSize) {
        this.fileSize = fileSize;
    }

    createFile(filename) {
        let meta = {
            size: this.fileSize,
            blockSize: 4096
        };
        this.meta = meta;
        const fileOps = new FileOps(filename, meta);
        this.file = new File(filename, fileOps);;
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
