import axios from 'axios'

export const axiosInstance = axios.create({
  baseURL: 'http://92.168.1.166:8001/app',
  timeout: 10000
})

axiosInstance.interceptors.request.use(function (config) {
  return config
})

axiosInstance.interceptors.response.use(function (response) {
  return response
})

interface CreateApiParams {
  url: string,
  data?: unknown,
  params?: unknown,
  method?: 'get' | 'post' | 'delete' | 'put',
  contentType?: 'application/json'
}
export function createApi(config: CreateApiParams) {
  const defaultParams = {
    method: 'get',
    contentType: 'application/json'
  }
  const params = Object.assign(defaultParams, config)

  return new Promise(async function (resolve, reject) {
    try {
      const response = await axiosInstance.request({
        url: params.url,
        method: params.method,
        data: params.data,
        params: params.params,
        headers: {
          'content-type': params.contentType
        }
      })
      resolve(response)
    } catch (err) {
      reject(err)
    }
  })
}
