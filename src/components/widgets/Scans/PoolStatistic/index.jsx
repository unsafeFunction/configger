import React from 'react';
import PropTypes from 'prop-types';
import { Card, Tag, Statistic, Col, Row, Tooltip } from 'antd';
import classNames from 'classnames';
import { constants } from 'utils/constants';
import styles from '../styles.module.scss';

const ScanStatistic = ({ scan }) => {
  const tubesTotal = scan?.scan_tubes?.filter(
    (tube) =>
      tube.status !== constants.tubeStatuses.blank &&
      tube.status !== constants.tubeStatuses.missing &&
      tube.status !== constants.tubeStatuses.empty &&
      tube.status !== constants.tubeStatuses.pooling,
  )?.length;

  return (
    <Row gutter={[24, 16]}>
      <Col xs={24} sm={9}>
        <Card className={styles.card}>
          <Tooltip placement="bottom" title={scan?.rack_id}>
            <Statistic
              title="Rack ID"
              groupSeparator=""
              value={scan?.rack_id || '–'}
              formatter={(value) => <Tag color="blue">{value}</Tag>}
              className={classNames(styles.statistic, styles.ellipsis)}
            />
          </Tooltip>
        </Card>
      </Col>
      <Col xs={24} sm={9}>
        <Card className={styles.card}>
          <Statistic
            title="Pool ID"
            groupSeparator=""
            value={scan?.pool_id || '–'}
            formatter={(value) => <Tag color="geekblue">{value}</Tag>}
            className={classNames(styles.statistic, styles.ellipsis)}
          />
        </Card>
      </Col>
      <Col xs={24} sm={6}>
        <Card className={styles.card}>
          <Statistic
            title="Tubes"
            value={tubesTotal}
            formatter={(value) => <Tag color="cyan">{value}</Tag>}
            className={classNames(styles.statistic, styles.ellipsis)}
          />
        </Card>
      </Col>
    </Row>
  );
};

ScanStatistic.propTypes = {
  scan: PropTypes.shape({}),
};

export default ScanStatistic;
