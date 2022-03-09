import {
  InboxOutlined,
  SearchOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import {
  Button,
  Col,
  DatePicker,
  Input,
  Popconfirm,
  Row,
  Table,
  Upload,
} from 'antd';
import classNames from 'classnames';
import TableFooter from 'components/layout/TableFooterLoader';
import ActionInitiator from 'components/widgets/ActionInitiator';
import ResultTag from 'components/widgets/ResultTag';
import SearchTooltip from 'components/widgets/SearchTooltip';
import map from 'lodash.map';
import mapValues from 'lodash.mapvalues';
import moment from 'moment-timezone';
import qs from 'qs';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory, useLocation } from 'react-router-dom';
import actions from 'redux/analysisRuns/actions';
import modalActions from 'redux/modal/actions';
import { constants } from 'utils/constants';
import useCustomFilters from 'utils/useCustomFilters';
import { rowCounter } from 'utils/tableFeatures';
import styles from './styles.module.scss';
import debounce from 'lodash.debounce';

const { RangePicker } = DatePicker;

const AnalysisRuns = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [filters, setFilters] = useState({});
  const location = useLocation();
  const stateRef = useRef();

  const initialFiltersState = {
    search: '',
    dates: [
      constants.analysisRuns.initialDates.from,
      constants.analysisRuns.initialDates.to,
    ],
  };

  const [filtersState, filtersDispatch] = useCustomFilters(initialFiltersState);

  stateRef.current = filtersState.dates;

  const runs = useSelector((state) => state.analysisRuns.all);

  const { from, to } = qs.parse(location.search, {
    ignoreQueryPrefix: true,
  });

  const isActualDate =
    from === initialFiltersState.dates[0] &&
    to === initialFiltersState.dates[1];

  const isSearchEmpty = !filtersState.search.length;

  const useFetching = () => {
    useEffect(() => {
      const filteringParams = {
        limit: constants.analysisRuns.itemsLoadingCount,
        search: filtersState.search,
      };

      const params =
        from && to
          ? {
              created_after: from,
              created_before: to,
              ...filteringParams,
            }
          : filteringParams;

      dispatch({
        type: actions.FETCH_RUNS_REQUEST,
        payload: {
          ...params,
          ...filters,
        },
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filtersState.dates, filters]);
  };

  useFetching();

  const handleResetFilters = () => {
    history.push({
      search: `?from=${initialFiltersState.dates[0]}&to=${initialFiltersState.dates[1]}`,
    });
    return filtersDispatch({
      type: 'reset',
    });
  };

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

  const sendQuery = useCallback(
    (query) => {
      const filteringParams = {
        limit: constants.analysisRuns.itemsLoadingCount,
        search: query,
        ...filters,
      };

      const params = stateRef.current.length
        ? {
            created_after: stateRef.current[0],
            created_before: stateRef.current[1],
            ...filteringParams,
          }
        : filteringParams;

      return dispatch({
        type: actions.FETCH_RUNS_REQUEST,
        payload: {
          ...params,
        },
      });
    },
    [dispatch, filters],
  );

  const delayedQuery = useMemo(() => debounce((q) => sendQuery(q), 500), [
    sendQuery,
  ]);

  useEffect(() => {
    return () => {
      delayedQuery.cancel();
    };
  }, [delayedQuery]);

  const onChangeSearch = ({ target }) => {
    filtersDispatch({
      type: 'setValue',
      payload: {
        name: 'search',
        value: target.value,
      },
    });

    return delayedQuery(target.value);
  };

  const rangePickerValue =
    filtersState.dates.length > 0
      ? [moment(filtersState.dates[0]), moment(filtersState.dates[1])]
      : [];

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
    rowCounter,
    {
      title: 'Run Title',
      dataIndex: 'title',
      render: (_, record) => (
        <Link to={`/analysis-runs/${record.id}`} className="text-blue">
          {record.title}
        </Link>
      ),
    },
    {
      title: 'Creation Date',
      dataIndex: 'created',
      render: (value) =>
        value ? moment(value).format(constants.dateTimeFormat) : '-',
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
          text: value === constants.runStatuses.published ? 'FINALIZED' : value,
          value,
        };
      }),
      filterMultiple: false,
    },
    {
      title: 'Last Updated',
      dataIndex: 'modified',
      render: (value) =>
        value ? moment(value).format(constants.dateTimeFormat) : '-',
    },
    {
      title: 'Created By',
      dataIndex: 'user',
      render: (value) => <ActionInitiator initiator={value} />,
    },
    {
      title: 'Run Type',
      dataIndex: 'type',
    },
    {
      title: 'Actions',
      render: (_, run) => (
        <Popconfirm
          title={`Are you sure you want to overwrite the results for the ${run.title} run?`}
          onConfirm={() => onUploadClick(run.id)}
          placement="topRight"
          disabled={
            run.status !== constants.runStatuses.analysis &&
            run.status !== constants.runStatuses.review
          }
        >
          <Button
            onClick={() =>
              run.status === constants.runStatuses.qpcr && onUploadClick(run.id)
            }
            icon={<UploadOutlined />}
            type="link"
            disabled={run.status === constants.runStatuses.published}
          >
            Upload result
          </Button>
        </Popconfirm>
      ),
    },
  ];

  const onDatesChange = useCallback(
    (dates, dateStrings) => {
      if (dates) {
        history.push({
          search: `?from=${dateStrings[0]}&to=${dateStrings[1]}`,
        });
      } else {
        history.push({
          search: '',
        });
      }
      return filtersDispatch({
        type: 'setValue',
        payload: {
          name: 'dates',
          value: dates ? dateStrings : [],
        },
      });
    },
    [history, filtersDispatch],
  );

  const loadMore = () => {
    const filteringParams = {
      limit: constants.analysisRuns.itemsLoadingCount,
      offset: runs.offset,
      search: filtersState.search,
      ...filters,
    };

    const params =
      from && to
        ? {
            created_after: from,
            created_before: to,
            ...filteringParams,
          }
        : filteringParams;

    dispatch({
      type: actions.FETCH_RUNS_REQUEST,
      payload: {
        ...params,
        ...filters,
      },
    });
  };

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
        scroll={{ x: 1250 }}
        loading={runs?.isLoading}
        align="center"
        pagination={false}
        rowKey={(record) => record.id}
        onChange={handleTableChange}
        title={() => (
          <Row gutter={16}>
            <Col
              xs={{ span: 24 }}
              sm={{ span: 10 }}
              md={{ span: 9, offset: 2 }}
              lg={{ span: 7, offset: 7 }}
              xl={{ span: 6, offset: 9 }}
              xxl={{ span: 7, offset: 9 }}
            >
              <SearchTooltip searchFields={['Run Title']}>
                <Input
                  size="middle"
                  prefix={<SearchOutlined />}
                  placeholder="Search..."
                  value={filtersState.search}
                  allowClear
                  onChange={onChangeSearch}
                />
              </SearchTooltip>
            </Col>
            <Col
              xs={{ span: 24 }}
              sm={{ span: 10 }}
              md={{ span: 9 }}
              lg={{ span: 7 }}
              xl={{ span: 6 }}
              xxl={{ span: 5 }}
            >
              <RangePicker
                value={rangePickerValue}
                format="YYYY-MM-DD"
                ranges={{
                  Today: [moment(), moment()],
                  'Last 7 Days': [moment().subtract(7, 'days'), moment()],
                  'This Month': [
                    moment().startOf('month'),
                    moment().endOf('month'),
                  ],
                }}
                className={styles.rangePicker}
                onChange={onDatesChange}
              />
            </Col>
            <Col
              xs={{ span: 24 }}
              sm={{ span: 4 }}
              md={{ span: 4 }}
              lg={{ span: 3 }}
              className={styles.resetFilters}
            >
              <Button
                onClick={handleResetFilters}
                disabled={isActualDate && isSearchEmpty}
              >
                Reset
              </Button>
            </Col>
          </Row>
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
