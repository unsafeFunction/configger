import React from 'react';
import ChartistGraph from 'react-chartist';
import data from './data.json';

const options = {
  fullWidth: true,
  chartPadding: {
    right: 0,
    left: 0,
    top: 5,
    bottom: 0,
  },
  low: 0,
  axisY: {
    showGrid: false,
    showLabel: false,
    offset: 0,
  },
  axisX: {
    showGrid: false,
  },
  seriesBarDistance: 15,
};

const listener = {
  draw: item => {
    if (item.type === 'bar') {
      item.group.elem('line', {
        x1: item.x1,
        x2: item.x2,
        y1: item.y2,
        y2: 0,
        stroke: '#e4e9f0',
        'stroke-width': '10',
      });
    }
  },
};

const Chart3 = ({ statistics }) => {
  return (
    <>
      <ChartistGraph
        className="height-200"
        data={data}
        options={options}
        type="Bar"
        listener={listener}
      />
      <div className="d-flex flex-wrap">
        <div className="mr-5 mb-2">
          <div className="text-nowrap text-uppercase text-gray-4">
            <div className="air__utils__donut air__utils__donut--success" />
            Clicks
          </div>
          <div className="font-weight-bold font-size-18 text-dark">
            {statistics?.clicked ?? '0'}
          </div>
        </div>
        <div className="mr-5 mb-2">
          <div className="text-nowrap text-uppercase text-gray-4">
            <div className="air__utils__donut air__utils__donut--primary" />
            Deliveries
          </div>
          <div className="font-weight-bold font-size-18 text-dark">
            {statistics?.delivered ?? '0'}
          </div>
        </div>
        <div className="mr-5 mb-2">
          <div className="text-nowrap text-uppercase text-gray-4">
            <div className="air__utils__donut air__utils__donut--teal" />
            Failed
          </div>
          <div className="font-weight-bold font-size-18 text-dark">
            {statistics?.failed ?? '0'}
          </div>
        </div>
        <div className="mr-5 mb-2">
          <div className="text-nowrap text-uppercase text-gray-4">
            <div className="air__utils__donut air__utils__donut--secondary" />
            Pending
          </div>
          <div className="font-weight-bold font-size-18 text-dark">
            {statistics?.pending ?? '-'}
          </div>
        </div>
      </div>
    </>
  );
};
export default Chart3;
