import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input, Button } from 'antd';
import actions from 'redux/user/actions';
import classNames from 'classnames';
import style from '../style.module.scss';

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const onSubmit = useCallback(
    values => {
      dispatch({
        type: actions.FORGOT_REQUEST,
        payload: {
          ...values,
          redirect: () => history.push('/system/login'),
        },
      });
    },
    [dispatch],
  );

  const user = useSelector(state => state.user);

  const { isRestoring } = user;

  return (
    <div className={style.auth}>
      <div className={`${style.container}`}>
        <div className={style.header}>Forgot password?</div>
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
          <Form.Item className="mb-3">
            <Button
              type="primary"
              size="large"
              className={style.submitButton}
              htmlType="submit"
              loading={isRestoring}
            >
              Send recover link
            </Button>
          </Form.Item>
        </Form>
        <Button
          type="link"
          className={style.linkButton}
          onClick={() => history.push('/system/login')}
        >
          Back to login
        </Button>
        <div className={style.copyright}>Copyright © 2020 Mirimus Inc.</div>
      </div>
    </div>
  );
};

export default ForgotPassword;
