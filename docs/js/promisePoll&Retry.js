function limitConcurrentRequests(urls, maxConcurrent, fetchFunction) {
    let index = 0;
    let activeRequests = 0;
    const results = [];
    const queue = [];

    function enqueue() {
        if (index >= urls.length) {
            return Promise.resolve();
        }

        const currentIndex = index++;
        const url = urls[currentIndex];
        const requestPromise = fetchFunction(url)
            .then(result => {
                results[currentIndex] = result;
            })
            .catch(error => {
                results[currentIndex] = error;
            })
            .finally(() => {
                activeRequests--;
                if (queue.length > 0) {
                    queue.shift()();
                }
            });

        activeRequests++;
        if (activeRequests < maxConcurrent) {
            enqueue();
        } else {
            queue.push(enqueue);
        }

        return requestPromise;
    }

    const initialPromises = Array.from({ length: Math.min(maxConcurrent, urls.length) }, enqueue);
    return Promise.all(initialPromises).then(() => results);
}

// 使用示例
const urls = ['https://example.com/1', 'https://example.com/2', 'https://example.com/3'];
const maxConcurrent = 2;

limitConcurrentRequests(urls, maxConcurrent, fetch)
    .then(results => {
        console.log(results);
    })
    .catch(error => {
        console.error(error);
    });
