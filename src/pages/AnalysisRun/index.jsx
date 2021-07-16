import { DownOutlined, InboxOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Col, Dropdown, Input, Menu, Row, Table, Upload } from 'antd';
import classNames from 'classnames';
import debounce from 'lodash.debounce';
import moment from 'moment-timezone';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import actions from 'redux/analysisRuns/actions';
import modalActions from 'redux/modal/actions';
import columns from './components';
import styles from './styles.module.scss';

moment.tz.setDefault('America/New_York');

const AnalysisRun = () => {
  const dispatch = useDispatch();

  const run = useSelector((state) => state.analysisRuns.singleRun);
  const [searchName, setSearchName] = useState('');

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

  const sendQuery = useCallback(
    (query) => {
      // TODO: search dispatch
      console.log(query);
    },
    [searchName],
  );

  const delayedQuery = useCallback(
    debounce((q) => sendQuery(q), 500),
    [],
  );

  const onChangeSearch = useCallback(
    (event) => {
      setSearchName(event.target.value);
      delayedQuery(event.target.value);
    },
    [delayedQuery],
  );

  useFetching();

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

  const handleStatusAction = useCallback(() => {
    console.log('foo');
  }, []);

  const menu = (
    <Menu>
      <Menu.Item key="1" disabled>
        View Timeline
      </Menu.Item>
      <Menu.Item key="2">View 96-well Plate</Menu.Item>
      <Menu.Item key="3">
        <a
          href="https://apps.thermofisher.com/apps/spa/#/dataconnect"
          target="_blank"
          rel="noopener noreferrer"
        >
          Go to DataConnect
        </a>
      </Menu.Item>
      <Menu.Item onClick={onUploadClick} key="4">
        Upload Raw Data
      </Menu.Item>
      <Menu.Item disabled key="5">
        Print Run
      </Menu.Item>
    </Menu>
  );

  const getBtnName = useCallback((status) => {
    switch (status) {
      case 'review':
      case 'published':
        return 'Publish';
      default:
        return 'Finish Analysis';
    }
  }, []);

  return (
    <>
      <div className={classNames('air__utils__heading', styles.page__header)}>
        <h4>Run</h4>
      </div>

      <Table
        dataSource={run.items}
        columns={columns}
        scroll={{ x: 1400 }}
        loading={run.isLoading}
        pagination={false}
        rowKey={(record) => {
          if (record.children) {
            return record.sample_id;
          }
          return record.wells;
        }}
        title={() => (
          <Row gutter={16}>
            <Col
              xs={{ span: 24 }}
              sm={{ span: 12 }}
              md={{ span: 9, offset: 6 }}
              lg={{ span: 7, offset: 10 }}
              xl={{ span: 6, offset: 12 }}
              xxl={{ span: 7, offset: 12 }}
            >
              <Input
                size="middle"
                prefix={<SearchOutlined />}
                className={styles.search}
                placeholder="Search..."
                value={searchName}
                onChange={onChangeSearch}
              />
            </Col>
            <Col
              xs={{ span: 24 }}
              sm={{ span: 12 }}
              md={{ span: 9 }}
              lg={{ span: 7 }}
              xl={{ span: 6 }}
              xxl={{ span: 5 }}
            >
              <div className={styles.actionsWrapper}>
                <Button type="primary" ghost onClick={handleStatusAction}>
                  {getBtnName(run?.status?.toLowerCase())}
                </Button>
                <Dropdown overlay={menu}>
                  <Button type="primary">
                    Actions
                    <DownOutlined />
                  </Button>
                </Dropdown>
              </div>
            </Col>
          </Row>
        )}
      />
    </>
  );
};

export default AnalysisRun;
