import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import modalActions from 'redux/modal/actions';
import actions from 'redux/scanSessions/actions';
import { Table, Button, Popover, Input, Popconfirm, Tag, Form } from 'antd';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { constants } from 'utils/constants';
import styles from './styles.module.scss';
import InvalidateModal from 'components/widgets/Scans/InvalidateModal';

const Rackboard = ({ rackboard, scanId, session, isRack = false }) => {
  const dispatch = useDispatch();
  const [currentTubeID, setCurrentTubeID] = useState('');
  const [popoverVisible, setPopoverVisible] = useState(null);
  const { selectedCode } = useSelector(
    (state) => state.scanSessions?.singleSession,
  );

  const [form] = Form.useForm();

  const initialRackboard = [...Array(6).keys()].map((i) => ({
    letter: String.fromCharCode(constants?.A + i),
    col1: { tube_id: null, status: constants.tubeStatuses.blank },
    col2: { tube_id: null, status: constants.tubeStatuses.blank },
    col3: { tube_id: null, status: constants.tubeStatuses.blank },
    col4: { tube_id: null, status: constants.tubeStatuses.blank },
    col5: { tube_id: null, status: constants.tubeStatuses.blank },
    col6: { tube_id: null, status: constants.tubeStatuses.blank },
    col7: { tube_id: null, status: constants.tubeStatuses.blank },
    col8: { tube_id: null, status: constants.tubeStatuses.blank },
  }));

  const handleSave = useCallback(
    (record) => {
      dispatch({
        type: actions.UPDATE_TUBE_REQUEST,
        payload: {
          id: record.id,
          data: { tube_id: currentTubeID, scanId: rackboard?.id },
        },
      });
      setPopoverVisible(null);
    },
    [dispatch, currentTubeID, rackboard],
  );

  const validate = useCallback(
    (record) => {
      dispatch({
        type: actions.UPDATE_TUBE_REQUEST,
        payload: {
          id: record.id,
          data: {
            status: constants.tubeStatuses.valid,
            scanId: rackboard?.id,
          },
        },
      });
      setPopoverVisible(null);
    },
    [dispatch, currentTubeID, rackboard],
  );

  const handleDelete = useCallback(
    (tube) => {
      dispatch({
        type: actions.DELETE_TUBE_REQUEST,
        payload: { tubeId: tube.id, scanId },
      });
      setPopoverVisible(null);
    },
    [dispatch, scanId],
  );

  const handleChangeTubeID = useCallback((e) => {
    const { target } = e;
    setCurrentTubeID(target.value);
  }, []);

  const handleClosePopover = useCallback(() => {
    setPopoverVisible(null);
  }, []);

  const onInvalidate = useCallback(
    (record) => {
      dispatch({
        type: actions.INVALIDATE_TUBE_REQUEST,
        payload: {
          id: record.id,
          scanId: rackboard?.id,
        },
      });
      dispatch({
        type: actions.UPDATE_SELECTED_CODE_SUCCESS,
      });
    },
    [selectedCode, rackboard],
  );

  const handleInvalidateAction = useCallback(
    (record) => {
      setPopoverVisible(null);
      dispatch({
        type: modalActions.SHOW_MODAL,
        modalType: 'COMPLIANCE_MODAL',
        modalProps: {
          title: 'Invalidate',
          bodyStyle: {
            maxHeight: '70vh',
            overflow: 'scroll',
          },
          cancelButtonProps: { className: styles.modalButton },
          okButtonProps: {
            className: styles.modalButton,
          },
          okText: 'Save',
          onOk: () => onInvalidate(record),
          message: () => <InvalidateModal form={form} tube={popoverVisible} />,
        },
      });
    },
    [dispatch, popoverVisible, selectedCode],
  );

  const restColumns = [...Array(8).keys()].map((i) => ({
    title: `${i + 1}`,
    dataIndex: `col${i + 1}`,
    align: 'center',
    render: (_, record) => {
      const recordStatus = record?.[`col${i + 1}`]?.status;
      const isCanValidate =
        recordStatus === constants.tubeStatuses.empty ||
        recordStatus === constants.tubeStatuses.insufficient ||
        recordStatus === constants.tubeStatuses.improperCollection ||
        recordStatus === constants.tubeStatuses.contamination ||
        recordStatus === constants.tubeStatuses.invalid;

      if (
        record[`col${i + 1}`] &&
        recordStatus !== constants.tubeStatuses.blank
      ) {
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
                {recordStatus !== constants.tubeStatuses.pooling &&
                  recordStatus !== constants.tubeStatuses.null && (
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
                  )}
                {!isRack && (
                  <>
                    {isCanValidate ? (
                      <Popconfirm
                        disabled={!currentTubeID}
                        title="Are you sure to validate this tube?"
                        okText="Yes"
                        cancelText="No"
                        onConfirm={() => validate(record?.[`col${i + 1}`])}
                      >
                        <Button
                          disabled={!currentTubeID}
                          type="primary"
                          className={styles.popoverBtn}
                        >
                          Validate
                        </Button>
                      </Popconfirm>
                    ) : (
                      recordStatus !== constants.tubeStatuses.missing &&
                      recordStatus !== constants.tubeStatuses.pooling &&
                      recordStatus !== constants.tubeStatuses.null && (
                        <Button
                          className={styles.popoverBtn}
                          onClick={() =>
                            handleInvalidateAction(record?.[`col${i + 1}`])
                          }
                        >
                          Invalidate
                        </Button>
                      )
                    )}
                  </>
                )}
                <Button
                  onClick={handleClosePopover}
                  className={styles.popoverBtn}
                >
                  Cancel
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
              type="primary"
              shape="circle"
              className={styles.tube}
              style={{
                background: record[`col${i + 1}`]?.color,
                borderColor: record[`col${i + 1}`]?.color,
              }}
              ghost={recordStatus === constants.tubeStatuses.null}
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
        dataSource={rackboard?.items ?? initialRackboard}
        loading={session?.isLoading}
        pagination={false}
        scroll={{ x: 'max-content' }}
        bordered
        rowClassName={styles.row}
        rowKey={(record) => record.letter}
        size="small"
      />
    </>
  );
};

Rackboard.propTypes = {
  rackboard: PropTypes.object,
};

export default Rackboard;
