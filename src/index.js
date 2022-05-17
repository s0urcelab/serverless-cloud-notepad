import dayjs from 'dayjs'
import { Router } from 'itty-router'
import Cookies from 'cookie'
import jwt from '@tsndr/cloudflare-worker-jwt'
import { queryNote, MD5, checkAuth, genRandomStr, returnPage, returnJSON, saltPw } from './helper'
import { SECRET } from './constant'

// init
const router = Router()

router.get('/', ({ url }) => {
    const newHash = genRandomStr(3)
    // redirect to new page
    return Response.redirect(`${url}${newHash}`, 302)
})

router.get('/share/:md5', async ({ params }) => {
    const { md5 } = params
    const path = await SHARE.get(md5)

    if (!!path) {
        const { value, metadata } = await queryNote(path)

        return returnPage('Share', {
            title: decodeURIComponent(path),
            content: value,
            ext: metadata,
        })
    }

    return returnPage('Page404', { title: '404' })
})

router.get('/:path', async ({ params, headers }) => {
    const { path } = params
    const title = decodeURIComponent(path)

    const cookie = Cookies.parse(headers.get('Cookie') || '')

    const { value, metadata } = await queryNote(path)

    if (!metadata.pw) {
        return returnPage('Edit', {
            title,
            content: value,
            ext: metadata,
        })
    }

    const valid = await checkAuth(cookie, path)
    if (valid) {
        return returnPage('Edit', {
            title,
            content: value,
            ext: metadata,
        })
    }

    return returnPage('NeedPasswd', { title })
})

router.post('/:path/auth', async request => {
    const { path } = request.params
    if (request.headers.get('Content-Type') === 'application/json') {
        const { passwd } = await request.json()

        const { metadata } = await queryNote(path)

        if (metadata.pw) {
            const storePw = await saltPw(passwd)

            if (metadata.pw === storePw) {
                const token = await jwt.sign({ path }, SECRET)
                return returnJSON(0, {
                    refresh: true,
                }, {
                    'Set-Cookie': Cookies.serialize('auth', token, {
                        path: `/${path}`,
                        expires: dayjs().add(7, 'day').toDate(),
                        httpOnly: true,
                    })
                })
            }
        }
    }

    return returnJSON(10002, 'Password auth failed!')
})

router.post('/:path/pw', async request => {
    const { path } = request.params
    if (request.headers.get('Content-Type') === 'application/json') {
        const cookie = Cookies.parse(request.headers.get('Cookie') || '')
        const { passwd } = await request.json()

        const { value, metadata } = await queryNote(path)
        const valid = await checkAuth(cookie, path)
        
        if (!metadata.pw || valid) {
            const pw = passwd ? await saltPw(passwd) : undefined
            try {
                await NOTES.put(path, value, {
                    metadata: {
                        ...metadata,
                        pw,
                    },
                })
    
                return returnJSON(0, null, {
                    'Set-Cookie': Cookies.serialize('auth', '', {
                        path: `/${path}`,
                        expires: dayjs().subtract(100, 'day').toDate(),
                        httpOnly: true,
                    })
                })
            } catch (error) {
                console.error(error)
            }
        }

        return returnJSON(10003, 'Password setting failed!')
    }
})

router.post('/:path/setting', async request => {
    const { path } = request.params
    if (request.headers.get('Content-Type') === 'application/json') {
        const cookie = Cookies.parse(request.headers.get('Cookie') || '')
        const { mode, share } = await request.json()

        const { value, metadata } = await queryNote(path)
        const valid = await checkAuth(cookie, path)
        
        if (!metadata.pw || valid) {
            try {
                await NOTES.put(path, value, {
                    metadata: {
                        ...metadata,
                        ...mode !== undefined && { mode },
                        ...share !== undefined && { share },
                    },
                })

                const md5 = await MD5(path)
                if (share) {
                    await SHARE.put(md5, path)
                    return returnJSON(0, md5)
                }
                if (share === false) {
                    await SHARE.delete(md5)
                }


                return returnJSON(0)
            } catch (error) {
                console.error(error)
            }
        }

        return returnJSON(10004, 'Update Setting failed!')
    }
})

router.post('/:path', async request => {
    const { path } = request.params

    const formData = await request.formData();
    const content = formData.get('t')

    const { metadata } = await queryNote(path)

    try {
        await NOTES.put(path, content, {
            metadata: {
                ...metadata,
                updateAt: dayjs().unix(),
            },
        })

        return returnJSON(0)
    } catch (error) {
        console.error(error)
    }

    return returnJSON(10001, 'KV insert fail!')
})

router.all('*', () => returnPage('Page404', { title: '404' }))

addEventListener('fetch', event => {
    event.respondWith(router.handle(event.request))
})