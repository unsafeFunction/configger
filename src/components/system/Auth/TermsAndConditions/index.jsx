import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Checkbox, Typography, Layout } from 'antd';
import style from '../style.module.scss';
import actions from 'redux/user/actions';

const TermsAndConditions = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const onSubmit = useCallback(
    values => {
      dispatch({
        type: actions.ACCEPT_REQUEST,
        payload: {
          ...values,
          redirect: () => history.push('/dashboard'),
        },
      });
    },
    [dispatch],
  );

  const user = useSelector(state => state.user);

  const { isAccepting } = user;
  const { Footer } = Layout;

  return (
    <Layout>
      <div style={{ marginLeft: '25%', marginRight: '25%' }}>
        <Typography.Title className="text-center">
          COVID-19 TESTING
        </Typography.Title>
        <Typography.Title className="text-center">
          GENERAL TERMS AND CONDITIONS
        </Typography.Title>
        <Typography.Paragraph className="text-dark font-size-16 mb-1">
          Just accept it!
        </Typography.Paragraph>
        <Checkbox className="text-dark font-size-30 mb-1">
          I agree to the Terms and Conditions
        </Checkbox>
      </div>
      <Footer className="text-center">
        <Button
          type="primary"
          size="large"
          className="text-center btn btn-info w-30 font-size-16"
          htmlType="submit"
          loading={isAccepting}
        >
          CONTINUE
        </Button>
      </Footer>
    </Layout>
  );
};

export default TermsAndConditions;
