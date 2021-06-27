import React, { useCallback } from 'react';
import { useHistory, Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input, Button } from 'antd';
import actions from 'redux/user/actions';
import moment from 'moment';
import qs from 'qs';
import style from '../style.module.scss';

const RestorePassword = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { token, uid } = qs.parse(history.location.search, {
    ignoreQueryPrefix: true,
  });

  const onSubmit = useCallback(
    (values) => {
      dispatch({
        type: actions.RESTORE_REQUEST,
        payload: {
          ...values,
          token,
          uid,
          redirect: () => history.push('/system/login'),
        },
      });
    },
    [dispatch, token, uid, history],
  );

  const user = useSelector((state) => state.user);

  if (!token || !uid) {
    return <Redirect to="/system/404" />;
  }

  const { isRestoring } = user;

  return (
    <div className={style.auth}>
      <div className={style.container}>
        <div className={style.header}>Password recovery</div>
        <Form layout="vertical" onFinish={onSubmit}>
          <Form.Item
            label="New password"
            name="newPassword"
            className={style.formInput}
            rules={[
              {
                required: true,
                message: 'Please input new password!',
              },
            ]}
          >
            <Input.Password size="large" placeholder="New password" />
          </Form.Item>
          <Form.Item
            label="Password confirmation"
            name="passwordConfirmation"
            dependencies={['newPassword']}
            className={style.formInput}
            rules={[
              {
                required: true,
                message: 'Please input new password again!',
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
          <Form.Item className={style.formButton}>
            <Button
              type="primary"
              size="large"
              className={style.submitButton}
              htmlType="submit"
              loading={isRestoring}
            >
              Restore Password
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
        <div className={style.copyright}>
          Copyright © {moment().year()} Mirimus Inc.
        </div>
      </div>
    </div>
  );
};

export default RestorePassword;
