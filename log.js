function printDate() {
    const now = new Date()
    return now.toISOString()
}

function log(name, ...args) {
    console.log(`[${printDate()}] [${name}] --`, ...args)
}

export default {
    new(name = "main") {
        return (...args) => log(name, ...args)
    }
}