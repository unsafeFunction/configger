import React, { useEffect, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';

import actions from 'redux/timeline/actions';
import { Helmet } from 'react-helmet';

import { Statistic, Card, Row, Col, Table, Tag, Button } from 'antd';
import { HomeOutlined, TableOutlined } from '@ant-design/icons';

import styles from './styles.module.scss';

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
    render: () => (
      <Button className={styles.downloadButton} color="#0887c9" type="primary">
        Download barcodes
      </Button>
    ),
  },
];

const Timeline = () => {
  const dispatch = useDispatch();
  const timeline = useSelector(state => state.timeline.all);

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
        const statistic = Object.values(timeline?.items[timelineDate][0])[0]
          .stats;
        return (
          <Fragment key={`${timelineDate}-${index}`}>
            <div className="air__utils__heading">
              <h5>{moment(timelineDate).format('LL')}</h5>
            </div>
            <Row className="mb-3" gutter={16}>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="Location"
                    value={statistic.location_name}
                    // valueStyle={{ color: '#3f8600' }}
                    prefix={<HomeOutlined className={styles.statisticIcon} />}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="Total pools count"
                    value={statistic.pool_count}
                    // valueStyle={{ color: '#3f8600' }}
                    prefix={<TableOutlined className={styles.statisticIcon} />}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="Total samples count"
                    value={statistic.sample_count}
                    // valueStyle={{ color: '#cf1322' }}
                    prefix={<TableOutlined className={styles.statisticIcon} />}
                  />
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
                  expandable={{
                    expandedRowRender: record => {
                      return expandedRowRender(
                        record.tube_ids.map((tubeId, index) => {
                          return {
                            key: index,
                            sample: tubeId,
                            sample_barcode: index + 1,
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
