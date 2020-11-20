import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input, Button } from 'antd';
import actions from 'redux/user/actions';
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

  const { profile, isProfileUpdating } = useSelector(state => state.user);

  form.setFieldsValue({
    first_name: profile.first_name,
    last_name: profile.last_name,
  });

  return (
    <div className={`${style.container} pl-5 pr-5 pt-5 pb-5 bg-white`}>
      <div className={`${style.header}`}>My Profile</div>
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <div className={`${style.form}`}>
          <Form.Item
            label="First name"
            name="first_name"
            initialValue={profile.first_name}
            className="w-100 mr-5"
            rules={[
              {
                required: true,
                message: 'Please input your first name!',
              },
            ]}
          >
            <Input size="large" placeholder="First name" />
          </Form.Item>
          <Form.Item
            label="Last name"
            name="last_name"
            initialValue={profile.last_name}
            className="w-100 ml-5"
            rules={[
              {
                required: true,
                message: 'Please input your last name!',
              },
            ]}
          >
            <Input size="large" placeholder="Last name" />
          </Form.Item>
        </div>
        <Form.Item className="my-3">
          <Button
            type="primary"
            size="large"
            className="text-center text-uppercase btn btn-info float-right font-size-16"
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
