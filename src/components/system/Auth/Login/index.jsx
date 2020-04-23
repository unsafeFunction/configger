import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Form, Input, Button } from 'antd'
import style from '../style.module.scss'

const Login = () => {
  const dispatch = useDispatch()

  const onSubmit = useCallback(() => {
    dispatch({
      type: 'user/LOGIN',
      payload: {
        email: 'admin@mediatec.org',
        password: 'mediatec',
      },
    })
  }, [dispatch])

  const user = useSelector(state => state.user)

  const { loading } = user

  return (
    <div className={style.auth}>
      <div className={`${style.container} pl-5 pr-5 pt-5 pb-5 bg-white`}>
        <div className="text-dark font-size-30 mb-2 text-center">Log In</div>
        <Form layout="vertical" hideRequiredMark onFinish={onSubmit} className="mb-4">
          <Form.Item rules={[{ required: true, message: 'Please input your e-mail address' }]}>
            <Input size="large" placeholder="Email" />
          </Form.Item>
          <Form.Item>
            <Input
              rules={{ required: true, message: 'Please input your password' }}
              size="large"
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              size="large"
              className="text-center btn btn-success w-100 font-weight-bold font-size-18"
              htmlType="submit"
              loading={loading}
            >
              Log In
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default Login
