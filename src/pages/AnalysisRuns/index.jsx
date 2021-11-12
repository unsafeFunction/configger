import { InboxOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, DatePicker, Table, Upload } from 'antd';
import classNames from 'classnames';
import TableFooter from 'components/layout/TableFooterLoader';
import ResultTag from 'components/widgets/ResultTag';
import map from 'lodash.map';
import mapValues from 'lodash.mapvalues';
import moment from 'moment-timezone';
import qs from 'qs';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory, useLocation } from 'react-router-dom';
import actions from 'redux/analysisRuns/actions';
import modalActions from 'redux/modal/actions';
import { constants } from 'utils/constants';
import styles from './styles.module.scss';

moment.tz.setDefault('America/New_York');

const { RangePicker } = DatePicker;

const AnalysisRuns = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [dates, setDates] = useState([]);
  const [filters, setFilters] = useState({});
  const location = useLocation();
  const stateRef = useRef();
  stateRef.current = dates;

  const runs = useSelector((state) => state.analysisRuns.all);

  const { from, to } = qs.parse(location.search, {
    ignoreQueryPrefix: true,
  });

  const useFetching = () => {
    useEffect(() => {
      const params =
        from && to
          ? {
              created_after: from,
              created_before: to,
              limit: constants?.runs?.itemsLoadingCount,
            }
          : { limit: constants?.runs?.itemsLoadingCount };
      dispatch({
        type: actions.FETCH_RUNS_REQUEST,
        payload: {
          ...params,
          ...filters,
        },
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, from, to, history, filters]);
  };

  useFetching();

  const runsItems = runs?.items;

  const onUploadRun = useCallback(
    (id, options) => {
      dispatch({
        type: actions.UPLOAD_RUN_RESULT_REQUEST,
        payload: {
          id,
          options,
        },
      });
    },
    [dispatch],
  );

  const handleSubmit = useCallback(() => {
    dispatch({
      type: modalActions.HIDE_MODAL,
    });
  }, [dispatch]);

  const onUploadClick = useCallback(
    (id) => {
      dispatch({
        type: modalActions.SHOW_MODAL,
        modalType: 'COMPLIANCE_MODAL',
        modalProps: {
          title: 'Upload run result',
          onOk: handleSubmit,
          message: () => (
            <Upload.Dragger
              customRequest={(options) => onUploadRun(id, options)}
              maxCount={1}
              name="runFile"
              accept=".csv"
              // Need to parse .csv before upload for render preview
              // beforeUpload={(file) => {
              //   const reader = new FileReader();

              //   reader.onload = (e) => {
              //     console.log(e.target.result);
              //   };
              //   reader.readAsText(file);

              //   // Prevent upload
              //   return false;
              // }}
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
    },
    [dispatch, onUploadRun, handleSubmit],
  );

  const columns = [
    {
      title: 'Run Title',
      dataIndex: 'title',
      render: (_, record) => (
        <Link to={`/analysis-runs/${record.id}`} className="text-blue">
          {record.title}
        </Link>
      ),
      width: 100,
    },
    {
      title: 'Creation Date',
      dataIndex: 'created',
      render: (value) => (value ? moment(value).format('lll') : '-'),
    },
    {
      title: 'Samples',
      dataIndex: 'samples_count',
    },
    {
      title: `Status`,
      dataIndex: 'status',
      render: (value) => {
        return <ResultTag status={value} type="run" />;
      },
      filters: map(constants.runStatuses, (value) => {
        return {
          text: value,
          value,
        };
      }),
      filterMultiple: false,
    },
    {
      title: 'Last Updated',
      dataIndex: 'modified',
      render: (value) => (value ? moment(value).format('lll') : '-'),
    },
    {
      title: 'Created By',
      dataIndex: 'user',
    },
    {
      title: 'Run Type',
      dataIndex: 'type',
    },
    {
      title: 'Actions',
      render: (_, run) => (
        <Button
          onClick={() => onUploadClick(run.id)}
          icon={<UploadOutlined />}
          type="link"
          disabled={run.status === constants.runStatuses.published}
        >
          Upload result
        </Button>
      ),
    },
  ];

  const onDatesChange = useCallback(
    (dates, dateStrings) => {
      if (dates) {
        history.push({
          search: `?from=${dateStrings[0]}&to=${dateStrings[1]}`,
        });
        setDates(dateStrings);
      } else {
        history.push({ search: '' });
        setDates([]);
      }
    },
    [history],
  );

  const loadMore = useCallback(() => {
    const params =
      from && to
        ? {
            created_after: from,
            created_before: to,
            limit: constants?.runs?.itemsLoadingCount,
            offset: runs.offset,
          }
        : {
            limit: constants?.runs?.itemsLoadingCount,
            offset: runs.offset,
          };
    dispatch({
      type: actions.FETCH_RUNS_REQUEST,
      payload: {
        ...params,
        ...filters,
      },
    });
  }, [dispatch, from, to, runs, filters]);

  const handleTableChange = (pagination, filters) => {
    const formattedFilters = mapValues(filters, (value) => {
      return value ? value[0] : undefined;
    });
    setFilters(formattedFilters);
  };

  return (
    <>
      <div className={classNames('air__utils__heading', styles.page__header)}>
        <h4>Runs</h4>
      </div>

      <Table
        dataSource={runsItems}
        columns={columns}
        scroll={{ x: 1200 }}
        loading={runs?.isLoading}
        align="center"
        pagination={false}
        rowKey={(record) => record.id}
        onChange={handleTableChange}
        title={() => (
          <div className="d-flex">
            <RangePicker
              defaultValue={
                from && to
                  ? [moment(from), moment(to)]
                  : [moment().subtract(7, 'days'), moment()]
              }
              format="YYYY-MM-DD"
              ranges={{
                Today: [moment(), moment()],
                'Last 7 Days': [moment().subtract(7, 'days'), moment()],
                'This Month': [
                  moment().startOf('month'),
                  moment().endOf('month'),
                ],
              }}
              className="ml-auto"
              onChange={onDatesChange}
            />
          </div>
        )}
      />
      <TableFooter
        loading={runs?.isLoading}
        disabled={runsItems.length >= runs?.total}
        loadMore={loadMore}
      />
    </>
  );
};

export default AnalysisRuns;
