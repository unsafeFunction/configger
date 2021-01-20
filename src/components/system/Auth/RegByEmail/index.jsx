import React, { useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input, Button, Empty, Spin } from 'antd';
import actions from 'redux/user/actions';
import classNames from 'classnames';
import moment from 'moment';
import style from '../style.module.scss';

const RegByEmail = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const inviteKey = history.location.pathname.split('/')[2];

  const user = useSelector(state => state.user);

  const useFetching = () => {
    useEffect(() => {
      dispatch({
        type: actions.VERIFY_EMAIL_REQUEST,
        payload: { inviteKey },
      });
    }, [dispatch, inviteKey]);
  };

  useFetching();

  const onSubmit = useCallback(
    values => {
      dispatch({
        type: actions.REG_BY_EMAIL_REQUEST,
        payload: {
          ...values,
          inviteKey,
          redirect: () => history.push('/system/login'),
        },
      });
    },
    [dispatch, inviteKey],
  );

  return (
    <div className={style.auth}>
      <div className={style.container}>
        {user.isVerifyingEmail === 'loading' && (
          <Empty
            image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
            imageStyle={{
              height: 180,
            }}
            description={
              <span>
                <Spin className="mr-3" /> Email verification
              </span>
            }
          ></Empty>
        )}

        {user.isVerifyingEmail === 'succeeded' && (
          <>
            <div className={style.header}>
              Your email has been verified
              <br />
              Please, set up your password
            </div>

            <Form layout="vertical" onFinish={onSubmit}>
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
                {/* <Input size="large" placeholder="Password" /> */}
                <Input size="large" placeholder="Password" />
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
                <Input size="large" placeholder="Confirm password" />
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
        //     type="link"
        //     className={style.linkButton}
        //     onClick={() => history.push('/system/forgot-password')}
        //   >
        //     Forgot password?
        //   </Button>
        //   <a
        //     className={style.linkButton}
        //     href="mailto:testingsupport@mirimus.com"
        //   >
        //     Email Support
        //   </a>
        // </div>  */}
            <div className={style.copyright}>
              Copyright © {moment().year()} Mirimus Inc.
            </div>
          </>
        )}

        {user.isVerifyingEmail === 'failed' && (
          <Empty
            image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
            imageStyle={{
              height: 180,
            }}
            description={<span className="text-danger">{user.error}</span>}
          ></Empty>
        )}
      </div>
    </div>
  );
};

export default RegByEmail;
