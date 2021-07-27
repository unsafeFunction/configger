import { Button, Input, Popover, Table, Tag, Tabs } from 'antd';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from 'redux/analysisRuns/actions';
import { constants } from 'utils/constants';
import styles from './styles.module.scss';
import { LoadingOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;

const WellPlate = ({ wellplate, runId }) => {
  const { tubes } = constants;

  const dispatch = useDispatch();
  const [currentTubeID, setCurrentTubeID] = useState('');
  const [popoverVisible, setPopoverVisible] = useState(null);
  const spinIcon = <LoadingOutlined style={{ fontSize: 36 }} spin />;
  const { wellplates } = useSelector((state) => state.analysisRuns.singleRun);
  const { modalId } = useSelector((state) => state.modal.modalProps);
  const isIncorrectPositions = wellplate?.incorrect_positions?.length > 0;

  const useFetching = () => {
    useEffect(() => {
      dispatch({
        type: actions.FETCH_WELLPLATE_REQUEST,
        payload: {
          id: runId,
        },
      });
    }, []);
  };

  useFetching();

  const initialWellplate = [...Array(8).keys()].map((i) => ({
    letter: String.fromCharCode(constants?.A + i),
    col1: { tube_id: null, status: tubes.blank.status },
    col2: { tube_id: null, status: tubes.blank.status },
    col3: { tube_id: null, status: tubes.blank.status },
    col4: { tube_id: null, status: tubes.blank.status },
    col5: { tube_id: null, status: tubes.blank.status },
    col6: { tube_id: null, status: tubes.blank.status },
    col7: { tube_id: null, status: tubes.blank.status },
    col8: { tube_id: null, status: tubes.blank.status },
    col9: { tube_id: null, status: tubes.blank.status },
    col10: { tube_id: null, status: tubes.blank.status },
    col11: { tube_id: null, status: tubes.blank.status },
    col12: { tube_id: null, status: tubes.blank.status },
  }));

  const handleClosePopover = useCallback(() => {
    setPopoverVisible(null);
  }, []);

  const restColumns = [...Array(12).keys()].map((i) => ({
    title: `${i + 1}`,
    dataIndex: `col${i + 1}`,
    align: 'center',
    render: (_, record) => {
      const recordStatus = record?.[`col${i + 1}`]?.status;

      if (record[`col${i + 1}`] && recordStatus !== tubes.blank.status) {
        return (
          <Popover
            title={
              <>
                <Tag color="purple">{record?.[`col${i + 1}`]?.position}</Tag>
                <Tag color="purple">{recordStatus}</Tag>
              </>
            }
            visible={popoverVisible?.id === record?.[`col${i + 1}`]?.id}
            content={
              <div className={styles.popoverWrapper}>
                <Input
                  size="large"
                  placeholder="Tube barcode"
                  value={currentTubeID}
                  defaultValue={record?.[`col${i + 1}`]?.tube_id}
                  className={classNames(styles.tubeInput, 'mb-4')}
                  disabled
                />
                <Button
                  onClick={handleClosePopover}
                  className={styles.popoverBtn}
                >
                  Close
                </Button>
              </div>
            }
            trigger="click"
            onVisibleChange={(value) => {
              if (value) {
                setPopoverVisible(record?.[`col${i + 1}`]);
              } else {
                setPopoverVisible(null);
              }
              setCurrentTubeID(record?.[`col${i + 1}`]?.tube_id);
            }}
          >
            <Button
              shape="circle"
              className={styles.tube}
              style={{
                backgroundColor: record[`col${i + 1}`]?.color,
                borderColor:
                  record[`col${i + 1}`]?.color === '#ffffff'
                    ? '#000000'
                    : record[`col${i + 1}`]?.color,
              }}
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
      {!wellplates?.length && (
        <div className={styles.infiniteLoadingIcon}>{spinIcon}</div>
      )}
      {wellplates?.length > 0 && (
        <Tabs defaultActiveKey="0">
          {wellplates?.map?.((wellplate, idx) => (
            <TabPane key={idx} tab={`Wellplate ${idx + 1}`}>
              <Table
                columns={columns}
                dataSource={wellplates?.[idx] ?? initialWellplate}
                loading={wellplate?.isLoading}
                pagination={false}
                scroll={{ x: 'max-content' }}
                bordered
                rowClassName={styles.row}
                rowKey={(record) => record.letter}
                size="small"
              />
            </TabPane>
          ))}
        </Tabs>
      )}
    </>
  );
};

WellPlate.propTypes = {
  wellplate: PropTypes.shape({}),
};

export default WellPlate;
