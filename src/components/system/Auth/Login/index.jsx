import React, { useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Form, Input, Button } from 'antd'
import style from '../style.module.scss'

const Login = () => {
  const dispatch = useDispatch()
  const history = useHistory()

  const onSubmit = useCallback(
    values => {
      dispatch({
        type: 'user/LOGIN_REQUEST',
        payload: {
          ...values,
          redirect: () => history.push('/dashboard'),
        },
      })
    },
    [dispatch],
  )

  const user = useSelector(state => state.user)

  const { isLoading } = user

  return (
    <div className={style.auth}>
      <div className={`${style.container} pl-5 pr-5 pt-5 pb-5 bg-white`}>
        <div className="text-dark font-size-30 mb-2 text-center">Log In</div>
        <Form layout="vertical" onFinish={onSubmit} className="mb-4">
          <Form.Item
            label="E-mail"
            name="email"
            rules={[
              {
                required: true,
                message: 'Please input your E-mail!',
              },
            ]}
          >
            <Input size="large" placeholder="Email" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
            ]}
          >
            <Input.Password size="large" placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              size="large"
              className="text-center btn btn-success w-100 font-weight-bold font-size-18"
              htmlType="submit"
              loading={isLoading}
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
