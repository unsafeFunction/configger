import React, { memo } from 'react';
import {
    PieChart, Pie, Cell,
     ResponsiveContainer, Legend
  } from 'recharts';

  const data = [
    { name: 'Ongoing', value: 400 },
    { name: 'Completed', value: 300 },
    { name: 'Draft', value: 300 },
  ];
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const CampaignChart = memo(() => {
    return (
      <div style={{ width: '100%', height: 230 }}>
        <ResponsiveContainer>
          <PieChart>
            <Legend
              layout="vertical"
              verticalAlign="top"
            />
            <Pie
              data={data}
              cx={120}
              cy={35}
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label
            >
              {
            // eslint-disable-next-line react/no-array-index-key
            data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
              }
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    )
})

export default CampaignChart