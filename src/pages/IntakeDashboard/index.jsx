import SwitchedChart from 'components/widgets/Charts/SwitchedChart';
import actions from 'redux/intakeDashboard/actions';
import { Tabs, Table, Statistic, Row, Card, DatePicker, Empty } from 'antd';
import { ProjectOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { constants } from 'utils/constants';

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

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
          from: moment().format('YYYY-MM-DD'),
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

  console.log(chartDataSamples, intakeDashboard.items);

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

  const onDateChange = (dates) => {
    const isDiffDates = dates[0].diff(dates[1]);
    dispatch({
      type: actions.FETCH_DAILY_INTAKE_COUNTS_REQUEST,
      payload: {
        from: dates[0].format('YYYY-MM-DD'),
        to: isDiffDates ? dates[1].format('YYYY-MM-DD') : undefined,
      },
    });
  };

  const extraContent = {
    right: (
      <RangePicker
        className="ml-auto"
        defaultValue={[moment(), moment()]}
        format="YYYY-MM-DD"
        onChange={onDateChange}
        allowClear={false}
      />
    ),
  };

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
    <>
      <Tabs
        defaultActiveKey={intakeDashboardTabs[0].value}
        onChange={handleChangeTabs}
        tabBarExtraContent={extraContent}
      >
        {intakeDashboardTabs.map((tabItem) => (
          <TabPane key={tabItem.value} tab={tabItem.title}>
            {chartDataSamples?.data?.length ? (
              <SwitchedChart
                stats={chartDataSamples}
                loading={intakeDashboard?.isLoading}
              />
            ) : (
              <Empty
                image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                imageStyle={{
                  height: 90,
                }}
                description={<span>No Data</span>}
              />
            )}
          </TabPane>
        ))}
      </Tabs>
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
    </>
  );
};

export default IntakeDashboard;
