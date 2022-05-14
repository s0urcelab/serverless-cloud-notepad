// use my repo jsdelivr or you can set cdn yourself
const CDN_PREFIX = 'cdn.jsdelivr.net/gh/s0urcelab/serverless-cloud-notepad@v1.0.0/static'

addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
});

const genHash = n => {
    // remove char that confuse user
    const charset = '2345679abcdefghjkmnpqrstwxyz'
    return Array(n)
        .join()
        .split(',')
        .map(() => charset.charAt(Math.floor(Math.random() * charset.length)))
        .join('')
}

const html = (path, content) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${decodeURI(path)} — Cloud Notepad</title>
    <link href="//${CDN_PREFIX}/favicon.ico" rel="shortcut icon" type="image/ico" />
    <link href="//${CDN_PREFIX}/css/normalize.min.css" rel="stylesheet" media="screen" />
    <link href="//${CDN_PREFIX}/css/app.min.css" rel="stylesheet" media="screen" />
</head>
<body>
    <div class="stack">
        <div class="layer_1">
            <div class="layer_2">
                <div class="layer_3">
                    <textarea name="contents" id="contents" class="contents" spellcheck="true" placeholder="看起来你是第一个到达这里的人！留下点什么吧...">${content}</textarea>
                </div>
            </div>
        </div>
    </div>
    <div id="loading"></div>
    <script src="//${CDN_PREFIX}/js/app.min.js"></script>
</body>
</html>
`

async function returnPage(path, content) {
    return new Response(html(path, content), {
        headers: {
            'content-type': 'text/html;charset=UTF-8',
        },
    });
}

async function returnJSON(json) {
    return new Response(JSON.stringify(json), {
        headers: {
            'content-type': 'application/json;charset=UTF-8',
        },
    })
}

async function handleRequest(request) {
    const url = new URL(request.url);

    // GET read note
    if (request.method === 'GET') {
        // random new hash
        if (url.pathname === '/') {
            const newHash = genHash(3)

            // redirect to new page
            return Response.redirect(`${url.href}${newHash}`, 302);
        }

        const slashIdx = url.pathname.slice(1).indexOf('/')
        const nextPath = !!~slashIdx ? url.pathname.slice(0, slashIdx + 1) : url.pathname

        // redirect to fixed path
        if (url.pathname !== nextPath) {
            return Response.redirect(`${url.href}${nextPath}`, 302);
        }

        // query content
        const queryKey = url.pathname.slice(1)
        const content = await NOTES.get(queryKey) || ''

        return returnPage(queryKey, content)
    }

    // POST modify note
    if (request.method === 'POST') {
        let saveFlag = true

        const formData = await request.formData();
        const saveText = formData.get('t')
        const savePath = url.pathname.slice(1)

        try {
            await NOTES.put(savePath, saveText)
        } catch (error) {
            console.log(error)
            saveFlag = false
        }

        const success = {
            errCode: 0,
            message: 'ok',
            padname: savePath,
        }

        const fail = {
            errCode: 1,
            message: 'kv database put error!',
        }

        return returnJSON(saveFlag ? success : fail)
    }
}