import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import actions from 'redux/scanSessions/actions';
import { Table, Button, Popover, Input, Popconfirm, Tag } from 'antd';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { constants } from 'utils/constants';
import styles from './styles.module.scss';

const Rackboard = ({ rackboard, scanId }) => {
  const dispatch = useDispatch();
  const [currentTubeID, setCurrentTubeID] = useState('');
  const [popoverVisible, setPopoverVisible] = useState(null);

  const initialRackboard = [...Array(6).keys()].map(i => ({
    letter: String.fromCharCode(constants?.A + i),
    col1: { tube_id: null, status: 'empty' },
    col2: { tube_id: null, status: 'empty' },
    col3: { tube_id: null, status: 'empty' },
    col4: { tube_id: null, status: 'empty' },
    col5: { tube_id: null, status: 'empty' },
    col6: { tube_id: null, status: 'empty' },
    col7: { tube_id: null, status: 'empty' },
    col8: { tube_id: null, status: 'empty' },
  }));

  const handleSave = useCallback(
    record => {
      dispatch({
        type: actions.UPDATE_TUBE_REQUEST,
        payload: { record, tube_id: currentTubeID },
      });
    },
    [dispatch, currentTubeID],
  );

  const handleDelete = useCallback(
    record => {
      dispatch({
        type: actions.DELETE_TUBE_REQUEST,
        payload: { record, scanId },
      });
      setPopoverVisible(null);
    },
    [scanId],
  );

  const handleChangeTubeID = useCallback(e => {
    setCurrentTubeID(e.target.value);
  }, []);

  const handleClosePopover = useCallback(() => {
    setPopoverVisible(null);
  }, []);

  const restColumns = [...Array(8).keys()].map(i => ({
    title: `${i + 1}`,
    dataIndex: `col${i + 1}`,
    align: 'center',
    render: (_, record) => {
      if (record[`col${i + 1}`] && record[`col${i + 1}`]?.status !== 'empty') {
        return (
          <Popover
            title={
              <>
                <Tag color="purple">{record?.[`col${i + 1}`]?.position}</Tag>
                <Tag color="purple">{record?.[`col${i + 1}`]?.status}</Tag>
              </>
            }
            visible={popoverVisible === record?.[`col${i + 1}`]?.id}
            content={
              <div className={styles.popoverWrapper}>
                <Input
                  size="large"
                  placeholder="Tube barcode"
                  defaultValue={record?.[`col${i + 1}`]?.tube_id}
                  className={classNames(styles.tubeInput, 'mb-4')}
                  onChange={handleChangeTubeID}
                  allowClear
                />

                <Popconfirm
                  disabled={!currentTubeID}
                  title="Are you sure to update this tube?"
                  okText="Yes"
                  cancelText="No"
                  onConfirm={() => handleSave(record?.[`col${i + 1}`])}
                >
                  <Button
                    disabled={!currentTubeID}
                    className={styles.popoverBtn}
                    type="primary"
                  >
                    Save
                  </Button>
                </Popconfirm>

                <Popconfirm
                  title="Are you sure to delete this tube?"
                  okText="Yes"
                  cancelText="No"
                  onConfirm={() => handleDelete(record?.[`col${i + 1}`])}
                >
                  <Button className={styles.popoverBtn} danger>
                    Delete
                  </Button>
                </Popconfirm>

                <Popconfirm
                  disabled
                  title="Are you sure to invalidate this tube?"
                  okText="Yes"
                  cancelText="No"
                  // onConfirm={}
                >
                  <Button className={styles.popoverBtn} disabled>
                    Invalidate
                  </Button>
                </Popconfirm>

                <Button
                  onClick={handleClosePopover}
                  className={styles.popoverBtn}
                >
                  Cancel
                </Button>
              </div>
            }
            trigger="click"
            onVisibleChange={() => {
              setPopoverVisible(record?.[`col${i + 1}`]?.id);
              setCurrentTubeID(record?.[`col${i + 1}`]?.tube_id);
            }}
          >
            <Button
              type="primary"
              shape="circle"
              className={styles.tube}
              style={
                record[`col${i + 1}`]?.status !== 'empty'
                  ? {
                      background: record[`col${i + 1}`]?.color,
                      borderColor: record[`col${i + 1}`]?.color,
                    }
                  : null
              }
            />
          </Popover>
        );
      } else {
        return (
          <Button type="primary" shape="circle" className={styles.tube} ghost />
        );
      }
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
        dataSource={rackboard?.items || initialRackboard}
        loading={rackboard?.isLoading}
        pagination={false}
        scroll={{ x: 'max-content' }}
        bordered
        rowClassName={styles.row}
        rowKey={record => record.letter}
        size="small"
      />
    </>
  );
};

Rackboard.propTypes = {
  rackboard: PropTypes.object,
};

export default Rackboard;
