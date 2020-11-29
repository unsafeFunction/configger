import React, { useEffect, Fragment, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import classNames from 'classnames';
import { Helmet } from 'react-helmet';
import qs from 'qs';

import actions from 'redux/timeline/actions';

import {
  Statistic,
  Card,
  Row,
  Col,
  Table,
  Tag,
  Button,
  DatePicker,
  Empty,
} from 'antd';
import Loader from 'components/layout/Loader';
import {
  HomeOutlined,
  TableOutlined,
  FileExcelFilled,
  FilePdfFilled,
} from '@ant-design/icons';

import styles from './styles.module.scss';

const Timeline = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const timeline = useSelector(state => state.timeline.all);
  const [dates, setDates] = useState([]);
  const { from, to } = qs.parse(history.location.search, {
    ignoreQueryPrefix: true,
  });

  const downloadFile = useCallback(file => {
    dispatch({
      type: actions.DOWNLOAD_REQUEST,
      payload: file,
    });
  }, []);

  const getFileIcon = useCallback(fileType => {
    switch (fileType) {
      case 'application/pdf': {
        return <FilePdfFilled  className="mr-2" />;
      }
      default: {
        return <FileExcelFilled className="mr-2" />;
      }
    }
  }, []);

  const onDatesChange = useCallback(
    (dates, dateStrings) => {
      if (dates) {
        history.push({
          search: `?from=${dateStrings[0]}&to=${dateStrings[1]}`,
        });
        return setDates(dateStrings);
      }
      history.push({ search: '' });
      return setDates([]);
    },
    [history],
  );

  const clearFilter = useCallback(() => {
    history.push({
      search: '',
    });
    setDates([]);
  }, []);

  const columns = [
    {
      title: 'Poll',
      width: 50,
      dataIndex: 'name',
      key: 'name',
      fixed: 'left',
    },
    {
      title: 'Result',
      width: 100,
      dataIndex: 'status',
      key: 'status',
      render: value => (
        <Tag color={value === 'Not Detected' ? 'volcano' : 'red'}>{value}</Tag>
      ),
    },
    {
      title: 'Samples',
      dataIndex: 'size',
      key: 'size',
      width: 150,
    },
    {
      title: 'Result updated on',
      dataIndex: 'results_updated_on',
      key: 'results_updated_on',
      width: 150,
    },
    {
      title: 'Action',
      key: 'actions',
      fixed: 'right',
      width: 100,
      render: value => {
        return (
          <Button
            className={styles.downloadButton}
            color="#0887c9"
            type="primary"
            onClick={() => {
              downloadFile({
                link: value.barcodes_report.url,
                name: value.barcodes_report.file_name,
                contentType: 'application/pdf',
              });
            }}
          >
            Download barcodes
          </Button>
        );
      },
    },
  ];

  useEffect(() => {
    const params = from && to && { from, to };

    dispatch({
      type: actions.LOAD_TIMELINE_REQUEST,
      payload: {
        ...params,
      },
    });
  }, [dispatch, history, dates]);

  const expandedRowRender = barcodes => {
    const columns = [
      { title: 'Sample', dataIndex: 'sample', key: 'sample' },
      {
        title: 'Sample barcode',
        dataIndex: 'sample_barcode',
        key: 'sample_barcode',
      },
    ];

    return <Table columns={columns} dataSource={barcodes} pagination={false} />;
  };

  if (!timeline.isLoading) {
    return <Loader />;
  }

  if (Object.keys(timeline?.items ?? []).length === 0) {
    return (
      <Empty
        imageStyle={{
          height: 60,
        }}
      >
        <Button onClick={clearFilter} type="primary">
          Clear filter
        </Button>
      </Empty>
    );
  }
  return (
    <div>
      <Helmet title="Timeline" />
      {Object.keys(timeline?.items ?? []).map((timelineDate, index) => {
        const commonInfo = Object.values(timeline?.items[timelineDate][0])[0];
        return (
          <Fragment key={`${timelineDate}-${index}`}>
            <div
              className={classNames(
                'air__utils__heading',
                styles.poolPartHeader,
              )}
            >
              <h5>{moment(timelineDate).format('LL')}</h5>
              {index === 0 && (
                <DatePicker.RangePicker
                  defaultValue={from && to ? [moment(from), moment(to)] : null}
                  format="YYYY-MM-DD"
                  onChange={onDatesChange}
                  className="mb-1"
                />
              )}
            </div>
            <Row className="mb-3" gutter={16}>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="Location"
                    value={commonInfo?.stats.location_name}
                    prefix={<HomeOutlined className={styles.statisticIcon} />}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="Total pools count"
                    value={commonInfo?.stats.pool_count}
                    prefix={<TableOutlined className={styles.statisticIcon} />}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="Total samples count"
                    value={commonInfo?.stats.sample_count}
                    prefix={<TableOutlined className={styles.statisticIcon} />}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card className={styles.reportCart}>
                  {commonInfo?.reports.map((report, index) => {
                    return (
                      <div
                        key={`${report.company_location_uuid}-${index}`}
                        onClick={() => {
                          downloadFile({
                            link: report.report_url,
                            name: report.report_filename,
                            contentType: report.report_content_type,
                          });
                        }}
                        className={styles.report}
                        role="presentation"
                      >
                        {getFileIcon(report.report_content_type)}
                        <span>{report?.report_type}</span>
                      </div>
                    );
                  })}
                </Card>
              </Col>
            </Row>
            {timeline?.items[timelineDate].map(timelineItem => {
              const pools = Object.values(timelineItem)[0].pools?.map(
                (pool, index) => {
                  return {
                    ...pool,
                    key: index,
                    name: pool.title,
                    status: pool.result,
                    size: pool.pool_size,
                    results_updated_on: pool.results_updated_on,
                  };
                },
              );

              return (
                <Table
                  className="mb-5"
                  pagination={false}
                  columns={columns}
                  dataSource={pools}
                  scroll={{ x: 1500, y: 1500 }}
                  bordered
                  expandable={{
                    expandedRowRender: record => {
                      return expandedRowRender(
                        record.tube_ids.map((tubeId, index) => {
                          return {
                            key: tubeId,
                            sample: index + 1,
                            sample_barcode: tubeId,
                          };
                        }),
                      );
                    },
                  }}
                />
              );
            })}
          </Fragment>
        );
      })}
    </div>
  );
};

export default Timeline;
