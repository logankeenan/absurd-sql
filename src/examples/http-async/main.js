import AsyncHttpDatabase from "../../http-async/database";

async function start() {
    const start = new Date().getTime();
    const asyncHttpDatabase = new AsyncHttpDatabase("http://localhost:8080/bench/db.sqlite", 4096);
    await asyncHttpDatabase.init();

    const results = await asyncHttpDatabase.exec("select * from kv limit 1000");
    console.log("results", results);
    console.log(`${new Date().getTime() - start}ms`);
}

start();