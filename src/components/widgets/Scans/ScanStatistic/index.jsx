import { ArrowUpOutlined } from '@ant-design/icons';
import { Card, Col, Row, Statistic, Tag, Tooltip } from 'antd';
import classNames from 'classnames';
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import React from 'react';
import { countedPoolTubes } from 'utils/tubesRules';
import styles from '../styles.module.scss';

const ScanStatistic = ({ scan, isRack = false }) => {
  const tubesTotal = scan?.scan_tubes?.filter((tube) => {
    return countedPoolTubes.find((t) => t.status === tube.status);
  });

  return (
    <Row gutter={[24, 16]}>
      <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={6}>
        <Card className={styles.card}>
          <Tooltip placement="bottom" title={scan?.rack_id}>
            <Statistic
              title={isRack ? 'PoolRack ID' : 'Rack ID'}
              groupSeparator=""
              value={scan?.rack_id ?? '-'}
              formatter={(value) => <Tag color="blue">{value}</Tag>}
              className={classNames(styles.statistic, styles.ellipsis)}
            />
          </Tooltip>
        </Card>
      </Col>
      {!isRack && (
        <>
          <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={5}>
            <Card className={styles.card}>
              <Statistic
                title="Pool ID"
                groupSeparator=""
                value={scan?.pool_id ?? '-'}
                formatter={(value) => <Tag color="geekblue">{value}</Tag>}
                className={classNames(styles.statistic, styles.ellipsis)}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={5}>
            <Card className={styles.card}>
              <Statistic
                title="Status"
                value={scan?.status?.toLowerCase() ?? '-'}
                formatter={(value) => (
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
                value={tubesTotal?.length}
                formatter={(value) => <Tag color="cyan">{value || '-'}</Tag>}
                className={classNames(styles.statistic, styles.ellipsis)}
              />
            </Card>
          </Col>
        </>
      )}
    </Row>
  );
};

ScanStatistic.propTypes = {
  scan: PropTypes.shape({}).isRequired,
  isRack: PropTypes.bool,
};

export default ScanStatistic;
