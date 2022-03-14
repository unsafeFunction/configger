import useWindowSize from 'hooks/useWindowSize';
import React from 'react';
import {
  Bar,
  BarChart,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { constants } from 'utils/constants';

const Chart = ({ type, stats }) => {
  const { isMobile } = useWindowSize();

  const { valueName, data } = stats;
  const { chartTypes } = constants;

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
            <YAxis type="category" dataKey="name" />
            <Tooltip />
            <Legend layout={isMobile ? 'vertical' : 'horizontal'} />
            <Bar name={valueName} dataKey="value" fill="#8884d8" />
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

  return <ResponsiveContainer>{renderChart(type)}</ResponsiveContainer>;
};

export default Chart;
