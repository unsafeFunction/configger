import React from 'react';

const General2 = ({ statistics }) => {
  return (
    <div className="d-flex flex-wrap align-items-center">
      <div className="mr-auto">
        <p className="text-uppercase text-dark font-weight-bold mb-1">
          Unsubscribed
        </p>
        <p className="text-gray-5 mb-0">Opt out requests</p>
      </div>
      <p className="text-success font-weight-bold font-size-24 mb-0">
        {statistics?.optOut ?? '0'}
      </p>
    </div>
  );
};

export default General2;
