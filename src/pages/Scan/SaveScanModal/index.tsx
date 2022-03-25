import { Result, Typography } from 'antd';
import React from 'react';

type ScanProps = {
  isIncorrectTubes: boolean;
  isEmptyTubes: boolean;
  incorrectPositions: string;
  emptyPositions: string;
  isDiagnostic: boolean;
};

const SaveScanModal = ({
  isIncorrectTubes,
  isEmptyTubes,
  incorrectPositions,
  emptyPositions,
  isDiagnostic,
}: ScanProps): JSX.Element => {
  const isIncorrect = isIncorrectTubes || isEmptyTubes;

  const warningMsg = () => {
    if (isIncorrectTubes) {
      return (
        <Typography.Paragraph>
          {`It is impossible to save scan because (${incorrectPositions}) positions are incorrect!`}
        </Typography.Paragraph>
      );
    }
    return (
      <>
        {isEmptyTubes && (
          <Typography.Paragraph>
            {`Are you sure the red (${emptyPositions}) positions are empty?`}
          </Typography.Paragraph>
        )}
        {isDiagnostic && (
          <Typography.Paragraph>
            Continuing will categorize all tubes as diagnostic.
            <br />
            Are you sure to save the scan as diagnostic?
          </Typography.Paragraph>
        )}
      </>
    );
  };

  if (!isIncorrect && !isDiagnostic) {
    return (
      <Result
        status="success"
        title="Are you sure you would like to save the scan?"
      />
    );
  }
  return <Result status="warning" title={warningMsg()} />;
};

export default SaveScanModal;
