import { Button, Form, Input } from 'antd';
import moment from 'moment';
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import actions from 'redux/user/actions';
import labConfig from 'utils/labConfig';
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
          callback: () => history.push('/intake-receipt-log'),
        },
      });
    },
    [dispatch, history],
  );

  return (
    <div className={style.auth}>
      <div className={`${style.container}`}>
        <img
          src={`/resources/images/${process.env.REACT_APP_LAB_ID}.svg`}
          alt="Logo"
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
                message: 'Please input Email!',
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
          {/* <Button
            type="link"
            className={style.linkButton}
            onClick={() => history.push('/system/forgot-password')}
          >
            Forgot password?
          </Button> */}
          <a
            className={style.linkButton}
            href={`mailto:${
              labConfig[process.env.REACT_APP_LAB_ID].contacts.email
            }`}
          >
            Email Support
          </a>
        </div>
        <div className={style.copyright}>
          <div className={style.copyright}>
            {`Copyright © ${moment().year()} ${
              labConfig[process.env.REACT_APP_LAB_ID].name
            } Inc.`}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
