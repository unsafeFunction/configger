import { Button, Form, Input, Popconfirm, Popover, Table, Tag } from 'antd';
import classNames from 'classnames';
import InvalidateModal from 'components/widgets/Scans/InvalidateModal';
import PropTypes from 'prop-types';
import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import modalActions from 'redux/modal/actions';
import actions from 'redux/scanSessions/actions';
import { constants } from 'utils/constants';
import styles from './styles.module.scss';

const WellPlate = ({
  wellplate,
  scanId,
  session,
  isRack = false,
  editMode = true,
}) => {
  const { tubes } = constants;

  const dispatch = useDispatch();
  const [currentTubeID, setCurrentTubeID] = useState('');
  const [popoverVisible, setPopoverVisible] = useState(null);
  const { selectedCode } = useSelector(
    (state) => state.scanSessions?.singleSession,
  );
  const { modalId } = useSelector((state) => state.modal.modalProps);
  const isIncorrectPositions = wellplate?.incorrect_positions?.length > 0;

  const [form] = Form.useForm();
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

  const handleSave = useCallback(
    (record) => {
      dispatch({
        type: actions.UPDATE_TUBE_REQUEST,
        payload: {
          id: record.id,
          data: { tube_id: currentTubeID },
          scanId: wellplate?.id,
          isRack,
        },
      });
      setPopoverVisible(null);
    },
    [dispatch, currentTubeID, wellplate],
  );

  const validate = useCallback(
    (record) => {
      dispatch({
        type: actions.UPDATE_TUBE_REQUEST,
        payload: {
          id: record.id,
          data: { status: tubes.valid.status },
          scanId: wellplate?.id,
          isRack,
        },
      });
      setPopoverVisible(null);
    },
    [dispatch, currentTubeID, wellplate],
  );

  const handleDelete = useCallback(
    (tube) => {
      dispatch({
        type: actions.DELETE_TUBE_REQUEST,
        payload: { tubeId: tube.id, scanId, isRack },
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
          scanId: wellplate?.id,
          isRack,
        },
      });
      dispatch({
        type: actions.UPDATE_SELECTED_CODE_SUCCESS,
      });
    },
    [selectedCode, wellplate],
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

  const restColumns = [...Array(12).keys()].map((i) => ({
    title: `${i + 1}`,
    dataIndex: `col${i + 1}`,
    align: 'center',
    render: (_, record) => {
      const recordStatus = record?.[`col${i + 1}`]?.status;
      const isCanValidate =
        recordStatus === tubes.empty.status ||
        recordStatus === tubes.insufficient.status ||
        recordStatus === tubes.improperCollection.status ||
        recordStatus === tubes.contamination.status ||
        recordStatus === tubes.invalid.status;
      const isTubeIncorrect = wellplate?.incorrect_positions?.find(
        (position) => position === record?.[`col${i + 1}`]?.position,
      );
      const isTubeEmpty = wellplate?.empty_positions?.find(
        (position) => position === record?.[`col${i + 1}`]?.position,
      );

      if (record[`col${i + 1}`] && recordStatus !== tubes.blank.status) {
        return (
          <Popover
            title={
              <>
                <Tag color="purple">{record?.[`col${i + 1}`]?.position}</Tag>
                <Tag color="purple">{recordStatus}</Tag>
              </>
            }
            visible={
              popoverVisible?.id === record?.[`col${i + 1}`]?.id && editMode
            }
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
                {(isRack &&
                  recordStatus !== tubes.deleted.status &&
                  recordStatus !== tubes.missing.status &&
                  recordStatus !== tubes.negativeControl.status &&
                  recordStatus !== tubes.positiveControl.status) ||
                (!isRack &&
                  recordStatus !== tubes.deleted.status &&
                  recordStatus !== tubes.missing.status &&
                  recordStatus !== tubes.pooling.status) ? (
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
                ) : null}
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
                      recordStatus !== tubes.missing.status &&
                      recordStatus !== tubes.pooling.status &&
                      recordStatus !== tubes.deleted.status && (
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
              shape="circle"
              className={styles.tube}
              style={{
                backgroundColor:
                  (isTubeIncorrect || (!isIncorrectPositions && isTubeEmpty)) &&
                  modalId === 'saveScan'
                    ? '#ff0000'
                    : record[`col${i + 1}`]?.color,
                borderColor:
                  (isTubeIncorrect || (!isIncorrectPositions && isTubeEmpty)) &&
                  modalId === 'saveScan'
                    ? '#ff0000'
                    : record[`col${i + 1}`]?.color === '#ffffff'
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
      <Table
        columns={columns}
        dataSource={wellplate?.items ?? initialWellplate}
        loading={session?.isLoading || wellplate?.isLoading}
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

WellPlate.propTypes = {
  wellplate: PropTypes.shape({}),
  editMode: PropTypes.bool,
};

export default WellPlate;
