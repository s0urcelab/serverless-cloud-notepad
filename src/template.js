import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { CDN_PREFIX, SUPPORTED_LANG } from './constant'

dayjs.extend(relativeTime)

const SWITCHER = (text, open, className = '') => `
<span class="opt-desc">${text}</span>
<label class="opt-switcher ${className}">
  <input type="checkbox" ${open ? 'checked' : ''}>
  <span class="slider round"></span>
</label>
`
const FOOTER = ({ lang, isEdit, updateAt, pw, mode, share }) => `
    <div class="footer">
        ${isEdit ? `
            <div class="opt">
                <button class="opt-button opt-pw">${pw ? SUPPORTED_LANG[lang].changePW : SUPPORTED_LANG[lang].setPW}</button>
                ${SWITCHER('Markdown', mode === 'md', 'opt-mode')}
                ${SWITCHER(SUPPORTED_LANG[lang].share, share, 'opt-share')}
            </div>
            ` : ''
    }
        <a class="github-link" title="Github" target="_blank" href="https://github.com/s0urcelab/serverless-cloud-notepad" rel="noreferrer">
            <svg viewBox="64 64 896 896" focusable="false" data-icon="github" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M511.6 76.3C264.3 76.2 64 276.4 64 523.5 64 718.9 189.3 885 363.8 946c23.5 5.9 19.9-10.8 19.9-22.2v-77.5c-135.7 15.9-141.2-73.9-150.3-88.9C215 726 171.5 718 184.5 703c30.9-15.9 62.4 4 98.9 57.9 26.4 39.1 77.9 32.5 104 26 5.7-23.5 17.9-44.5 34.7-60.8-140.6-25.2-199.2-111-199.2-213 0-49.5 16.3-95 48.3-131.7-20.4-60.5 1.9-112.3 4.9-120 58.1-5.2 118.5 41.6 123.2 45.3 33-8.9 70.7-13.6 112.9-13.6 42.4 0 80.2 4.9 113.5 13.9 11.3-8.6 67.3-48.8 121.3-43.9 2.9 7.7 24.7 58.3 5.5 118 32.4 36.8 48.9 82.7 48.9 132.3 0 102.2-59 188.1-200 212.9a127.5 127.5 0 0138.1 91v112.5c.8 9 0 17.9 15 17.9 177.1-59.7 304.6-227 304.6-424.1 0-247.2-200.4-447.3-447.5-447.3z"></path></svg>
        </a>
        ${updateAt ? `<span class="last-modified">${SUPPORTED_LANG[lang].lastModified} ${dayjs.unix(updateAt).fromNow()}</span>` : ''}
    </div>
`
const MODAL = lang => `
<div class="modal share-modal">
    <div class="modal-mask"></div>
    <div class="modal-content">
        <span class="close-btn">x</span>
        <div class="modal-body">
            <input type="text" readonly value="" />
            <button class="opt-button">${SUPPORTED_LANG[lang].copy}</button>
        </div>
    </div>
</div>
`
const HTML = ({ lang, title, content, ext = {}, tips, isEdit, showPwPrompt }) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title} — Cloud Notepad</title>
    <link href="${CDN_PREFIX}/favicon.ico" rel="shortcut icon" type="image/ico" />
    <link href="${CDN_PREFIX}/css/app.min.css" rel="stylesheet" media="screen" />
</head>
<body>
    <div class="note-container">
        <div class="stack">
            <div class="layer_1">
                <div class="layer_2">
                    <div class="layer_3">
                        ${tips ? `<div class="tips">${tips}</div>` : ''}
                        <textarea id="contents" class="contents ${isEdit ? '' : 'hide'}" spellcheck="true" placeholder="${SUPPORTED_LANG[lang].emptyPH}">${content}</textarea>
                        ${(isEdit && ext.mode === 'md') ? '<div class="divide-line"></div>' : ''}
                        ${tips || (isEdit && ext.mode !== 'md') ? '' : `<div id="preview-${ext.mode || 'plain'}" class="contents"></div>`}
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div id="loading"></div>
    ${MODAL(lang)}
    ${FOOTER({ ...ext, isEdit, lang })}
    ${(ext.mode === 'md' || ext.share) ? `<script src="${CDN_PREFIX}/js/purify.min.js"></script>` : ''}
    ${ext.mode === 'md' ? `<script src="${CDN_PREFIX}/js/marked.min.js"></script>` : ''}
    <script src="${CDN_PREFIX}/js/clip.min.js"></script>
    <script src="${CDN_PREFIX}/js/app.min.js"></script>
    ${showPwPrompt ? '<script>passwdPrompt()</script>' : ''}
</body>
</html>
`

export const Edit = data => HTML({ isEdit: true, ...data })
export const Share = data => HTML(data)
export const NeedPasswd = data => HTML({ tips: SUPPORTED_LANG[data.lang].tipEncrypt, showPwPrompt: true, ...data })
export const Page404 = data => HTML({ tips: SUPPORTED_LANG[data.lang].tip404, ...data })