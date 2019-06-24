import { createHash } from 'crypto'
import request from 'request'
import { Application } from 'express'
import { check, validationResult } from 'express-validator/check'

const {
  SECRET, TOKEN, AUDIO_PROXY
} = process.env

const v = '5.68'
const agent = 'VKAndroidApp/5.12-2353 (Android 9; SDK 28; armeabi-v7a; Xiaomi Mi A1; ru)'
const lang = 'ru'
const apiUrl = 'https://api.vk.com'

const getNewUrl = (oldUrl: string) => {
  if (!oldUrl) return ''
  const url = new URL(oldUrl)
  const domain = url.hostname.split(/\./)[0]
  return `${AUDIO_PROXY}${domain}${url.pathname}${url.search}`
}
const createSig = (methodUrl: string, data: object) => {
  const dataUrl = Object.entries(data).map(i => i.join('=')).join('&')
  const sigStr = `${methodUrl}?${dataUrl}${SECRET}`
  return createHash('md5').update(sigStr).digest('hex')
}
const inRange = (from: number, to: number) => (v: number) => to >= v && v >= from

export default (app: Application) => {
  app.get('/hello',
    check('offset').isInt().custom(inRange(0, Infinity)).toInt(),
    check('count').isInt().custom(inRange(1, 200)).toInt(),
    check('q').isString(),
    (req, res) => {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() })
        return
      }
      const { offset, count, q } = req.query
      const methodUrl = '/method/audio.search'
      const body = {
        access_token: TOKEN,
        q,
        v,
        count,
        offset,
        https: 1,
        lang
      }
      const sig = createSig(methodUrl, body)
      console.log({ body, sig })
      request(apiUrl + methodUrl, {
        method: 'post',
        formData: { ...body, sig },
        headers: {
          'User-Agent': agent
        },
        json: true
      }, (_, __, data: { response: { items: [{ url: string }] } }) => {
        console.log(data)
        res.json(
          data.response.items.map(i => ({ ...i,
            url: getNewUrl(i.url),
            rawUrl: i.url }))
        )
      })
    })
}
