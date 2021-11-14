import HttpBackend from "../../http/backend";
import initSqlJs from '@jlongster/sql.js/dist/sql-wasm-debug';
import {SQLiteFS} from '../../index.js';
import {httpFileSize} from "../../http/utils";

self.onmessage = async function(e) {
    let dbName = `http`;
    let fileSize = await httpFileSize();
    const httpBackend = new HttpBackend(fileSize);
    const SQL = await initSqlJs({locateFile: file => file});
    const sqlFS = new SQLiteFS(SQL.FS, httpBackend);
    SQL.register_for_idb(sqlFS);
    SQL.FS.mkdir('/blocked');
    SQL.FS.mount(sqlFS, {}, '/blocked');
    const db = new SQL.Database(`/blocked/${dbName}`, {filename: true});

    const results = db.exec(`select * from kv`);

    console.log("results", results);
}
