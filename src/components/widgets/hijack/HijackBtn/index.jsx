import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Button, Tooltip } from 'antd';
import { LoginOutlined } from '@ant-design/icons';
import actions from 'redux/hijack/actions';

const HijackBtn = ({ userId, userFirstName, userLastName, userRole, path }) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const currentRole = useSelector(state => state.user?.role);
  const hijack = useSelector(state => state.hijack);

  const handleHijackLogin = useCallback(() => {
    dispatch({
      type: actions.FETCH_CREDENTIALS_REQUEST,
      payload: {
        userId,
        userFirstName,
        userLastName,
        path,
        currentRole,
        toTimeline: () => history.replace('/results'),
        toRuns: () => history.replace('/runs'),
        toTerms: () => history.replace('/system/terms-and-conditions'),
      },
    });
  }, [dispatch]);

  return (
    <Tooltip
      title={`Login as ${userFirstName} ${userLastName}`}
      placement="bottomRight"
    >
      <Button
        type="primary"
        ghost
        icon={<LoginOutlined />}
        onClick={handleHijackLogin}
        disabled={
          hijack.isLoading || hijack.isActive || userRole !== 'company-admin'
        }
      />
    </Tooltip>
  );
};

HijackBtn.propTypes = {
  userId: PropTypes.number.isRequired,
  userFirstName: PropTypes.string.isRequired,
  userLastName: PropTypes.string.isRequired,
  userRole: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
};

export default HijackBtn;
