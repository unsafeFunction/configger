import SwitchedChart from 'components/widgets/Charts/SwitchedChart';
import actions from 'redux/intakeDashboard/actions';
import { Tabs, Table, Statistic, Row, Card } from 'antd';
import { ProjectOutlined } from '@ant-design/icons';
import TableFooter from 'components/layout/TableFooterLoader';
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
  }, [intakeDashboard, intakeDashboardTabs]);

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

  const columns = [
    {
      title: 'Company Name',
      dataIndex: 'company_name',
    },
    {
      title: 'Diagnostic Count',
      dataIndex: 'diagnostic_count',
    },
    {
      title: 'Pool Count',
      dataIndex: 'pool_count',
    },
    {
      title: 'Rejected Count',
      dataIndex: 'rejected_count',
    },
    {
      title: 'Total Count',
      dataIndex: 'total_count',
    },
    {
      title: 'Tube Count',
      dataIndex: 'tube_count',
    },
  ];

  const tableData = Object.keys(intakeDashboard?.items)
    .map((company) => {
      if (intakeDashboard?.items?.[company].hasOwnProperty('date')) {
        return {
          company_name: company,
          ...intakeDashboard.items[company],
        };
      }
      return undefined;
    })
    .filter((company) => company);
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
          <Row className="mt-5">
            <Card className="mr-3">
              <Statistic
                prefix={<ProjectOutlined className="mr-2" />}
                title="Total pools count"
                value={intakeDashboard.items.total_pools_counts}
              />
            </Card>
            <Card>
              <Statistic
                prefix={<ProjectOutlined className="mr-2" />}
                title="Total pools count"
                value={intakeDashboard.items.total_sample_counts}
              />
            </Card>
          </Row>
          <Table
            dataSource={tableData}
            align="center"
            scroll={{ x: 1250 }}
            columns={columns}
            className="mt-3"
            pagination={false}
          />
        </TabPane>
      ))}
    </Tabs>
  );
};

export default IntakeDashboard;
