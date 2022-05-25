import { Button, Form, Input } from 'antd';
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import actions from 'redux/user/actions';
import { ReactComponent as Config } from 'assets/config.svg';
import style from '../style.module.scss';

const Login = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { isLoggingIn } = useSelector((state) => state.user);

  const onSubmit = useCallback(
    (values) => {
      dispatch({
        type: actions.LOGIN_REQUEST,
        payload: {
          ...values,
          redirect: () => history.push('/environments'),
        },
      });
    },
    [dispatch, history],
  );

  return (
    <div className={style.auth}>
      <div className={style.info}>
        <h2 className={style.title}>Configger</h2>
        <Config width="250px" height="200px" fill="white" />
      </div>
      <div className={`${style.container}`}>
        <Form layout="vertical" onFinish={onSubmit}>
          <Form.Item
            label="Email Address"
            name="email"
            className={style.formInput}
            rules={[
              {
                required: true,
                message: 'Please input Email!',
              },
            ]}
          >
            <Input aria-label="email" size="large" placeholder="Email" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            className={style.formInput}
            rules={[
              {
                required: true,
                message: 'Please input password!',
              },
            ]}
          >
            <Input.Password size="large" placeholder="Password" />
          </Form.Item>
          <Form.Item className={style.formButton}>
            <Button
              type="primary"
              size="large"
              className={style.submitButton}
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
            onClick={() => history.push('/system/registration')}
          >
            Sign up
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
