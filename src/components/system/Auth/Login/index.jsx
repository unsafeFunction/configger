import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input, Button } from 'antd';
import actions from 'redux/user/actions';
import classNames from 'classnames'
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
      <div className={`${style.container}`}>
        <img
          src="/resources/images/logo.png"
          alt="Mirimus"
          className={style.logo}
        />
        <Form layout="vertical" onFinish={onSubmit}>
          <Form.Item
            label="Email Address"
            name="email"
            className={style.formInput}
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
            className={style.formInput}
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
            ]}
          >
            <Input.Password size="large" placeholder="Password" />
          </Form.Item>
          <Form.Item className={style.formButton}>
            <Button
              type="primary"
              size="large"
              className={classNames(style.submitButton, 'btn', 'btn-info')}
              htmlType="submit"
              loading={isLoggingIn}
            >
              Sign in
            </Button>
          </Form.Item>
        </Form>
        <div className={style.navigationWrap}>
          <Button
            type="link"
            className={style.linkButton}
            onClick={() => history.push('/system/forgot-password')}
          >
            Forgot password?
          </Button>
          <a
            className={style.linkButton}
            href="mailto:testingsupport@mirimus.com"
          >
            Contact us
          </a>
        </div>
        <div className={style.copyright}>
          Copyright © 2020 Mirimus Inc.
        </div>
      </div>
    </div>
  );
};

export default Login;
