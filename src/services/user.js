import axiosClient from 'utils/axiosClient'
import cookieStorage from 'utils/cookie'

const cookie = cookieStorage()

export const login = async (email, password) => {
  try {
    const login = await axiosClient.post('/auth/login', {
      email,
      password,
    })

    return login
  } catch (error) {
    return error
  }
}

export const refresh = async refreshToken => {
  try {
    const response = await axiosClient.post('/auth/refresh-token', {
      refreshToken,
    })

    cookie.setItem('accessToken', response.data.accessToken)
    cookie.setItem('refreshToken', response.data.refreshToken)

    return response
  } catch (error) {
    return error
  }
}
