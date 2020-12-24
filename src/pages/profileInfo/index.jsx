import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input, Button } from 'antd';
import ReactInputMask from 'react-input-mask';
import actions from 'redux/user/actions';
import classNames from 'classnames';
import style from './style.module.scss';

const ProfileInfo = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const onSubmit = useCallback(
    values => {
      dispatch({
        type: actions.UPDATE_PROFILE_REQUEST,
        payload: {
          ...values,
        },
      });
    },
    [dispatch],
  );

  const { profile, isProfileUpdating, error } = useSelector(
    state => state.user,
  );

  useEffect(() => {
    form.setFieldsValue({
      first_name: profile.first_name,
      last_name: profile.last_name,
      phone_number: profile.phone_number,
    });
  }, [profile]);

  return (
    <div className={style.container}>
      <div className={style.header}>My Profile</div>
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <div className={style.form}>
          <Form.Item
            label="First name"
            name="first_name"
            initialValue={profile.first_name}
            className={classNames(style.input, 'mr-5')}
            rules={[
              {
                required: true,
                message: 'Please input first name!',
              },
            ]}
          >
            <Input size="large" placeholder="First name" />
          </Form.Item>
          <Form.Item
            label="Last name"
            name="last_name"
            initialValue={profile.last_name}
            className={classNames(style.input, 'ml-2')}
            rules={[
              {
                required: true,
                message: 'Please input last name!',
              },
            ]}
          >
            <Input size="large" placeholder="Last name" />
          </Form.Item>
          <Form.Item
            label="Phone number"
            name="phone_number"
            initialValue={profile?.phone_number}
            className={classNames(style.input, 'ml-5')}
          >
            <ReactInputMask mask="(999) 999-9999">
              {() => {
                return <Input size="large" placeholder="Phone number" />;
              }}
            </ReactInputMask>
          </Form.Item>
        </div>
        <Form.Item className={style.formButton}>
          <Button
            type="primary"
            size="large"
            className={classNames('text-uppercase', 'float-right')}
            htmlType="submit"
            loading={isProfileUpdating}
          >
            Save profile
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ProfileInfo;
