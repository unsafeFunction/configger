import React from 'react';
import { Button } from 'antd';
import { useDispatch } from 'react-redux';
import actions from 'redux/intakeDashboard/actions';
import styles from './styles.module.scss';

const ExtraFooter = ({ rangeDates, handleCloseDatePicker }) => {
  const dispatch = useDispatch();

  const onSubmit = () => {
    handleCloseDatePicker();
    const isDiffDates = rangeDates[0].diff(rangeDates[1]);
    dispatch({
      type: actions.FETCH_DAILY_INTAKE_COUNTS_REQUEST,
      payload: {
        from: rangeDates[0].format('YYYY-MM-DD'),
        to: isDiffDates ? rangeDates[1].format('YYYY-MM-DD') : undefined,
      },
    });
  };

  return (
    <div className={styles.footerWrapper}>
      <Button type="primary" onClick={onSubmit}>
        OK
      </Button>
    </div>
  );
};

export default ExtraFooter;
