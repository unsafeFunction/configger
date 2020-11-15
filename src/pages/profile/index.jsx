import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input, Button } from 'antd';
import actions from 'redux/user/actions';
import style from './style.module.scss';

const Profile = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const onSubmit = useCallback(
    values => {
      dispatch({
        type: actions.LOGIN_REQUEST,
        payload: {
          ...values,
          toDashboard: () => history.push('/dashboard'),
        },
      });
    },
    [dispatch],
  );

  // const profile = useSelector(state => state.profile);
  // const { isLoading } = profile;

  return (
    <div className={`${style.container} pl-5 pr-5 pt-5 pb-5 bg-white`}>
      <div className={`${style.header}`}>My Profile</div>
      <Form layout="vertical" onFinish={onSubmit}>
        <div className={`${style.form}`}>
          <Form.Item
            label="First name"
            name="firstname"
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
            name="lastname"
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
        <Form.Item className="mb-3">
          <div className="float-right">
            <Button
              type="primary"
              size="large"
              className="text-center text-uppercase btn btn-light font-size-16 mr-4"
              htmlType="submit"
            >
              Change password
            </Button>
            <Button
              type="primary"
              size="large"
              className="text-center text-uppercase btn btn-info font-size-16"
              htmlType="submit"
              // loading={isLoading}
            >
              Save profile
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Profile;
