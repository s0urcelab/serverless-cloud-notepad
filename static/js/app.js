const errHandle = (err) => {
    alert(`Save Fail: ${err}`)
}
const throttle = (func, delay) => {
    let tid = null

    return (...arg) => {
        if (tid) return;
        
        tid = setTimeout(() => {
            func(...arg)
            tid = null
        }, delay)
    }
}

window.addEventListener('DOMContentLoaded', function() {
    const $textarea = document.querySelector('#contents')
    const $loading = document.querySelector('#loading')

    $textarea.oninput = throttle(function() {
        $loading.style.display = 'inline-block'
        const data = {
            t: $textarea.value,
        }

        window.fetch('', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams(data),
        })
            .then(res => res.json())
            .then(res => {
                if (res.errCode !== 0) {
                    errHandle(res.message)
                }
            })
            .catch(err => errHandle(err))
            .finally(() => {
                $loading.style.display = 'none'
            })
    }, 1000)
})
