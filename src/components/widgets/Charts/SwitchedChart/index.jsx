import { Spin, Switch } from 'antd';
import React, { useState } from 'react';
import { constants } from 'utils/constants';
import Chart from '../Chart';
import styles from './styles.module.scss';

const SwitchedChart = ({ stats, loading }) => {
  const { chartTypes } = constants;
  const [type, setType] = useState(chartTypes.bar);

  const handleSwitch = () => {
    return type === chartTypes.bar
      ? setType(chartTypes.pie)
      : setType(chartTypes.bar);
  };
  const initialValue = 0;
  const isZeroSum =
    stats?.data?.reduce((prev, next) => prev + next.value, initialValue) ===
    initialValue;
  const switchDisabled = stats?.data?.length <= 1 || isZeroSum;

  return (
    <div className={styles.switchedWrapper}>
      <div className={loading ? styles.spin : null}>{loading && <Spin />}</div>
      <Chart type={type} stats={stats} />
      <Switch
        disabled={switchDisabled}
        className={styles.switch}
        checkedChildren="Bar"
        unCheckedChildren="Pie"
        defaultChecked
        onChange={handleSwitch}
      />
    </div>
  );
};

export default SwitchedChart;
