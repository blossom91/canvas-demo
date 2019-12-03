exports.load = function(url) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest()
        xhr.responseType = 'arraybuffer'
        xhr.onreadystatechange = () => {
            if (xhr.readyState == 4) {
                resolve(xhr.response)
            }
        }
        xhr.onerror = reject
        xhr.open('GET', url, true)
        xhr.send()
    })
}
