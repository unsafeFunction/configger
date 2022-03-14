import actions from 'redux/intakeDashboard/actions';
import {
  Tabs,
  Table,
  Statistic,
  Row,
  Card,
  DatePicker,
  Empty,
  Spin,
} from 'antd';
import { ProjectOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ExtraFooter from './components/ExtraFooter';
import moment from 'moment';
import { constants } from 'utils/constants';
import Chart from '../../components/widgets/Charts/Chart';
import styles from './styles.module.scss';

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

const IntakeDashboard = () => {
  const [activeKey, setActiveKey] = useState('');
  const [rangeDates, setRangeDates] = useState([]);
  const [isPickerOpened, setPickerOpened] = useState(false);
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
    data:
      Object.values(intakeDashboard?.items?.total_samples_by_date ?? {})
        ?.length > 1
        ? Object.keys(intakeDashboard?.items?.total_samples_by_date).map(
            (date) => {
              return {
                name: date,
                value:
                  intakeDashboard?.items?.total_samples_by_date?.[date]?.[
                    activeKey
                  ],
              };
            },
          )
        : Object.keys(intakeDashboard?.items ?? [])
            .filter(
              (fieldName) => !constants.intakeDashboard.includes(fieldName),
            )
            .map((companyName) => {
              return {
                name: companyName,
                value: intakeDashboard?.items?.[companyName]?.[activeKey],
              };
            }),
  };

  const handleChangeTabs = (key) => {
    setActiveKey(key);
  };

  const handleCloseDatePicker = () => {
    setPickerOpened(false);
  };

  const handleClickDatePicker = () => {
    if (!isPickerOpened) {
      setPickerOpened(true);
    }
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
    setRangeDates(dates);
  };

  const disabledDate = (current) => {
    return moment() < current;
  };

  const extraContent = {
    right: (
      <div onClick={handleClickDatePicker}>
        <RangePicker
          className="ml-auto"
          disabledDate={disabledDate}
          defaultValue={[moment(), moment()]}
          renderExtraFooter={() => (
            <ExtraFooter
              rangeDates={rangeDates}
              handleCloseDatePicker={handleCloseDatePicker}
            />
          )}
          open={isPickerOpened}
          format="YYYY-MM-DD"
          onChange={onDateChange}
          allowClear={false}
        />
      </div>
    ),
  };

  const tableData = Object.keys(intakeDashboard?.items)
    .filter((fieldName) => !constants.intakeDashboard.includes(fieldName))
    .map((company) => {
      return {
        company_name: company,
        ...intakeDashboard.items[company],
      };
    });

  useFetching();

  return (
    <>
      <Tabs
        defaultActiveKey={intakeDashboardTabs[0].value}
        onChange={handleChangeTabs}
        tabBarExtraContent={extraContent}
      >
        {intakeDashboardTabs.map((tabItem) => (
          <TabPane
            key={tabItem.value}
            tab={tabItem.title}
            disabled={!chartDataSamples?.data?.length}
          >
            <div className={styles.wrapper}>
              <div
                className={intakeDashboard?.isLoading ? styles.spin : undefined}
              >
                {intakeDashboard?.isLoading && <Spin />}
              </div>

              {chartDataSamples?.data?.length > 0 && (
                <Chart
                  type={constants.chartTypes.bar}
                  stats={chartDataSamples}
                />
              )}

              {!intakeDashboard?.isLoading && !chartDataSamples?.data?.length && (
                <Empty
                  image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                  imageStyle={{
                    height: 90,
                  }}
                  description={<span>No Data</span>}
                />
              )}
            </div>
          </TabPane>
        ))}
      </Tabs>
      {chartDataSamples?.data?.length > 0 && (
        <Row className="mt-5">
          <Card className="mr-3">
            <Statistic
              prefix={<ProjectOutlined className="mr-2" />}
              title="Total pools count"
              value={intakeDashboard?.items?.total_counts?.total_pools_counts}
            />
          </Card>
          <Card>
            <Statistic
              prefix={<ProjectOutlined className="mr-2" />}
              title="Total samples count"
              value={intakeDashboard?.items?.total_counts?.total_tube_counts}
            />
          </Card>
        </Row>
      )}
      {chartDataSamples?.data?.length > 0 && (
        <Table
          dataSource={tableData}
          align="center"
          scroll={{ x: 1250 }}
          columns={columns}
          className="mt-3"
          pagination={false}
        />
      )}
    </>
  );
};

export default IntakeDashboard;
