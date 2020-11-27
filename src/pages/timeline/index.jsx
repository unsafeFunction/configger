import React, { useEffect, Fragment, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import classNames from 'classnames';
import { Helmet } from 'react-helmet';

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
} from 'antd';
import {
  HomeOutlined,
  TableOutlined,
  FileExcelFilled,
  FilePdfFilled,
} from '@ant-design/icons';

import styles from './styles.module.scss';

const Timeline = () => {
  const dispatch = useDispatch();
  const timeline = useSelector(state => state.timeline.all);

  const downloadFile = useCallback(file => {
    dispatch({
      type: actions.DOWNLOAD_REQUEST,
      payload: file,
    });
  }, []);

  const getFileIcon = useCallback(fileType => {
    switch (fileType) {
      case 'application/pdf': {
        return <FilePdfFilled filled className="mr-2" />;
      }
      default: {
        return <FileExcelFilled className="mr-2" />;
      }
    }
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
    dispatch({
      type: actions.LOAD_TIMELINE_REQUEST,
      payload: {},
    });
  }, [dispatch]);

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
              {index === 0 && <DatePicker.RangePicker className="mb-1" />}
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
                  {commonInfo?.reports.map(report => {
                    return (
                      <div
                        key={report.company_location_uuid}
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
                            key: index,
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
