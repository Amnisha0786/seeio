import lodash from 'lodash'
import camelcaseKeys from 'camelcase-keys'
import { JWT, fetchAuthSession } from 'aws-amplify/auth';

import Misc from '@/utils/misc'
import Toast from '@/components/toast'

let accessToken: JWT | null = null

interface IOption {
  endpoint: string
  handleToken?: boolean
  handleBlob?: boolean
  camelcaseKeys?: boolean
}
type ResponseHandler = (result: any) => any
interface IRequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  url: string
  params?: any
  data?: any
  x_api_key?: boolean
  responseHandler?: ResponseHandler
  isFormData?: boolean
}

class Request {
  constructor(options: IOption) {
    this._options = options
  }

  private _options: IOption

  static create(options: IOption): Request {
    return new Request(options)
  }

  static setAccessToken(token: JWT): void {
    accessToken = token
  }

  static getAccessToken(): JWT | null {
    return accessToken
  }

  static hasAccessToken(): boolean {
    return !!accessToken
  }

  static removeAccessToken(): void {
    accessToken = null
  }

  get(url: string, params?: any, responseHandler?: ResponseHandler, x_api_key?: boolean): any {
    return this._request({ method: 'GET', url, params, x_api_key, responseHandler })
  }

  post(url: string, data: any, responseHandler?: ResponseHandler, isFormData?: boolean): Promise<any> {
    return this._request({ method: 'POST', url, data, responseHandler, isFormData })
  }

  put(url: string, data: any, responseHandler?: ResponseHandler): Promise<any> {
    return this._request({ method: 'PUT', url, data, responseHandler })
  }

  patch(url: string, data: any, responseHandler?: ResponseHandler): Promise<any> {
    return this._request({ method: 'PATCH', url, data, responseHandler })
  }

  delete(url: string, data?: any, responseHandler?: ResponseHandler, params?: any): Promise<any> {
    return this._request({ method: 'DELETE', url, params, data, responseHandler })
  }

  private async _request(requestOptions: IRequestOptions): Promise<any> {
    const { method = 'GET', data = null, isFormData } = requestOptions
    let { url } = requestOptions
    const { params = null, responseHandler, x_api_key = false } = requestOptions

    url = this._options.endpoint + url

    if (params) {
      url += this._getQueryString(params)
    }

    const options: any = {
      method,
      headers: {},
      cache: 'no-store'
    }

    if (x_api_key) {
      options.headers['x-api-key'] = process.env.NEXT_PUBLIC_BO_API_KEY;
    }

    if (this._options.handleToken && accessToken) {
      options.headers.Authorization = `${(await fetchAuthSession()).tokens?.idToken}`
    }

    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
      if (data) {
        const serializable = lodash.isPlainObject(data) || lodash.isArray(data)

        if (serializable) {
          options.body = JSON.stringify(data)
          options.headers['Content-Type'] = isFormData ? 'multipart/form-data' : 'application/json'
        } else {
          options.body = data
        }
      }
    }

    let res
    try {
      res = await fetch(url, options)
    } catch (e: any) {
      Toast.error(e.message || "Something went wrong")
      throw e
    }

    if (!res?.ok) {
      const jsonError = await Misc.getErrorJsonBody(res)

      const message = lodash.isString(jsonError)
        ? jsonError : lodash.isString(jsonError?.message)
          ? jsonError.message : "Something went wrong"

      Toast.error(message)
      throw jsonError
    }

    try {
      if (this._options.handleBlob) {
        const blob = await res.blob()

        return { data: blob }
      }

      const text = await res.text()
      let responseData = text !== '' ? JSON.parse(text) : ''

      if (this._options.camelcaseKeys && !lodash.isString(responseData)) {
        responseData = camelcaseKeys(responseData, { deep: true })
      }

      if (responseData.errors) {
        throw responseData.errors
      }

      if (responseHandler) {
        responseData = responseHandler(responseData)
      }

      return responseData
    } catch (error) {
      /* eslint-disable no-console */
      console.error('[request] error:', method, url, data, params, error)
      throw error
    }
  }

  private _getQueryString(params: any): string {
    const parts: string[] = []

    lodash.forEach(params, (value, key) => {
      const values = lodash.isArray(value) ? value : [value]
      const operator = lodash.isArray(value) ? '[]=' : '='

      lodash.forEach(values, (v) => {
        parts.push(key + operator + encodeURIComponent(v))
      })
    })

    const queryString = parts.join('&')

    return queryString ? `?${queryString}` : ''
  }
}

export default Request
