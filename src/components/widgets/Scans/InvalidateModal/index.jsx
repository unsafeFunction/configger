import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Select, Statistic } from 'antd';
import { constants } from 'utils/constants';
import classNames from 'classnames';
import styles from 'pages/Scan/styles.module.scss';
import LabeledInput from 'pages/Scan/Labeled';
import actions from 'redux/scanSessions/actions';
import style from './style.module.scss';

const InvalidateModal = ({ form, tube }) => {
  const dispatch = useDispatch();
  const { Item } = Form;
  const { Option } = Select;
  const { selectedCode } = useSelector(
    (state) => state.scanSessions?.singleSession,
  );

  const handleCodeChange = useCallback(
    (e) => {
      dispatch({
        type: actions.UPDATE_SELECTED_CODE_REQUEST,
        payload: constants.invalidateCodes.find(
          (code) => code.id === Number(e),
        ),
      });
    },
    [dispatch],
  );

  return (
    <Form form={form} layout="vertical">
      <Statistic
        title="Invalidate"
        groupSeparator=""
        value={tube?.tube_id || '–'}
        className={classNames(styles.rackStat, styles.ellipsis)}
      />
      <LabeledInput
        title="Reason"
        node={
          <Item
            className={style.formItem}
            rules={[
              {
                required: true,
                message: 'Please select at least one company!',
              },
            ]}
          >
            <Select
              placeholder="Reason"
              size="middle"
              dropdownStyle={{
                maxHeight: 200,
                overflowY: 'hidden',
                overflowX: 'scroll',
              }}
              showArrow
              onChange={handleCodeChange}
              optionFilterProp="reason"
            >
              {constants.invalidateCodes.map((codeObj) => (
                <Option key={codeObj.id}>{codeObj.reason}</Option>
              ))}
            </Select>
          </Item>
        }
      />
    </Form>
  );
};

export default InvalidateModal;
