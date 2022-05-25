/* eslint-disable prefer-promise-reject-errors */
import React from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input, Button, Row } from 'antd';
import actions from 'redux/user/actions';
import { ReactComponent as Config } from 'assets/config.svg';
import style from '../style.module.scss';

const RegByEmail = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const user = useSelector((state) => state.user);

  const onSubmit = (values) => {
    dispatch({
      type: actions.REG_BY_EMAIL_REQUEST,
      payload: {
        ...values,
        redirect: () => history.push('/system/login'),
      },
    });
  };

  return (
    <div className={style.auth}>
      <div className={style.info}>
        <h2 className={style.title}>Create your account</h2>
        <Config width="250px" height="200px" fill="white" />
      </div>
      <div className={style.container}>
        <Form layout="vertical" onFinish={onSubmit}>
          <Row className={style.nameContainer}>
            <Form.Item
              label="First name"
              name="first_name"
              className={`${style.formInput} mr-3`}
              rules={[
                {
                  required: true,
                  message: 'Please input your name!',
                },
              ]}
            >
              <Input
                aria-label="first name"
                size="large"
                placeholder="First Name"
              />
            </Form.Item>
            <Form.Item
              label="Last name"
              name="last_name"
              className={style.formInput}
              rules={[
                {
                  required: true,
                  message: 'Please input your last name!',
                },
              ]}
            >
              <Input
                aria-label="last name"
                size="large"
                placeholder="Last Name"
              />
            </Form.Item>
          </Row>
          <Form.Item
            label="Email"
            name="email"
            className={style.formInput}
            rules={[
              {
                required: true,
                message: 'Please enter email!',
              },
            ]}
          >
            <Input aria-label="email" size="large" placeholder="Email" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password1"
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
          <Form.Item
            label="Confirm Password"
            name="password2"
            dependencies={['password1']}
            className={style.formInput}
            rules={[
              {
                required: true,
                message: 'Please input password again!',
              },
              ({ getFieldValue }) => ({
                validator(rule, value) {
                  if (!value || getFieldValue('password1') === value) {
                    return Promise.resolve();
                  }

                  return Promise.reject(
                    'The password that you entered does not match with the new one!',
                  );
                },
              }),
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
          <Button
            type="link"
            className={style.linkButton}
            onClick={() => history.push('/system/login')}
          >
            Sign In
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default RegByEmail;
