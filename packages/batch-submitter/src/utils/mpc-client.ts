import * as http from 'http'
import * as https from 'https'
import { URL } from 'url'

export class MpcClient {
  protected url: string

  constructor(url: string) {
    this.url = url
  }

  protected httpRequest(url: string, options: http.RequestOptions | https.RequestOptions, data?: any): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const protocol = url.toLowerCase().startsWith('https') ? https : http
      const req = protocol.request(options, response => {
        let responseData = ''

        response.on('data', chunk => {
          responseData += chunk
        })

        response.on('end', () => {
          resolve(responseData)
        })
      })

      req.on('error', error => {
        reject(error)
      })

      if (data) {
        req.write(JSON.stringify(data))
      }

      req.end()
    })
  }

  public async getLatestMpc(): Promise<any> {
    const getUrl = new URL('/mpc/latest', this.url)
    const getOptions: http.RequestOptions | https.RequestOptions = {
        method: 'GET',
        hostname: getUrl.hostname,
        port: getUrl.port,
        path: getUrl.pathname
    }
    const resp = await this.httpRequest(this.url, getOptions)
    console.debug('getLatestMpc resp', resp)
    if (!resp) {
      return null
    }
    const obj = eval('(' + resp + ')')
    if (obj.result && obj.result.mpc_address) {
      return obj.result
    }
    return null
  }

  public async proposeMpcSign(data: any): Promise<any> {
    const postUrl = new URL('/mpc/propose-mpc-sign', this.url)
    const postOptions: http.RequestOptions | https.RequestOptions = {
      method: 'POST',
      hostname: postUrl.hostname,
      port: postUrl.port,
      path: postUrl.pathname,
      headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(JSON.stringify(data))
      }
    }
    const resp = await this.httpRequest(this.url, postOptions, data)
    console.info('proposeMpcSign resp', resp)
    if (!resp) {
      return null
    }
    const obj = eval('(' + resp + ')')
    if (obj.error) {
      return null
    }
    return obj.result || null
  }


  public async getMpcSign(id: string): Promise<string> {
    const getUrl = new URL(`/mpc/sign/${id}`, this.url)
    const getOptions: http.RequestOptions | https.RequestOptions = {
        method: 'GET',
        hostname: getUrl.hostname,
        port: getUrl.port,
        path: getUrl.pathname
    }
    const resp = await this.httpRequest(this.url, getOptions)
    console.info('getMpcSign resp', resp)
    if (!resp) {
      return ''
    }
    const obj = eval('(' + resp + ')')
    if (obj.error) {
      return ''
    }
    if (obj.result && obj.result.signed_tx) {
      return obj.result.signed_tx
    }
    return ''
  }

  public async getMpcSignWithTimeout(id: string, maxTimeout: number, interval: number): Promise<string> {
    const startTime = Date.now()
    return new Promise<any>(async (resolve, reject) => {
        const requestInterval = setInterval(async () => {
            try {
                const signedTx = await this.getMpcSign(id)
                const currentTime = Date.now()
                if (signedTx || currentTime - startTime >= maxTimeout) {
                    clearInterval(requestInterval)
                    resolve(signedTx)
                }
            } catch (error) {
                clearInterval(requestInterval)
                reject(error)
            }
        }, interval)
    })
  }
}
