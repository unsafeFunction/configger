import { Tooltip as ANTooltip } from 'antd';
import useWindowSize from 'hooks/useWindowSize';
import React from 'react';
import {
  Bar,
  BarChart,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Text,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { constants } from 'utils/constants';
import styles from './styles.module.scss';

const Chart = ({ type, stats }) => {
  const { isMobile } = useWindowSize();

  const { valueName, data, dates } = stats;
  const { chartTypes } = constants;

  const CustomTick = (props) => {
    const {
      payload: { value },
    } = props;

    const fullCompanyName = data.find(
      (item) => item.name === value || item.fullName === value,
    )?.fullName;

    return (
      <ANTooltip title={fullCompanyName}>
        <Text {...props}>{value.split(' ')[0]}</Text>
      </ANTooltip>
    );
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { payload: data } = payload[0];

      return (
        <div className={styles.customTooltip}>
          {data?.fullName && <p>{data.fullName}</p>}
          <p
            className={styles.desc}
          >{`${payload[0].name} : ${payload[0].value}`}</p>
        </div>
      );
    }

    return null;
  };

  const renderChart = (type) => {
    // eslint-disable-next-line default-case
    switch (type) {
      case chartTypes.bar:
        return (
          <BarChart
            layout="vertical"
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 50,
              bottom: 5,
            }}
          >
            <XAxis type="number" />
            <YAxis
              tick={<CustomTick />}
              width={dates ? 60 : 75}
              interval={0}
              type="category"
              dataKey="name"
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend layout={isMobile ? 'vertical' : 'horizontal'} />
            <Bar barSize={30} name={valueName} dataKey="value" fill="#8884d8" />
          </BarChart>
        );
      case chartTypes.pie:
        return (
          <PieChart
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <Pie
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={80}
              fill="#82ca9d"
              data={data}
              dataKey="value"
              label
              isAnimationActive={false}
            />
            <Tooltip />
          </PieChart>
        );
    }
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      {renderChart(type)}
    </ResponsiveContainer>
  );
};

export default Chart;
