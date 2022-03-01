import useWindowSize from 'hooks/useWindowSize';
import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { constants } from 'utils/constants';
import styles from './styles.module.scss';

const Chart = ({ type, stats }) => {
  const { isMobile } = useWindowSize();

  const { maxValueName, valueName, data } = stats;
  const { chartTypes } = constants;

  const renderChart = (type) => {
    // eslint-disable-next-line default-case
    switch (type) {
      case chartTypes.bar:
        return (
          <BarChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend layout={isMobile ? 'vertical' : 'horizontal'} />
            <Bar name={maxValueName} dataKey="maxValue" fill="#8884d8" />
            <Bar name={valueName} dataKey="value" fill="#82ca9d" />
          </BarChart>
        );
      case chartTypes.line:
        return (
          <LineChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <XAxis dataKey="name" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend layout={isMobile ? 'vertical' : 'horizontal'} />
            <Line
              name={maxValueName}
              type="monotone"
              dataKey="maxValue"
              stroke="#8884d8"
            />
            <Line
              name={valueName}
              type="monotone"
              dataKey="value"
              stroke="#82ca9d"
            />
          </LineChart>
        );
    }
  };

  return (
    <div className={styles.wrapper}>
      <ResponsiveContainer>{renderChart(type)}</ResponsiveContainer>
    </div>
  );
};

export default Chart;
