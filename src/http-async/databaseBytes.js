export default class DatabaseBytes {
    constructor(dbLocation) {
        this.dbLocation = dbLocation;
        this.bytePositions = {}
    }

    async fetchBytes() {
        for (let i = 0; i < this.positions.length; i++) {
            const position = this.positions[i];
            let headers = new Headers();
            headers.append("Range", `bytes=${position}-${position + this.blockSize - 1}`);
            const response = await fetch(this.dbLocation, {
                method: "GET",
                headers: headers
            });

            this.bytePositions[position] = await response.arrayBuffer();
        }

        this.positions = undefined;
        this.blockSize = undefined;
    }

    getBytes(positions) {
        return positions.map((position) => {
            let bytePosition = this.bytePositions[position];

            if (bytePosition) {
                return {
                    pos: position,
                    data: bytePosition
                }
            }

            return false;
        }).filter(Boolean);
    }

    setParamsForNextFetchBytesCall(positions, blockSize) {
        this.positions = positions;
        this.blockSize = blockSize;
    }
}