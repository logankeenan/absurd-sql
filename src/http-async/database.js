import HttpBackend from "./backend";
import initSqlJs from "@jlongster/sql.js/dist/sql-wasm";
import {SQLiteFS} from "../index";
import {BytesNotAvailable} from "./error";
import DatabaseBytes from "./databaseBytes";

const dbName = `http-async`;

export default class AsyncHttpDatabase {
    constructor(dbLocation) {
        this.databaseBytes = new DatabaseBytes(dbLocation);
        this.httpAsyncBackend = new HttpBackend(dbLocation, this.databaseBytes);
    }

    async init() {
        await this.httpAsyncBackend.init();
        this.SQL = await initSqlJs({locateFile: file => file});
        const sqlFS = new SQLiteFS(this.SQL.FS, this.httpAsyncBackend);
        this.SQL.register_for_idb(sqlFS);
        this.SQL.FS.mkdir('/blocked');
        this.SQL.FS.mount(sqlFS, {}, '/blocked');
    }

    async executer(fn) {
        try {
            return await fn();
        } catch (e) {
            if (e instanceof BytesNotAvailable) {
                await this.databaseBytes.fetchBytes();
                return this.executer(fn)
            }
            throw e;
        }
    }

    async create() {
        return await this.executer(function() {
            return new this.SQL.Database(`/blocked/${dbName}`, {filename: true});
        }.bind(this));
    }

    async exec(query) {
        return this.executer(async function () {
            const db = await this.create();
            return db.exec(query);
        }.bind(this))
    }
}