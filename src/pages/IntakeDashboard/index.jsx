import SwitchedChart from 'components/widgets/Charts/SwitchedChart';
import actions from 'redux/intakeDashboard/actions';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import { constants } from 'utils/constants';

const IntakeDashboard = () => {
  const dispatch = useDispatch();

  const useFetching = () => {
    useEffect(() => {
      dispatch({
        type: actions.FETCH_DAILY_INTAKE_COUNTS_REQUEST,
        payload: {
          from: moment()
            .subtract(1, 'd')
            .format('YYYY-MM-DD'),
          // to: moment().format('YYYY-MM-DD'),
        },
      });
    }, []);
  };

  useFetching();
  return <>Test Chart</>;
  // <SwitchedChart
  //   stats={chartDataSamples}
  //   loading={timeline?.chartsLoading}
  // />
};

export default IntakeDashboard;
