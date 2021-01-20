import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input, Button } from 'antd';
import actions from 'redux/user/actions';
import classNames from 'classnames';
import style from '../style.module.scss';

const RegByEmail = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useSelector(state => state.user);

  const onSubmit = useCallback(
    values => {
      console.log('HERE!!! VALUES', values);
      // dispatch({
      //   type: actions.REG_BY_EMAIL_REQUEST,
      //   payload: {
      //     ...values,
      //     // toTimeline: () => history.push('/results'),
      //     // toRuns: () => history.push('/runs'),
      //     // acceptTerms: () => history.push('/system/terms-and-conditions'),
      //   },
      // });
    },
    [dispatch],
  );

  return (
    <div className={style.auth}>
      <div className={`${style.container}`}>
        <img
          src="/resources/images/mirimus.svg"
          alt="Mirimus Inc."
          className={style.logo}
        />
        Your email has been verified. Please, set up your password.
        <Form layout="vertical" onFinish={onSubmit}>
          <Form.Item
            label="Password"
            name="new_password1"
            className={style.formInput}
            rules={[
              {
                required: true,
                message: 'Please input password!',
              },
            ]}
          >
            <Input size="large" placeholder="Password" />
          </Form.Item>
          <Form.Item
            label="Confirm Password"
            name="new_password2"
            className={style.formInput}
            rules={[
              {
                required: true,
                message: 'Please confirm the password!',
              },
            ]}
          >
            <Input.Password size="large" placeholder="Confirm password" />
          </Form.Item>
          <Form.Item className={style.formButton}>
            <Button
              type="primary"
              size="large"
              className={style.submitButton}
              htmlType="submit"
              loading={user.isRegByEmail}
            >
              Sign up
            </Button>
          </Form.Item>
        </Form>
        {/* <div className={style.navigationWrap}>
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
            Email Support
          </a>
        </div> */}
        <div className={style.copyright}>Copyright © 2020 Mirimus Inc.</div>
      </div>
    </div>
  );
};

export default RegByEmail;
