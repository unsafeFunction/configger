import {
  DownOutlined,
  ExclamationCircleTwoTone,
  InboxOutlined,
} from '@ant-design/icons';
import { Button, Dropdown, Menu, Table, Tooltip, Upload } from 'antd';
import classNames from 'classnames';
import ResultTag from 'components/widgets/ResultTag';
import moment from 'moment-timezone';
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import actions from 'redux/analysisRuns/actions';
import modalActions from 'redux/modal/actions';
import PoolCheckbox from './PoolCheckbox';
import styles from './styles.module.scss';

moment.tz.setDefault('America/New_York');

const AnalysisRun = () => {
  const dispatch = useDispatch();

  const run = useSelector((state) => state.analysisRuns.singleRun);
  const location = useLocation();

  const useFetching = () => {
    useEffect(() => {
      const runId = location.pathname.split('/')[2];

      dispatch({
        type: actions.FETCH_RUN_REQUEST,
        payload: {
          id: runId,
        },
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
    {
      title: 'Orf1ab',
      dataIndex: 'orf1ab',
    },
    {
      title: 'RP',
      dataIndex: 'rp',
    },
    {
      title: 'Reflex SC',
      dataIndex: 'reflex_sc',
      align: 'center',
      render: (value, record) => {
        return (
          <PoolCheckbox
            record={record}
            dataIndex="reflex_sc"
            value={value}
            title="Reflex SC"
          />
        );
      },
    },
    {
      title: 'Reflex SD',
      dataIndex: 'reflex_sd',
      align: 'center',
      render: (value, record) => {
        return (
          <PoolCheckbox
            record={record}
            dataIndex="reflex_sd"
            value={value}
            title="Reflex SD"
          />
        );
      },
    },
    {
      title: 'Rerun',
      dataIndex: 'rerun',
      align: 'center',
      render: (value, record) => {
        return (
          <PoolCheckbox
            record={record}
            dataIndex="rerun"
            value={value}
            title="Rerun"
          />
        );
      },
    },
  ];

  const onUploadRun = useCallback(
    (options) => {
      console.log(run);

      dispatch({
        type: actions.UPLOAD_RUN_RESULT_REQUEST,
        payload: {
          id: run.id,
          options,
        },
      });
    },
    [dispatch, run.id],
  );

  const handleSubmit = useCallback(() => {
    dispatch({
      type: modalActions.HIDE_MODAL,
    });
  }, [dispatch]);

  const onUploadClick = useCallback(() => {
    dispatch({
      type: modalActions.SHOW_MODAL,
      modalType: 'COMPLIANCE_MODAL',
      modalProps: {
        title: 'Upload run result',
        onOk: handleSubmit,
        message: () => (
          <Upload.Dragger
            customRequest={onUploadRun}
            maxCount={1}
            name="runFile"
            accept=".csv"
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Click or drag file to this area to upload
            </p>
            <p className="ant-upload-hint">
              Support for a single upload. You can upload only csv files.
            </p>
          </Upload.Dragger>
        ),
      },
    });
  }, [dispatch, onUploadRun, handleSubmit]);

  const menu = (
    <Menu>
      <Menu.Item key="1" disabled>
        View Timeline
      </Menu.Item>
      <Menu.Item key="2">View 96-well Plate</Menu.Item>
      <Menu.Item disabled key="3">
        Go to DataConnect
      </Menu.Item>
      <Menu.Item onClick={onUploadClick} key="4">
        Upload Raw Data
      </Menu.Item>
      <Menu.Item disabled key="5">
        Print Run
      </Menu.Item>
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
