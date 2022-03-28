/* eslint-disable react/jsx-wrap-multilines */
import { Result } from 'antd';
import React from 'react';

type SessionProps = {
  actualPoolsCount: number;
  actualSamplesCount: number;
  refPoolsCount: number;
  refSamplesCount: number;
};

const SaveSessionModal = ({
  actualPoolsCount,
  actualSamplesCount,
  refPoolsCount,
  refSamplesCount,
}: SessionProps): JSX.Element => {
  if (
    actualPoolsCount === refPoolsCount &&
    actualSamplesCount === refSamplesCount
  ) {
    return (
      <Result
        status="success"
        title={
          <>
            {`You have saved ${actualPoolsCount} scan(s)!`}
            <br />
            Are you sure you would like to save the session?
          </>
        }
        subTitle="The number of pools and samples coincides with the declared in the intake log item."
      />
    );
  }
  return (
    <Result
      status="warning"
      title={
        <>
          {`You have saved ${actualPoolsCount} scan(s) containing ${actualSamplesCount} samples!`}
          <br />
          Are you sure you would like to save the session?
        </>
      }
      subTitle={`${refPoolsCount} pool(s) and ${refSamplesCount} samples are declared in the intake log item.`}
    />
  );
};

export default SaveSessionModal;
