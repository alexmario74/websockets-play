import Logger from "../log.js"
import retry from "./retry.js"

const debug = Logger.new("ws transport")
const error = Logger.new("ws transport ERROR")

function WsHandler(address = "ws://localhost:8080") {
    let ws = null
    let status = WebSocket.CLOSED
    const session = []

    function open({ target: ws }) {
        status = ws.readyState
        debug("transport connection open", ws)
    }

    function close({ target: ws }) {
        status = ws.readyState
        debug("transport connection closed");
    }

    function message({ data: message }) {
        debug("transport received message", message)
        const reqHandler = session.pop()
        reqHandler(message)
    }

    function bind(o) {
        o.onopen = open
        o.onclose = close
        o.onmessage = message
    }

    async function connect() {
        ws = new WebSocket(address)
        bind(ws)
        return new Promise((resolve, reject) => {
            retry(() => {
                if (status === WebSocket.OPEN) {
                    resolve(ws)
                    return true
                }
                return false
            }, 3, 200)
        })
    }

    ws = new WebSocket(address)

    bind(ws)

    return {
        async send(msg) {
            return new Promise(async(resolve, reject) => {
                    session.push(message => {
                        debug("resolve send")
                        resolve(message)
                    })
                    if (status !== WebSocket.OPEN) {
                        ws = await connect()
                        if (ws.readyState !== WebSocket.OPEN) {
                            return reject("cannot open connection")
                        }
                    }
                    ws.send(msg)
                    setTimeout(() => {
                        reject("timeout", 30, "sec.")
                    }, 30000)
                })
                .catch(e => {
                    error("cannot send message", msg, "because", e)
                })
        }
    }
}

export default function createTransport(f) {
    const ws = WsHandler(f)

    return ws
}