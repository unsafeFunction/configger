import { DownOutlined, InboxOutlined, SearchOutlined } from '@ant-design/icons';
import {
  Button,
  Drawer,
  Dropdown,
  Input,
  Menu,
  Popconfirm,
  Table,
  Upload,
} from 'antd';
import classNames from 'classnames';
import ResultTag from 'components/widgets/ResultTag';
import RunTimeline from 'components/widgets/Timeline';
import WellPlate from 'components/widgets/WellPlate';
import debounce from 'lodash.debounce';
import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import actions from 'redux/analysisRuns/actions';
import helperActions from 'redux/helpers/actions';
import modalActions from 'redux/modal/actions';
import timelineActions from 'redux/timeline/actions';
import { constants } from 'utils/constants';
import { getColor, getIcon } from 'utils/highlighting';
import columns, { getTargetColumns, Actions, WellsColumn } from './components';
import styles from './styles.module.scss';

const AnalysisRun = () => {
  const { poolResults } = constants;
  const dispatch = useDispatch();

  const run = useSelector((state) => state.analysisRuns.singleRun);
  const timeline = useSelector((state) => state.timeline);

  const [searchName, setSearchName] = useState('');
  const [samples, setSamples] = useState([]);
  const [isTimelineOpen, setOpen] = useState(false);
  const [targets, setTargets] = useState([]);
  const location = useLocation();

  const runId = location.pathname.split('/')[2];

  const { id } = useParams();

  const useFetching = () => {
    useEffect(() => {
      dispatch({
        type: actions.FETCH_RUN_REQUEST,
        payload: {
          id: runId,
        },
      });
    }, []);
  };

  useFetching();

  useEffect(() => {
    setSamples(run.items);
    const targets = run?.items[0] && Object.keys(run?.items?.[0]?.mean);

    if (targets) {
      const targetColumns = getTargetColumns(run.run_method);
      setTargets(targetColumns);
    }
  }, [run.items]);

  const sendQuery = useCallback(
    (query) => {
      setSamples(
        run.items.filter((sample) =>
          sample?.display_sample_id
            ?.toLowerCase()
            .includes(query.toLowerCase()),
        ),
      );
    },
    [run],
  );

  const delayedQuery = useMemo(() => debounce((q) => sendQuery(q), 500), [
    sendQuery,
  ]);

  useEffect(() => {
    return () => {
      delayedQuery.cancel();
    };
  }, [delayedQuery]);

  const onChangeSearch = useCallback(
    (event) => {
      setSearchName(event.target.value);
      delayedQuery(event.target.value);
    },
    [delayedQuery],
  );

  const onLoadTimeline = useCallback(() => {
    dispatch({
      type: timelineActions.LOAD_TIMELINE_REQUEST,
      payload: {
        id: run.id,
      },
    });
  }, [dispatch, run.id]);

  const onUploadRun = useCallback(
    (options) => {
      dispatch({
        type: actions.UPLOAD_RUN_RESULT_REQUEST,
        payload: {
          id: runId,
          options,
        },
      });
    },
    [dispatch, runId],
  );

  const handleWellplateClose = useCallback(() => {
    dispatch({ type: modalActions.HIDE_MODAL });
  }, [dispatch]);

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
    dispatch({
      type: modalActions.SHOW_MODAL,
      modalType: 'COMPLIANCE_MODAL',
      modalProps: {
        width: 'max-content',
        title: 'Well Plate',
        cancelButtonProps: { className: styles.cancelBtn },
        onOk: () => handleWellplateClose(),
        onCancel: () => handleWellplateClose(),
        bodyStyle: {
          maxHeight: '70vh',
          overflow: 'auto',
        },
        message: () => <WellPlate runId={id} />,
      },
    });
  }, [id, dispatch, handleWellplateClose]);

  const onTimelineOpenClose = () => {
    setOpen(!isTimelineOpen);
    if (!isTimelineOpen) onLoadTimeline();
  };

  const exportRun = useCallback(
    ({ runId }) => {
      dispatch({
        type: helperActions.EXPORT_FILE_REQUEST,
        payload: {
          link: `/runs/${runId}/export/`,
          instanceId: runId,
        },
      });
    },
    [dispatch],
  );

  const menu = (
    <Menu>
      <Menu.Item onClick={onTimelineOpenClose} key="timeline">
        View Timeline
      </Menu.Item>
      <Menu.Item onClick={handleShowWellplate} key="96-well-plate">
        View 96-well Plate
      </Menu.Item>
      <Menu.Item key="dataconnect">
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
        key="upload-result"
        disabled={run.status === constants.runStatuses.published}
      >
        Upload Result
      </Menu.Item>
      <Menu.Item
        disabled
        key="print"
        onClick={() => {
          return exportRun({ runId });
        }}
      >
        Print Run
      </Menu.Item>
    </Menu>
  );

  const samplesMenu = (
    <Menu>
      {Object.values(poolResults).map((value) => (
        <Menu.Item
          key={value}
          style={{
            color: getColor(value.toLowerCase()),
          }}
          icon={getIcon(value.toLowerCase())}
        >
          {value.replace('_', ' ')}:{' '}
          {run?.items?.filter?.((el) => el.analysis_result === value)?.length ||
            '-'}
        </Menu.Item>
      ))}
    </Menu>
  );

  const getBtnName = useCallback((status) => {
    switch (status) {
      case 'analysis':
        return 'Finish Analysis';
      case 'review':
        return 'Finalize';
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

  const wells = run?.status === 'QPCR' ? {} : WellsColumn;

  return (
    <>
      <div className={classNames('air__utils__heading', styles.page__header)}>
        <h4>{`Run (${run.title || '-'})`}</h4>
        <div>
          {run.status && <ResultTag status={run.status} type="run" />}
          <Dropdown overlay={samplesMenu} className={styles.dropdown_samples}>
            <Button>
              Total samples: {run?.items?.length || '-'}
              <DownOutlined />
            </Button>
          </Dropdown>
        </div>
      </div>
      <Drawer
        title="Timeline"
        width={720}
        onClose={onTimelineOpenClose}
        visible={isTimelineOpen}
        bodyStyle={{ paddingBottom: 80, paddingLeft: 0 }}
      >
        <RunTimeline timeline={timeline.items} />
      </Drawer>
      <Table
        dataSource={samples}
        fixed
        columns={[
          ...columns,
          wells,
          ...targets,
          {
            title: 'Actions',
            dataIndex: 'actions',
            width: 460,
            render: (_, record) => {
              return (
                <Actions
                  record={record}
                  field="actions"
                  value={
                    record.auto_publish ? record.rerun_action : 'DO_NOT_PUBLISH'
                  }
                />
              );
            },
          },
        ]}
        scroll={{ x: 2000, y: '69vh' }}
        loading={run.isLoading}
        pagination={false}
        rowKey={(record) => {
          return record.sample_id ?? record.wells;
        }}
        title={() => (
          <div className={styles.tableHeader}>
            <Input
              prefix={<SearchOutlined />}
              className={styles.search}
              placeholder="Enter Sample ID"
              value={searchName}
              onChange={onChangeSearch}
              allowClear
            />
            <div>
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
                  <Button
                    type="primary"
                    ghost
                    loading={run.isLoading}
                    className="mr-3"
                  >
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
          </div>
        )}
      />
    </>
  );
};

export default AnalysisRun;
