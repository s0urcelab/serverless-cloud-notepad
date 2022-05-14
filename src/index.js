// use my repo jsdelivr or you can set cdn yourself
const CDN_PREFIX = 'cdn.jsdelivr.net/gh/s0urcelab/serverless-cloud-notepad@site/static'

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
                    <textarea name="contents" id="contents" class="contents" spellcheck="true" placeholder="看来你是第一个到这儿的人，写点什么吧...">${content}</textarea>
                </div>
            </div>
        </div>
    </div>
    <div id="loading"></div>
    <div class="footer-github-link">
        <a title="github" target="_blank" href="https://github.com/s0urcelab/serverless-cloud-notepad" rel="noreferrer"><span role="img" aria-label="github" class="anticon anticon-github"><svg viewBox="64 64 896 896" focusable="false" data-icon="github" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M511.6 76.3C264.3 76.2 64 276.4 64 523.5 64 718.9 189.3 885 363.8 946c23.5 5.9 19.9-10.8 19.9-22.2v-77.5c-135.7 15.9-141.2-73.9-150.3-88.9C215 726 171.5 718 184.5 703c30.9-15.9 62.4 4 98.9 57.9 26.4 39.1 77.9 32.5 104 26 5.7-23.5 17.9-44.5 34.7-60.8-140.6-25.2-199.2-111-199.2-213 0-49.5 16.3-95 48.3-131.7-20.4-60.5 1.9-112.3 4.9-120 58.1-5.2 118.5 41.6 123.2 45.3 33-8.9 70.7-13.6 112.9-13.6 42.4 0 80.2 4.9 113.5 13.9 11.3-8.6 67.3-48.8 121.3-43.9 2.9 7.7 24.7 58.3 5.5 118 32.4 36.8 48.9 82.7 48.9 132.3 0 102.2-59 188.1-200 212.9a127.5 127.5 0 0138.1 91v112.5c.8 9 0 17.9 15 17.9 177.1-59.7 304.6-227 304.6-424.1 0-247.2-200.4-447.3-447.5-447.3z"></path></svg></span></a>
    </div>
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