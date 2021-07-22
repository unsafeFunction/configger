import { DownOutlined, InboxOutlined, SearchOutlined } from '@ant-design/icons';
import {
  Button,
  Col,
  Dropdown,
  Input,
  Menu,
  Popconfirm,
  Row,
  Table,
  Upload,
} from 'antd';
import classNames from 'classnames';
import ResultTag from 'components/widgets/ResultTag';
import WellPlate from 'components/widgets/WellPlate';
import debounce from 'lodash.debounce';
import moment from 'moment-timezone';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import actions from 'redux/analysisRuns/actions';
import modalActions from 'redux/modal/actions';
import { constants } from 'utils/constants';
import columns from './components';
import styles from './styles.module.scss';

moment.tz.setDefault('America/New_York');

const AnalysisRun = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const run = useSelector((state) => state.analysisRuns.singleRun);
  const [searchName, setSearchName] = useState('');

  const location = useLocation();

  const runId = location.pathname.split('/')[2];

  const { type, id } = useParams();

  const useFetching = () => {
    useEffect(() => {
      if ((run.items.length === 0 || run.id !== id) && !run.loading) {
        dispatch({
          type: actions.FETCH_RUN_REQUEST,
          payload: {
            id: runId,
          },
        });
      }
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

  const handleWellplateClose = useCallback(() => {
    dispatch({ type: modalActions.HIDE_MODAL });
    return history.push(`/analysis-runs/${id}`);
  }, [id, dispatch]);

  const isWellplate = useCallback(() => {
    return type === 'wellplate';
  }, [type]);

  useEffect(() => {
    if (isWellplate()) {
      dispatch({
        type: modalActions.SHOW_MODAL,
        modalType: 'COMPLIANCE_MODAL',
        modalProps: {
          title: 'Well Plate',
          cancelButtonProps: { className: styles.cancelBtn },
          onOk: () => handleWellplateClose(),
          onCancel: () => handleWellplateClose(),
          bodyStyle: {
            maxHeight: '70vh',
            overflow: 'scroll',
          },
          width: '30%',
          message: () => <WellPlate />,
        },
      });
    }
  }, [isWellplate]);

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

  const handleStatusAction = useCallback(
    (id, field, value) => {
      dispatch({
        type: actions.UPDATE_RUN_REQUEST,
        payload: {
          id,
          field,
          value,
        },
      });
    },
    [dispatch],
  );

  const handleShowWellplate = useCallback(() => {
    history.push(`/analysis-runs/${id}/wellplate`);
  }, [id]);

  const handleShowTable = useCallback(() => {
    history.push(`/analysis-runs/${id}`);
  }, [id]);

  const menu = (
    <Menu>
      <Menu.Item key="1" disabled={!type} onClick={handleShowTable}>
        View Table
      </Menu.Item>
      <Menu.Item key="2" disabled>
        View Timeline
      </Menu.Item>
      <Menu.Item onClick={handleShowWellplate} key="3">
        View 96-well Plate
      </Menu.Item>
      <Menu.Item key="4">
        <a
          href="https://apps.thermofisher.com/apps/spa/#/dataconnect"
          target="_blank"
          rel="noopener noreferrer"
        >
          Go to DataConnect
        </a>
      </Menu.Item>
      <Menu.Item
        onClick={onUploadClick}
        key="5"
        disabled={run.status === constants.runStatuses.published}
      >
        Upload Result
      </Menu.Item>
      <Menu.Item disabled key="6">
        Print Run
      </Menu.Item>
    </Menu>
  );

  const getBtnName = useCallback((status) => {
    switch (status) {
      case 'analysis':
        return 'Finish Analysis';
      case 'review':
        return 'Publish';
      default:
        return '';
    }
  }, []);

  const getNextStatus = useCallback((status) => {
    switch (status) {
      case 'analysis':
        return constants.runStatuses.review;
      case 'review':
        return constants.runStatuses.published;
      default:
        return '';
    }
  }, []);

  return (
    <>
      <div className={classNames('air__utils__heading', styles.page__header)}>
        <h4>Run</h4>
        {run.status && <ResultTag status={run.status} type="run" />}
      </div>

      <Table
        dataSource={run.items}
        columns={columns}
        scroll={{ x: 2000 }}
        loading={run.isLoading}
        pagination={false}
        rowKey={(record) => {
          return record.sample_id ?? record.wells;
        }}
        title={() => (
          <Row gutter={16}>
            <Col
              xs={{ span: 24 }}
              sm={{ span: 12 }}
              md={{ span: 9 }}
              lg={{ span: 7 }}
              xl={{ span: 6 }}
              xxl={{ span: 7 }}
            >
              <Input
                size="middle"
                prefix={<SearchOutlined />}
                className={styles.search}
                placeholder="Enter Sample ID"
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
                {(run.status === constants.runStatuses.analysis ||
                  run.status === constants.runStatuses.review) && (
                  <Popconfirm
                    title={`Are you sure you would like to ${getBtnName(
                      run.status?.toLowerCase(),
                    )}?`}
                    onConfirm={() =>
                      handleStatusAction(
                        runId,
                        'status',
                        getNextStatus(run.status?.toLowerCase()),
                      )
                    }
                    placement="topRight"
                  >
                    <Button type="primary" ghost loading={run.isLoading}>
                      {getBtnName(run.status?.toLowerCase())}
                    </Button>
                  </Popconfirm>
                )}
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
