import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input, Button } from 'antd';
import actions from 'redux/user/actions';
import style from '../style.module.scss';

const Login = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useSelector(state => state.user);

  const onSubmit = useCallback(
    values => {
      dispatch({
        type: actions.LOGIN_REQUEST,
        payload: {
          ...values,
          toTimeline: () => history.push('/timeline'),
          toBatches: () => history.push('/batches'),
          acceptTerms: () => history.push('/system/terms-and-conditions'),
        },
      });
    },
    [dispatch],
  );

  const { isLoggingIn } = user;

  return (
    <div className={style.auth}>
      <div className={`${style.container} pl-5 pr-5 pt-5 pb-5 bg-white`}>
        <img
          src="/resources/images/logo.png"
          alt="Mirimus"
          className={style.logo}
        />
        <Form layout="vertical" onFinish={onSubmit}>
          <Form.Item
            label="Email Address"
            name="email"
            rules={[
              {
                required: true,
                message: 'Please input your Email!',
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
          <Form.Item className="mb-3">
            <Button
              type="primary"
              size="large"
              className="text-center btn btn-info w-100 font-size-16"
              htmlType="submit"
              loading={isLoggingIn}
            >
              SIGN IN
            </Button>
          </Form.Item>
        </Form>
        <div className={style.navigationWrap}>
          <Button
            type="link"
            className={`${style.linkButton} font-size-18`}
            onClick={() => history.push('/system/forgot-password')}
          >
            Forgot password?
          </Button>
          <a
            className={`${style.linkButton} mb-5 ml-auto font-size-18`}
            href="mailto:testingsupport@mirimus.com"
          >
            Contact us
          </a>
        </div>
        <div className="text-gray-8 text-center font-size-16">
          Copyright © 2020 Mirimus Inc.
        </div>
      </div>
    </div>
  );
};

export default Login;
