const dbRelativeLocation = "http://localhost:8080/bench/db.sqlite";

export function httpReadSync(position, blockSize) {
    const request = new XMLHttpRequest();
    request.open("GET", dbRelativeLocation, false);
    request.setRequestHeader("Range", `bytes=${position}-${position + blockSize - 1}`);
    request.responseType = "arraybuffer";
    if (request.overrideMimeType) {
        request.overrideMimeType("text/plain; charset=x-user-defined");
    }
    request.send();
    return request.response;
}

export async function httpFileSize() {
    const response = await fetch(dbRelativeLocation, {
        method: "HEAD",
    })
    return response.headers.get("content-length");
}

