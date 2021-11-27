export default function retry(t, maxAttempts, timeout) {
    if (maxAttempts === 0) {
        throw new Error("max attempts reached")
    }
    setTimeout(() => {
        if (!t()) {
            retry(t, maxAttempts - 1, timeout)
        }
    }, timeout)
}