import { Button, Table } from 'antd';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { constants } from 'utils/constants';
import PopoverRackboard from './components/Popover';
import styles from './styles.module.scss';

const Rackboard = ({
  rackboard,
  scanId,
  session,
  isRack = false,
  editMode = true,
  highlightedTubeId = null,
}) => {
  const { tubes } = constants;

  const { modalId } = useSelector((state) => state.modal.modalProps);
  const isIncorrectPositions = rackboard?.incorrect_positions?.length > 0;

  const initialRackboard = [...Array(6).keys()].map((i) => ({
    letter: String.fromCharCode(constants?.A + i),
    col1: { tube_id: null, status: tubes.blank.status },
    col2: { tube_id: null, status: tubes.blank.status },
    col3: { tube_id: null, status: tubes.blank.status },
    col4: { tube_id: null, status: tubes.blank.status },
    col5: { tube_id: null, status: tubes.blank.status },
    col6: { tube_id: null, status: tubes.blank.status },
    col7: { tube_id: null, status: tubes.blank.status },
    col8: { tube_id: null, status: tubes.blank.status },
  }));

  const restColumns = [...Array(8).keys()].map((i) => ({
    title: `${i + 1}`,
    dataIndex: `col${i + 1}`,
    align: 'center',
    render: (_, record) => {
      const recordStatus = record?.[`col${i + 1}`]?.status;

      const isTubeIncorrect = rackboard?.incorrect_positions?.find(
        (position) => position === record?.[`col${i + 1}`]?.position,
      );
      const isTubeEmpty = rackboard?.empty_positions?.find(
        (position) => position === record?.[`col${i + 1}`]?.position,
      );
      const recordId = record?.[`col${i + 1}`]?.id;

      const renderCell = () => {
        if (record[`col${i + 1}`] && recordStatus !== tubes.blank.status) {
          return (
            <PopoverRackboard
              record={record[`col${i + 1}`]}
              recordStatus={recordStatus}
              isRack={isRack}
              editMode={editMode}
              scanId={scanId}
            >
              <Button
                shape="circle"
                className={styles.tube}
                style={{
                  backgroundColor:
                    (isTubeIncorrect ||
                      (!isIncorrectPositions && isTubeEmpty)) &&
                    modalId === 'saveScan'
                      ? '#ff0000'
                      : record[`col${i + 1}`]?.color,
                  borderColor:
                    (isTubeIncorrect ||
                      (!isIncorrectPositions && isTubeEmpty)) &&
                    modalId === 'saveScan'
                      ? '#ff0000'
                      : record[`col${i + 1}`]?.color === '#ffffff'
                      ? '#000000'
                      : record[`col${i + 1}`]?.color,
                }}
              />
            </PopoverRackboard>
          );
        } else {
          return (
            <Button
              type="primary"
              shape="circle"
              className={styles.tube}
              ghost
            />
          );
        }
      };
      return {
        props: {
          className: recordId === highlightedTubeId && styles.highlightedTube,
        },
        children: renderCell(),
      };
    },
  }));

  const columns = [
    {
      dataIndex: 'letter',
      align: 'center',
      fixed: true,
      className: styles.letterColumn,
    },
    ...restColumns,
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={rackboard?.items ?? initialRackboard}
        loading={session?.isLoading || rackboard?.isLoading}
        pagination={false}
        scroll={{ x: 'max-content' }}
        rowClassName={styles.row}
        rowKey={(record) => record.letter}
        size="small"
        bordered
      />
    </>
  );
};

Rackboard.propTypes = {
  rackboard: PropTypes.shape({}),
  editMode: PropTypes.bool,
  highlightedTubeId: PropTypes.string,
};

export default Rackboard;
