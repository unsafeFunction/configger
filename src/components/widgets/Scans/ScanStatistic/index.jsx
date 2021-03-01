import React from 'react';
import PropTypes from 'prop-types';
import { Card, Tag, Statistic, Col, Row, Tooltip } from 'antd';
import { ArrowUpOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import { constants } from 'utils/constants';
import styles from '../styles.module.scss';

const ScanStatistic = ({ scan, scansTotal }) => {
  const tubesTotal = scan?.scan_tubes?.filter(
    tube =>
      tube.status !== constants.tubeStatuses.blank &&
      tube.status !== constants.tubeStatuses.pooling,
  )?.length;

  return (
    <Row gutter={[24, 16]}>
      <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={6}>
        <Card className={styles.card}>
          <Tooltip placement="bottom" title={scan?.rack_id}>
            <Statistic
              title="Rack ID"
              groupSeparator=""
              value={scan?.rack_id ?? '–'}
              formatter={value => <Tag color="blue">{value}</Tag>}
              className={classNames(styles.statistic, styles.ellipsis)}
            />
          </Tooltip>
        </Card>
      </Col>
      <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={5}>
        <Card className={styles.card}>
          <Statistic
            title="Pool ID"
            groupSeparator=""
            value={scan?.pool_id ?? '–'}
            formatter={value => <Tag color="geekblue">{value}</Tag>}
            className={classNames(styles.statistic, styles.ellipsis)}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={5}>
        <Card className={styles.card}>
          <Statistic
            title="Status"
            value={scan?.status?.toLowerCase() ?? '-'}
            formatter={value => (
              <Tag icon={<ArrowUpOutlined />} color="purple">
                {value}
              </Tag>
            )}
            className={classNames(styles.statistic, styles.ellipsis)}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={5}>
        <Card className={styles.card}>
          <Statistic
            title="Total Tubes"
            value={tubesTotal}
            formatter={value => <Tag color="cyan">{value || '-'}</Tag>}
            className={classNames(styles.statistic, styles.ellipsis)}
          />
        </Card>
      </Col>
    </Row>
  );
};

ScanStatistic.propTypes = {
  scan: PropTypes.shape({}),
  scansTotal: PropTypes.number,
};

export default ScanStatistic;
