/* eslint-disable react/jsx-wrap-multilines */
import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Form, Input, Select, Statistic, Tag } from 'antd';
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
    state => state.scanSessions?.singleSession,
  );

  const handleCodeChange = useCallback(
    e => {
      dispatch({
        type: actions.UPDATE_SELECTED_CODE_REQUEST,
        payload: constants.invalidateCodes.find(code => code.id === Number(e)),
      });
    },
    [constants, dispatch],
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
        title="Invalidation code"
        node={
          <Item
            name="code"
            className={style.formItem}
            rules={[
              {
                required: true,
                message: 'Please select at least one company!',
              },
            ]}
          >
            <Select
              placeholder="Invalidation code"
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
              {constants.invalidateCodes.map(codeObj => (
                <Option key={codeObj.id}>{codeObj.code}</Option>
              ))}
            </Select>
          </Item>
        }
      />
      <Statistic
        title="Reason"
        value={selectedCode.reason || '–'}
        className={classNames(styles.rackStat, styles.ellipsis)}
      />
    </Form>
  );
};

export default InvalidateModal;
