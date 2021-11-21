import Logger from "../log.js"
import createTransport from "./transport.js"

const debug = Logger.new("ws-client")
const error = Logger.new("ws-client ERROR")

function date() {
    return (new Date()).toISOString()
}

function updateOut(out) {
    return d => {
        out.innerHTML += `<p>${date()}: ${d}</p>`
    }
}

function sendMessage(source, dest) {
    const transport = createTransport()

    return async evt => {
        evt.preventDefault()
        evt.stopPropagation()

        debug.log("send message", source.value)
        try {
            if (source.value === "") {
                debug.log("value is empty");
                return;
            }

            const res = await transport.send(source.value)
            dest(res)
            source.value = ""
        } catch (e) {
            debug.log("request failed", e)
        }
    }
}

const msg = document.querySelector("#msg")
const out = document.querySelector("#out")
const btn = document.querySelector("#snd")

const clickHandler = sendMessage(msg, msg => updateOut(out)(msg))

btn.addEventListener(
    "click",
    async ev => {
        btn.setAttribute("disabled", "")
        try {
            await clickHandler(ev)
        } catch (e) {
            error.log("send message failed", e)
        }
        btn.removeAttribute("disabled")
    },
)

debug.log("loaded")