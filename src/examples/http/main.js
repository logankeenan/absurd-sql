let worker = new Worker(new URL('./main.worker.js', import.meta.url));
worker.postMessage("")
