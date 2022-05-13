const errHandle = (err) => {
    alert(`Save Fail: ${err}`)
}

window.addEventListener('DOMContentLoaded', function() {
    const $textarea = document.querySelector('#contents')
    const $loading = document.querySelector('#loading')
    const originText = $textarea.value

    $textarea.oninput = function() {
        if ($textarea.value !== originText) {

            $loading.style.display = 'inline-block'
            const data = {
                t: $textarea.value,
            }
            window.fetch('/', {
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
        }
    }
})
