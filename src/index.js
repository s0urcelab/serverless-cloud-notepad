addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
});

const genHash = n => {
    const charset = '2345679abcdefghjkmnpqrstwxyz'
    return Array(n)
        .join()
        .split(',')
        .map(() => charset.charAt(Math.floor(Math.random() * charset.length)))
        .join('')
}

const html = content => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Pad</title>
    <link href="//cdn.jsdelivr.net/gh/s0urcelab/serverless-cloud-notepad/static/favicon.ico" rel="shortcut icon" type="image/ico" />
    <link href="//cdn.jsdelivr.net/gh/s0urcelab/serverless-cloud-notepad/static/css/normalize.css" rel="stylesheet" media="screen" />
    <link href="//cdn.jsdelivr.net/gh/s0urcelab/serverless-cloud-notepad/static/css/app.css" rel="stylesheet" media="screen" />
</head>
<body>
    <div class="stack">
        <div class="layer_1">
            <div class="layer_2">
                <div class="layer_3">
                    <textarea name="contents" id="contents" class="contents" spellcheck="true">${content}</textarea>
                </div>
            </div>
        </div>
    </div>
    <div id="loading"></div>

    <script src="//cdn.jsdelivr.net/gh/jquery/jquery/dist/jquery.min.js"></script>
    <script src="//cdn.jsdelivr.net/gh/s0urcelab/serverless-cloud-notepad/static/js/app.js"></script>
</body>
</html>
`

async function returnPage(content) {
    return new Response(html(content), {
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
        const queryKey = nextPath.slice(1)
        const content = await NOTES.get(queryKey) || ''

        return returnPage(content)
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
            message: "ok",
            padname: savePath,
        }

        const fail = {
            errCode: 1,
            message: "error occur",
        }

        return returnJSON(saveFlag ? success : fail)
    }
}