import { DownOutlined, ExclamationCircleTwoTone } from '@ant-design/icons';
import { Button, Dropdown, Menu, Table, Tooltip } from 'antd';
import classNames from 'classnames';
import ResultTag from 'components/widgets/ResultTag';
import moment from 'moment-timezone';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import actions from 'redux/analysisRuns/actions';
import styles from './styles.module.scss';

moment.tz.setDefault('America/New_York');

const AnalysisRun = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

  const run = useSelector((state) => state.analysisRuns.singleRun);

  const useFetching = () => {
    useEffect(() => {
      dispatch({
        type: actions.FETCH_RUN_REQUEST,
      });
    }, []);
  };

  useFetching();

  const columns = [
    {
      title: 'Company Short',
      dataIndex: 'company_short',
    },
    {
      title: 'Pool Name',
      dataIndex: 'pool_name',
    },
    {
      title: 'Sample ID',
      dataIndex: 'sample_id',
    },
    {
      title: 'Result',
      dataIndex: 'status',
      render: (_, record) => {
        return {
          // props: {
          //   style: { borderRight: '1px solid black' },
          // },
          children: record?.status ? (
            <ResultTag status={record.status} type="pool" />
          ) : null,
        };
      },
    },
    {
      title: 'Wells',
      dataIndex: 'wells',
    },
    {
      title: 'MS2',
      dataIndex: 'ms2',
    },
    {
      title: 'N gene',
      dataIndex: 'n_gene',
      render: (value) => {
        return value < 5 ? (
          <Tooltip placement="right" title="some text">
            {value}
            <ExclamationCircleTwoTone twoToneColor="orange" className="ml-1" />
          </Tooltip>
        ) : (
          <>{value}</>
        );
      },
    },
    {
      title: 'S gene',
      dataIndex: 's_gene',
    },
  ];

  const menu = (
    <Menu>
      <Menu.Item key="1">View Table</Menu.Item>
      <Menu.Item key="2" disabled>
        View Timeline
      </Menu.Item>
      <Menu.Item key="3">View 96-well Plate</Menu.Item>
      <Menu.Item key="4">Go to DataConnect</Menu.Item>
      <Menu.Item key="5">Upload Raw Data</Menu.Item>
      <Menu.Item key="6">Print Run</Menu.Item>
    </Menu>
  );

  return (
    <>
      <div className={classNames('air__utils__heading', styles.page__header)}>
        <h4>Run</h4>
        <Dropdown overlay={menu}>
          <Button type="primary">
            Actions
            <DownOutlined />
          </Button>
        </Dropdown>
      </div>

      <Table
        dataSource={run.items}
        columns={columns}
        scroll={{ x: 1000 }}
        loading={run.isLoading}
        pagination={false}
        rowKey={(record) => record.id}
      />
    </>
  );
};

export default AnalysisRun;
