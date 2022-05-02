import React, { useCallback, useRef, useState, useEffect } from 'react';
import { Button, Form, Input, Popconfirm, Tag, Popover } from 'antd';
import styles from '../../styles.module.scss';
import InvalidateModal from 'components/widgets/Scans/InvalidateModal';
import { constants } from 'utils/constants';
import modalActions from 'redux/modal/actions';
import actions from 'redux/scanSessions/actions';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';

const PopoverRackboard = ({
  children,
  record,
  recordStatus,
  isRack,
  editMode,
  scanId,
}) => {
  const [form] = Form.useForm();

  const dispatch = useDispatch();

  const [currentTubeID, setCurrentTubeID] = useState('');

  const { tubes } = constants;
  const { popoverContent } = useSelector((state) => state.scanSessions.scan);

  useEffect(() => {
    setCurrentTubeID(record.tube_id);
  }, [popoverContent]);

  const isCanValidate =
    recordStatus === tubes.empty.status ||
    recordStatus === tubes.insufficient.status ||
    recordStatus === tubes.improperCollection.status ||
    recordStatus === tubes.contamination.status ||
    recordStatus === tubes.invalid.status;

  const handleSave = useCallback(
    (record) => {
      dispatch({
        type: actions.UPDATE_TUBE_REQUEST,
        payload: {
          id: record.id,
          data: { tube_id: currentTubeID },
          scanId,
          isRack,
        },
      });
      dispatch({
        type: actions.UPDATE_POPOVER_STATE,
        payload: {
          popoverContent: null,
        },
      });
    },
    [dispatch, currentTubeID],
  );

  const validate = useCallback(
    (record) => {
      dispatch({
        type: actions.UPDATE_TUBE_REQUEST,
        payload: {
          id: record.id,
          data: { status: tubes.valid.status },
          scanId,
          isRack,
        },
      });
      dispatch({
        type: actions.UPDATE_POPOVER_STATE,
        payload: {
          popoverContent: null,
        },
      });
    },
    [dispatch],
  );

  const handleDelete = useCallback(
    (tube) => {
      dispatch({
        type: actions.DELETE_TUBE_REQUEST,
        payload: { tubeId: tube.id, scanId, isRack },
      });
      dispatch({
        type: actions.UPDATE_POPOVER_STATE,
        payload: {
          popoverContent: null,
        },
      });
    },
    [dispatch, scanId],
  );

  const handleChangeTubeID = (e) => {
    const { target } = e;
    setCurrentTubeID(target.value);
  };

  const handleClosePopover = useCallback(() => {
    dispatch({
      type: actions.UPDATE_POPOVER_STATE,
      payload: {
        popoverContent: null,
      },
    });
  }, []);

  const onInvalidate = useCallback((record) => {
    dispatch({
      type: actions.INVALIDATE_TUBE_REQUEST,
      payload: {
        id: record.id,
        scanId,
        isRack,
      },
    });
    dispatch({
      type: actions.UPDATE_SELECTED_CODE_SUCCESS,
    });
  }, []);

  const handleInvalidateAction = useCallback(
    (record) => {
      dispatch({
        type: actions.UPDATE_POPOVER_STATE,
        payload: {
          popoverVisible: null,
        },
      });
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
          message: () => <InvalidateModal form={form} tube={popoverContent} />,
        },
      });
    },
    [dispatch, popoverContent],
  );

  return (
    <Popover
      title={
        <>
          <Tag color="purple">{record?.position}</Tag>
          <Tag color="purple">{recordStatus}</Tag>
        </>
      }
      visible={popoverContent?.id === record?.id && editMode}
      content={
        <div className={styles.popoverWrapper}>
          <Input
            size="large"
            placeholder="Tube barcode"
            value={currentTubeID}
            className={classNames(styles.tubeInput, 'mb-4')}
            onChange={handleChangeTubeID}
            allowClear
          />

          <Button
            disabled={!currentTubeID}
            className={styles.popoverBtn}
            type="primary"
            onClick={() => handleSave(record)}
          >
            Save
          </Button>
          {(isRack &&
            recordStatus !== tubes.deleted.status &&
            recordStatus !== tubes.missing.status) ||
          (!isRack &&
            recordStatus !== tubes.deleted.status &&
            recordStatus !== tubes.missing.status &&
            recordStatus !== tubes.pooling.status) ? (
            <Button
              className={styles.popoverBtn}
              danger
              onClick={() => handleDelete(record)}
            >
              Delete
            </Button>
          ) : null}
          {!isRack && (
            <>
              {isCanValidate ? (
                <Button
                  disabled={!popoverContent?.tube_id}
                  type="primary"
                  className={styles.popoverBtn}
                  onClick={() => validate(record)}
                >
                  Validate
                </Button>
              ) : (
                recordStatus !== tubes.missing.status &&
                recordStatus !== tubes.pooling.status &&
                recordStatus !== tubes.deleted.status && (
                  <Button
                    className={styles.popoverBtn}
                    onClick={() => handleInvalidateAction(record)}
                  >
                    Invalidate
                  </Button>
                )
              )}
            </>
          )}
          <Button onClick={handleClosePopover} className={styles.popoverBtn}>
            Cancel
          </Button>
        </div>
      }
      trigger="click"
      onVisibleChange={(value) => {
        if (editMode) {
          if (value) {
            dispatch({
              type: actions.UPDATE_POPOVER_STATE,
              payload: {
                popoverContent: record,
              },
            });
          } else {
            dispatch({
              type: actions.UPDATE_POPOVER_STATE,
              payload: {
                popoverContent: null,
              },
            });
          }
        }
      }}
    >
      {children}
    </Popover>
  );
};

export default PopoverRackboard;
