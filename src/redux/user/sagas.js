import { all, takeEvery, put, call } from 'redux-saga/effects'
import { notification } from 'antd'
import { history } from 'index'
import { login } from 'services/user'
import cookieStorage from 'utils/cookie'
import actions from './actions'

export function* callLogin({ payload }) {
  const { email, password } = payload
  const cookie = cookieStorage()
  try {
    const response = yield call(login, email, password)

    cookie.setItem('accessToken', response.data.accessToken)
    cookie.setItem('refreshToken', response.data.refreshToken)

    yield put({
      type: 'user/LOGIN_SUCCESS',
    })

    yield history.push('/dashboard')
    notification.success({
      message: 'Logged In',
      description: 'You have successfully logged in!',
    })
  } catch (error) {
    notification.success({
      message: 'Something was wrong',
      description: 'Invalid login or password',
    })
  }
}

// export function* LOAD_CURRENT_ACCOUNT() {
//   yield put({
//     type: 'user/SET_STATE',
//     payload: {
//       loading: true,
//     },
//   })
//   const response = yield call(currentAccount)
//   if (response) {
//     const { uid: id, email, photoURL: avatar } = response
//     yield put({
//       type: 'user/SET_STATE',
//       payload: {
//         id,
//         name: 'Administrator',
//         email,
//         avatar,
//         role: 'admin',
//         authorized: true,
//       },
//     })
//   }
//   yield put({
//     type: 'user/SET_STATE',
//     payload: {
//       loading: false,
//     },
//   })
// }

// export function* LOGOUT() {
//   yield call(logout)
//   yield put({
//     type: 'user/SET_STATE',
//     payload: {
//       id: '',
//       name: '',
//       role: '',
//       email: '',
//       avatar: '',
//       authorized: false,
//       loading: false,
//     },
//   })
// }

export default function* rootSaga() {
  yield all([
    takeEvery(actions.LOGIN_REQUEST, callLogin),
    // takeEvery(actions.LOAD_CURRENT_ACCOUNT, LOAD_CURRENT_ACCOUNT),
    // takeEvery(actions.LOGOUT, LOGOUT),
    // LOAD_CURRENT_ACCOUNT(), // run once on app load to check user auth
  ])
}
