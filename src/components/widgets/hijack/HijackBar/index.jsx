import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Button } from 'antd';
import styles from './styles.module.scss';

const HijackBar = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const { path, accessToken, termsAccepted, role } = useSelector(
    state => state.hijack,
  );
  const hijack = useSelector(state => state.hijack);
  const { first_name, last_name } = useSelector(state => state.user?.profile);

  const handleHijackLogout = useCallback(() => {
    dispatch({
      type: 'hijack/LOGOUT',
      payload: {
        redirect: () => history.replace(path),
        accessToken,
        termsAccepted,
        role,
      },
    });
  }, [dispatch, hijack]);

  return (
    <div className={styles.hijackBar}>
      <span className="mr-5">
        You Logged In as {first_name} {last_name}
      </span>
      <Button ghost onClick={handleHijackLogout} className="mt-2 mb-2">
        Log Out
      </Button>
    </div>
  );
};

export default HijackBar;
