import { ACCESS_TOKEN, BACK_MOCK_ACCESS_TOKEN } from '@/constants'
import axios from 'axios'
import { errorController } from './controller/error'

const authAPI = axios.create({
  baseURL:
    process.env.NODE_ENV === 'production' ? process.env.FRONT_SERVER_BASE_URL : `http://localhost:${process.env.PORT}`,
  timeout: 10000
})

authAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN) ? localStorage.getItem(ACCESS_TOKEN) : ''
    config.headers.Authorization = token
    return config
  },
  async (error) => {
    if (process.env.NODE_ENV === 'development') console.error(error)
    return await Promise.reject(error)
  }
)

authAPI.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (process.env.NODE_ENV === 'development') console.error(error)
    await errorController(error)
  }
)

const backAuthAPI = axios.create({
  baseURL: process.env.BACK_SERVER_BASE_URL,
  timeout: 10000
})

backAuthAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(BACK_MOCK_ACCESS_TOKEN) ?? localStorage.getItem(BACK_MOCK_ACCESS_TOKEN)
    config.headers['Content-Type'] = 'application/json; charset=utf-8'
    config.headers.Authorization = token
    return config
  },
  async (error) => {
    if (process.env.NODE_ENV === 'development') console.error(error)
    return await Promise.reject(error)
  }
)

export { authAPI, backAuthAPI }
