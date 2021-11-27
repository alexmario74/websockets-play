import Logger from "./log.js"
import http from "http"
import fs from "fs"
import pkg from "websocket"

const WebSocketServer = pkg.server

const debug = Logger.new("ws-server")
const port = 8080

const server = http.createServer((req, res) => {
    debug("received request", `HTTP/${req.httpVersion}`, req.method, req.url)

    let fileName = req.url
    if (fileName === "/") {
        fileName = "index.html"
    }

    fs.readFile(`./${fileName}`, (err, data) => {
        if (err) {
            debug("ERROR request not found")
            res.writeHead(404)
            res.end("Request not found")
        } else {
            res.writeHead(200, {
                "Content-Type": fileName.endsWith(".html") ?
                    "text/html" :
                    "application/javascript",
            })
            res.end(data)
        }
    })
})

const ws = new WebSocketServer({
    httpServer: server
})

ws.on("request", request => {
    debug("\tws received request...")

    const conn = request.accept()
    conn.on('message', message => {
        if (message.type === 'utf8') {
            debug('\t Received Message: ', message.utf8Data)
            setTimeout(() => conn.sendUTF(message.utf8Data), 100 + (Math.floor(Math.random() * 10000)))
        } else if (message.type === 'binary') {
            debug('Received Binary Message of ', message.binaryData.length, ' bytes')
            conn.sendBytes(message.binaryData)
        }
    })
    conn.on('close', (reasonCode, description) => {
        debug('\t Peer ', conn.remoteAddress, ' disconnected.');
    })
})

server.listen(port, () => {
    debug("server is now listening on", port)
})