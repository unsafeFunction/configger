import { Card, Col, Row, Statistic, Tag } from 'antd';
import classNames from 'classnames';
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import React from 'react';
import styles from '../styles.module.scss';

const SessionStatistic = ({
  refPools,
  refSamples,
  actualPools,
  actualSamples,
}) => (
  <Row gutter={[24, 16]}>
    <Col xs={12} lg={24} xl={12}>
      <Card className={styles.card}>
        <Statistic
          title="Saved / Reference pools"
          value={`${actualPools} / ${refPools}`}
          formatter={(value) => <Tag color="geekblue">{value}</Tag>}
          className={classNames(styles.statistic, styles.ellipsis)}
        />
      </Card>
    </Col>
    <Col xs={12} lg={24} xl={12}>
      <Card className={styles.card}>
        <Statistic
          title="Saved / Reference samples"
          value={`${actualSamples} / ${refSamples}`}
          formatter={(value) => <Tag color="cyan">{value}</Tag>}
          className={classNames(styles.statistic, styles.ellipsis)}
        />
      </Card>
    </Col>
  </Row>
);

SessionStatistic.propTypes = {
  refPools: PropTypes.number.isRequired,
  refSamples: PropTypes.number.isRequired,
  actualPools: PropTypes.number.isRequired,
  actualSamples: PropTypes.number.isRequired,
};

export default SessionStatistic;
