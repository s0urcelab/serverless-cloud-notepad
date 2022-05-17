import jwt from '@tsndr/cloudflare-worker-jwt'
import * as TEMPL from './template'
import { SALT, SECRET } from './constant'

// generate random string
export const genRandomStr = n => {
    // remove char that confuse user
    const charset = '2345679abcdefghjkmnpqrstwxyz'
    return Array(n)
        .join()
        .split(',')
        .map(() => charset.charAt(Math.floor(Math.random() * charset.length)))
        .join('')
}

export function returnPage(type, data) {
    return new Response(TEMPL[type](data), {
        headers: {
            'content-type': 'text/html;charset=UTF-8',
        },
    });
}

export function returnJSON(code, data, headers = {}) {
    const successTempl = {
        err: 0,
        msg: 'ok',
        ...data && { data },
    }
    const errTempl = {
        err: code,
        msg: JSON.stringify(data),
    }
    const ret = code ? errTempl : successTempl
    return new Response(JSON.stringify(ret), {
        headers: {
            'content-type': 'application/json;charset=UTF-8',
            ...headers,
        },
    })
}

export async function MD5(str) {
    const msgUint8 = new TextEncoder().encode(str) // encode as (utf-8) Uint8Array
    const hashBuffer = await crypto.subtle.digest('MD5', msgUint8) // hash the message
    const hashArray = Array.from(new Uint8Array(hashBuffer)) // convert buffer to byte array
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('') // convert bytes to hex string
}

export async function saltPw(password) {
    const hashPw = await MD5(password)
    return await MD5(`${hashPw}+${SALT}`)
}

export async function checkAuth(cookie, path) {
    if (cookie.auth) {
        const valid = await jwt.verify(cookie.auth, SECRET)
        if (valid) {
            const payload = jwt.decode(cookie.auth)
            if (payload.path === path) {
                return true
            }
        }
    }
    return false
}

export async function queryNote(key) {
    const result = await NOTES.getWithMetadata(key)
    return {
        value: result.value || '',
        metadata: result.metadata || {},
    }
}

