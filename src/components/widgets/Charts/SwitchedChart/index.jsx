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
      ? setType(chartTypes.line)
      : setType(chartTypes.bar);
  };

  const switchDisabled = stats?.data?.length <= 1;

  return (
    <div className={styles.switchedWrapper}>
      <div className={loading ? styles.spin : null}>{loading && <Spin />}</div>
      <Chart type={type} stats={stats} />
      <Switch
        disabled={switchDisabled}
        className={styles.switch}
        checkedChildren="Bar"
        unCheckedChildren="Line"
        defaultChecked
        onChange={handleSwitch}
      />
    </div>
  );
};

export default SwitchedChart;
