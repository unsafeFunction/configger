import React from 'react';
import PropTypes from 'prop-types';
import { Card, Tag, Statistic, Col, Row, Tooltip } from 'antd';
import classNames from 'classnames';
import { countedPoolTubes } from 'utils/tubesRules';
import styles from '../styles.module.scss';

const PoolStatistic = ({ scan }) => {
  const tubesTotal = scan?.scan_tubes?.filter((tube) => {
    return countedPoolTubes.find((t) => t.status === tube.status);
  })?.length;

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

PoolStatistic.propTypes = {
  scan: PropTypes.shape({}),
};

export default PoolStatistic;
