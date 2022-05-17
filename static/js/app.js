const errHandle = (err) => {
    alert(`Error: ${err}`)
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

const passwdPrompt = () => {
    const passwd = window.prompt('Please enter password')
    if (passwd == null) return;

    if (!passwd.trim()) {
        alert('password can not be empty!')
    }
    const path = location.pathname
    window.fetch(`${path}/auth`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            passwd,
        }),
    })
        .then(res => res.json())
        .then(res => {
            if (res.err !== 0) {
                return errHandle(res.msg)
            }
            if (res.data.refresh) {
                window.location.reload()
            }
        })
        .catch(err => errHandle(err))
}

const renderPlain = (node, text) => {
    if (node) {
        node.innerHTML = DOMPurify.sanitize(text)
    }
}

const renderMarkdown = (node, text) => {
    if (node) {
        const parseText = marked.parse(text)
        node.innerHTML = DOMPurify.sanitize(parseText)
    }
}

window.addEventListener('DOMContentLoaded', function () {
    const $textarea = document.querySelector('#contents')
    const $loading = document.querySelector('#loading')
    const $pwBtn = document.querySelector('.opt-pw')
    const $modeBtn = document.querySelector('.opt-mode > input')
    const $shareBtn = document.querySelector('.opt-share > input')
    const $previewPlain = document.querySelector('#preview-plain')
    const $previewMd = document.querySelector('#preview-md')

    renderPlain($previewPlain, $textarea.value)
    renderMarkdown($previewMd, $textarea.value)

    if ($textarea) {
        $textarea.oninput = throttle(function () {
            renderMarkdown($previewMd, $textarea.value)

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
                    if (res.err !== 0) {
                        errHandle(res.msg)
                    }
                })
                .catch(err => errHandle(err))
                .finally(() => {
                    $loading.style.display = 'none'
                })
        }, 1000)
    }

    if ($pwBtn) {
        $pwBtn.onclick = function () {
            const passwd = window.prompt('Enter a new password(keep empty will remove current password)')
            if (passwd == null) return;

            const path = window.location.pathname
            window.fetch(`${path}/pw`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    passwd: passwd.trim(),
                }),
            })
                .then(res => res.json())
                .then(res => {
                    if (res.err !== 0) {
                        return errHandle(res.msg)
                    }
                    alert(`Password ${passwd ? 'setting' : 'remove'} success!`)
                })
                .catch(err => errHandle(err))
        }
    }

    if ($modeBtn) {
        $modeBtn.onclick = function (e) {
            const isMd = e.target.checked
            const path = window.location.pathname
            window.fetch(`${path}/setting`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    mode: isMd ? 'md' : 'plain',
                }),
            })
                .then(res => res.json())
                .then(res => {
                    if (res.err !== 0) {
                        return errHandle(res.msg)
                    }

                    window.location.reload()
                })
                .catch(err => errHandle(err))
        }
    }
    
    if ($shareBtn) {
        $shareBtn.onclick = function (e) {
            const isShare = e.target.checked
            const path = window.location.pathname
            window.fetch(`${path}/setting`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    share: isShare,
                }),
            })
                .then(res => res.json())
                .then(res => {
                    if (res.err !== 0) {
                        return errHandle(res.msg)
                    }

                    if (isShare) {
                        const shouldCopy = confirm('Confirm to copy Share Link to your clipboard')
                        if (shouldCopy) {
                            const origin = window.location.origin
                            clipboardCopy(`${origin}/share/${res.data}`)

                            alert('Copy Success!');
                        }
                    }
                })
                .catch(err => errHandle(err))
        }
    }

})
