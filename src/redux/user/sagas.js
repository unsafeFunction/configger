import { all, takeEvery, put, call } from 'redux-saga/effects'
import { notification } from 'antd'
import { login } from 'services/user'
import cookieStorage from 'utils/cookie'
import actions from './actions'

export function* callLogin({ payload }) {
  const { email, password, redirect } = payload
  const cookie = cookieStorage()
  try {
    const response = yield call(login, email, password)

    cookie.setItem('accessToken', response.data.accessToken)
    cookie.setItem('refreshToken', response.data.refreshToken)

    yield put({
      type: 'user/LOGIN_SUCCESS',
    })

    yield call(redirect)
    notification.success({
      message: 'Logged In',
      description: 'You have successfully logged in!',
    })
  } catch (error) {
    notification.failure({
      message: 'Something was wrong',
      description: 'Invalid login or password',
    })
  }
}

export default function* rootSaga() {
  yield all([takeEvery(actions.LOGIN_REQUEST, callLogin)])
}
