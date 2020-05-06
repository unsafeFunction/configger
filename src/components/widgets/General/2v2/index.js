import React from 'react';

const General2v2 = ({ statistics }) => {
  return (
    <div className="d-flex flex-wrap align-items-center">
      <div className="mr-auto">
        <p className="text-uppercase text-dark font-weight-bold mb-1">Failed</p>
        <p className="text-gray-5 mb-0">Not delivered messages</p>
      </div>
      <p className="text-danger font-weight-bold font-size-24 mb-0">
        {statistics?.failed ?? '0'}
      </p>
    </div>
  );
};

export default General2v2;
