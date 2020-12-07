import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input, Button } from 'antd';
import actions from 'redux/user/actions';
import classNames from 'classnames'
import style from './style.module.scss';

const Password = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();

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

  const { isPasswordChanging, error } = useSelector(state => state.user);

  useEffect(() => {
    const isInitializing = form.getFieldValue('currentPassword') === undefined;
    if (!isInitializing && !isPasswordChanging && !error) {
      form.setFieldsValue({
        currentPassword: '',
        newPassword: '',
        passwordConfirmation: '',
      });
    }
  }, [isPasswordChanging]);

  return (
    <div className={style.container}>
      <div className={style.header}>Change password</div>
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <div className={style.form}>
          <Form.Item
            label="Current password"
            name="currentPassword"
            className={style.input}
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
            className={classNames(style.input, 'mx-5')}
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
            dependencies={["newPassword"]}
            className={style.input}
            rules={[
              {
                required: true,
                message: 'Please input your new password again!',
              },
              ({ getFieldValue }) => ({
                validator(rule, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }

                  return Promise.reject(
                    'The password that you entered does not match with the new one!',
                  );
                },
              }),
            ]}
          >
            <Input.Password size="large" placeholder="Password confirmation" />
          </Form.Item>
        </div>
        <Form.Item className={style.formButton}>
          <Button
            type="primary"
            size="large"
            className={classNames(style.submitButton, 'btn', 'btn-info', 'float-right')}
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
