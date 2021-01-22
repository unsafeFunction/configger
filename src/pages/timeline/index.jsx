import React, { useEffect, Fragment, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import classNames from 'classnames';
import { Helmet } from 'react-helmet';
import qs from 'qs';
import orderBy from 'lodash.orderby';

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
  Tooltip,
  Typography,
} from 'antd';
import Loader from 'components/layout/Loader';
import {
  HomeOutlined,
  TableOutlined,
  FileExcelFilled,
  FilePdfFilled,
  FileOutlined,
  IdcardOutlined,
} from '@ant-design/icons';
import { DownloadLogo } from 'assets';

import actions from 'redux/timeline/actions';

import styles from './styles.module.scss';
import useWindowSize from '../../hooks/useWindowSize';
import { getColor, getIcon } from 'utils/highlightingResult';

const Timeline = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const timeline = useSelector(state => state.timeline.all);
  const [dates, setDates] = useState([]);
  const { from, to } = qs.parse(history.location.search, {
    ignoreQueryPrefix: true,
  });

  const { isMobile } = useWindowSize();

  const downloadFile = useCallback(file => {
    dispatch({
      type: actions.DOWNLOAD_REQUEST,
      payload: file,
    });
  }, []);

  const getFileIcon = useCallback(fileType => {
    switch (fileType) {
      case 'application/pdf': {
        return <FilePdfFilled className="mr-2" />;
      }
      default: {
        return <FileExcelFilled className="mr-2" />;
      }
    }
  }, []);

  const handleDownloadBarcodes = useCallback(value => {
    downloadFile({
      link: value.barcodes_report.url,
      name: value.barcodes_report.file_name,
      contentType: 'application/csv',
    });
  }, []);

  const getDescription = status => {
    switch (status) {
      case 'COVID-19 Detected': {
        return (
          <div className={styles.hintItem}>
            <Typography.Text className={styles.hintStatus} type="danger">
              DETECTED - &nbsp;
            </Typography.Text>
            <span className={styles.hintDescription}>
              results are indicative of the presence of SARS-CoV-2 RNA. Detected
              results do not rule out bacterial infection or co-infection with
              other viruses. The agent detected may not be the definitive cause
              of disease. Laboratories within the United States and its
              territories are required to report all positive results to the
              appropriate public health authorities.
            </span>
          </div>
        );
      }
      case 'Not Detected': {
        return (
          <div className={styles.hintItem}>
            <span className={styles.hintStatus}>NOT DETECTED - </span>
            <span className={styles.hintDescription}>
              results do not preclude SARS-CoV-2 infection and should not be
              used as the sole basis for patient management decisions.
            </span>
          </div>
        );
      }
      case 'Inconclusive': {
        return (
          <div className={styles.hintItem}>
            <span className={styles.hintStatus}>INCONCLUSIVE - </span>
            <span className={styles.hintDescription}>
              results are indicative of the presence of SARS-CoV-2 RNA that does
              not meet the limit of detection. A confirmatory test is
              recommended 48-72 hours from the prior test.
            </span>
          </div>
        );
      }
      case 'In Progress': {
        return (
          <div className={styles.hintItem}>
            <span className={styles.hintStatus}>IN PROGRESS - </span>
            <span className={styles.hintDescription}>
              Your samples were tested but need to be retested due to a quality
              control.
            </span>
          </div>
        );
      }
      case 'Processing': {
        return (
          <div className={styles.hintItem}>
            <span className={styles.hintStatus}>Processing - </span>
            <span className={styles.hintDescription}>
              Your samples were received by the lab and are in queue to be
              tested
            </span>
          </div>
        );
      }
      case 'Invalid': {
        return (
          <div className={styles.hintItem}>
            <span className={styles.hintStatus}>INVALID - </span>
            <span className={styles.hintDescription}>
              Your samples obtained no result. Either the sample quality was
              poor or there was not sufficient sample volume for testing.
              Samples must be resubmitted. The lab has completed testing on the
              samples.
            </span>
          </div>
        );
      }
    }
  };

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
      title: 'Pool',
      width: 100,
      dataIndex: 'name',
      key: 'name',
      sorter: {
        compare: (a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0),
      },
    },
    {
      title: 'Result',
      width: 100,
      dataIndex: 'status',
      key: 'status',
      render: value => (
        <Tooltip
          placement="bottom"
          title={getDescription(value)}
          overlayClassName={styles.hintTooltip}
        >
          <Tag color={getColor(value)} icon={getIcon(value)}>
            {value === 'COVID-19 Detected' ? 'DETECTED' : value.toUpperCase()}
          </Tag>
        </Tooltip>
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
      align: isMobile && 'center',
      width: isMobile ? 58 : 85,
      render: value => {
        return isMobile ? (
          <DownloadLogo
            width="30px"
            height="30px"
            className={styles.downloadBarcodesIcon}
            onClick={() => handleDownloadBarcodes(value)}
          />
        ) : (
          <Button
            className={styles.downloadBarcodesBtn}
            type="primary"
            onClick={() => handleDownloadBarcodes(value)}
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

  const expandedRow = barcodes => {
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
      <Helmet title="Results" />
      {Object.keys(timeline?.items ?? []).map((timelineDate, index) => {
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

            {timeline?.items[timelineDate].map((timelineItem, index) => {
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
              const commonInfo = Object.values(timelineItem)[0];

              return (
                <>
                  <Row className="mb-3" gutter={16}>
                    <Col span={6} xs={24} md={6} className="mb-3">
                      <Card className={styles.statCart}>
                        <Statistic
                          className={styles.locationName}
                          title="Company"
                          value={commonInfo?.stats.location_name}
                          prefix={
                            <HomeOutlined className={styles.statisticIcon} />
                          }
                        />
                      </Card>
                    </Col>
                    <Col span={6} xs={24} md={6} className="mb-3">
                      <Card className={styles.statCart}>
                        <Statistic
                          className={styles.locationName}
                          title="Company ID"
                          formatter={value => value}
                          value={commonInfo?.stats.company_id}
                          prefix={
                            <IdcardOutlined className={styles.statisticIcon} />
                          }
                        />
                      </Card>
                    </Col>
                    <Col span={6} xs={24} md={3} className="mb-3">
                      <Card className={styles.statCart}>
                        <Statistic
                          className={styles.locationName}
                          title="Pools"
                          value={commonInfo?.stats.pool_count}
                          prefix={
                            <TableOutlined className={styles.statisticIcon} />
                          }
                        />
                      </Card>
                    </Col>
                    <Col span={6} xs={24} md={3} className="mb-3">
                      <Card className={styles.statCart}>
                        <Statistic
                          className={styles.locationName}
                          title="Samples"
                          value={commonInfo?.stats.sample_count}
                          prefix={
                            <TableOutlined className={styles.statisticIcon} />
                          }
                        />
                      </Card>
                    </Col>
                    <Col span={6} xs={24} md={6} className="mb-3">
                      <Card className={styles.reportCart}>
                        {commonInfo?.reports?.length ? (
                          commonInfo?.reports.map((report, index) => {
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
                          })
                        ) : (
                          <Statistic
                            title="Reports"
                            value="No reports"
                            prefix={
                              <FileOutlined className={styles.statisticIcon} />
                            }
                          />
                        )}
                      </Card>
                    </Col>
                  </Row>
                  <Table
                    className="mb-5"
                    pagination={false}
                    columns={columns}
                    dataSource={pools}
                    scroll={{ x: 'max-content' }}
                    bordered
                    expandedRowRender={record => {
                      return expandedRow(
                        record.tube_ids.map((tubeId, index) => {
                          return {
                            key: tubeId,
                            sample: index + 1,
                            sample_barcode: tubeId,
                          };
                        }),
                      );
                    }}
                  />
                </>
              );
            })}
          </Fragment>
        );
      })}
    </div>
  );
};

export default Timeline;
