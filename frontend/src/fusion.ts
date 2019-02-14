// SocketManager wraps a WebSocket in order to provide guarantees about
// reliability, reconnections, retries, etc.
class SocketManager {
    ws: WebSocket
    url: string

    constructor(url: string) {
        this.url = url;
        this.ws = this.createSocket();
    }

    createSocket() {
        const ws = new WebSocket(this.url);
        ws.onopen = event => {
            // console.log("socket connected", event);
        };
        ws.onmessage = event => {
            // console.log(event);
        }
        ws.onerror = event => {
            // console.log("socket error", event);
        };
        ws.onclose = event => {
            // console.log("socket closed", event);
            this.ws = this.createSocket();
        };
        return ws;
    }

    send(msg: string) {
        this.ws.send(msg);
    }
}

export default class Fusion {
    ws: SocketManager;
    track = this.generateUUID();

    constructor() {
        console.log("Fusion created.");

        this.ws = new SocketManager("ws://localhost:8080/fusion");

        // this.startSocket();
        this.startGeolocation();
    }

    startGeolocation() {
        const options = { enableHighAccuracy: true, maximumAge: 0 };
        navigator.geolocation.watchPosition(
            position => {
                const data = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    heading: position.coords.heading,
                    speed: position.coords.speed,
                    track: this.track,
                };
                this.ws.send(JSON.stringify(data));
            },
            error => {
                // console.log("could not get position", error);
            }, options
        )
    }

    generateUUID() {
        var d = new Date().getTime();
        if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
            d += performance.now(); //use high-precision timer if available
        }
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }
}