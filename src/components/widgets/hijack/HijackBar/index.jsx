import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Button } from 'antd';
import styles from './styles.module.scss';

const HijackBar = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const hijack = useSelector(state => state.hijack);
  const { first_name, last_name } = useSelector(state => state.user?.profile);

  const handleHijackLogout = useCallback(() => {
    dispatch({
      type: 'hijack/LOGOUT',
      payload: {
        userFirstName: first_name,
        userLastName: last_name,
        redirect: () => history.replace(hijack.path),
        accessToken: hijack.accessToken,
        termsAccepted: hijack.termsAccepted,
        role: hijack.role,
      },
    });
  }, [dispatch]);

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
