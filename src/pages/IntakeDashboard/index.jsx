import SwitchedChart from 'components/widgets/Charts/SwitchedChart';
import actions from 'redux/intakeDashboard/actions';
import { Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { constants } from 'utils/constants';

const { TabPane } = Tabs;

const IntakeDashboard = () => {
  const [activeKey, setActiveKey] = useState('');
  const { intakeDashboardTabs } = constants;
  const dispatch = useDispatch();
  const intakeDashboard = useSelector((state) => state.intakeDashboard);

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

  useEffect(() => {
    setActiveKey(intakeDashboardTabs[0].value);
  }, [intakeDashboard]);

  const chartDataSamples = {
    valueName: intakeDashboardTabs.find((item) => item.value === activeKey)
      ?.title,
    data: Object.keys(intakeDashboard?.items ?? [])
      .map((companyName) => {
        if (intakeDashboard?.items?.[companyName].hasOwnProperty('date'))
          return {
            name: companyName,
            value: intakeDashboard?.items?.[companyName]?.[activeKey],
          };
      })
      .slice(0, -2),
  };

  const handleChangeTabs = (key) => {
    setActiveKey(key);
  };

  useFetching();
  return (
    <Tabs
      defaultActiveKey={intakeDashboardTabs[0].value}
      onChange={handleChangeTabs}
    >
      {intakeDashboardTabs.map((tabItem) => (
        <TabPane key={tabItem.value} tab={tabItem.title}>
          <SwitchedChart
            stats={chartDataSamples}
            loading={intakeDashboard?.isLoading}
          />
        </TabPane>
      ))}
    </Tabs>
  );
};

export default IntakeDashboard;
