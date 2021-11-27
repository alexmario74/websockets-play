export default async function retry(t, maxAttempts, timeout) {
    return new Promise((resolve, reject) => {
        if (maxAttempts === 0) {
            return reject("max attempts reached")
        }

        setTimeout(() => {
            if (!t())
                return retry(t, maxAttempts - 1, timeout)

            resolve(true)
        }, timeout)
    })
}