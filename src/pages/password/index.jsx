import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input, Button } from 'antd';
import actions from 'redux/user/actions';
import style from './style.module.scss';

const Password = () => {
  const dispatch = useDispatch();

  const onSubmit = useCallback(
    values => {
      dispatch({
        type: actions.CHANGE_PASSWORD_REQUEST,
        payload: {
          ...values,
        },
      });
    },
    [dispatch],
  );

  const { isPasswordChanging } = useSelector(state => state.user);

  useEffect(() => {});

  return (
    <div className={`${style.container} pl-5 pr-5 pt-5 pb-5 bg-white`}>
      <div className={`${style.header}`}>Change password</div>
      <Form layout="vertical" onFinish={onSubmit}>
        <div className={`${style.form}`}>
          <Form.Item
            label="Current password"
            name="currentPassword"
            className="w-100"
            rules={[
              {
                required: true,
                message: 'Please input your current password!',
              },
            ]}
          >
            <Input.Password size="large" placeholder="Current password" />
          </Form.Item>
          <Form.Item
            label="New password"
            name="newPassword"
            className="w-100 mx-5"
            rules={[
              {
                required: true,
                message: 'Please input your new password!',
              },
            ]}
          >
            <Input.Password size="large" placeholder="New password" />
          </Form.Item>
          <Form.Item
            label="Password confirmation"
            name="passwordConfirmation"
            className="w-100"
            rules={[
              {
                required: true,
                message: 'Please input your new password again!',
              },
            ]}
          >
            <Input.Password size="large" placeholder="Password confirmation" />
          </Form.Item>
        </div>
        <Form.Item className="mb-1">
          <Button
            type="primary"
            size="large"
            className="text-center text-uppercase btn btn-info float-right font-size-16"
            htmlType="submit"
            loading={isPasswordChanging}
          >
            Change password
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Password;
