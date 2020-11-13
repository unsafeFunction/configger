import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input, Button } from 'antd';
import actions from 'redux/user/actions';
import style from '../style.module.scss';

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const onSubmit = useCallback(
    values => {
      dispatch({
        type: actions.RESTORE_REQUEST,
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
      <div className={`${style.container} pl-5 pr-5 pt-5 pb-5 bg-white`}>
        <div className="text-dark font-size-30 mb-4 text-center">
          Forgot password?
        </div>
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
          <Form.Item className="mb-3">
            <Button
              type="primary"
              size="large"
              className="text-center btn btn-info w-100 font-size-16"
              htmlType="submit"
              loading={isRestoring}
            >
              SEND RECOVER LINK
            </Button>
          </Form.Item>
        </Form>
        <Button
          type="link"
          className={`${style.linkButton} mb-5 font-size-18`}
          onClick={() => history.push('/system/login')}
        >
          Back to login
        </Button>
        <div className="text-gray-8 text-center font-size-16">
          Copyright © 2020 Mirimus Inc.
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
