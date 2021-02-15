import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Card, Form, Input, Select, Statistic, Tag } from 'antd';
import InfiniteScroll from 'react-infinite-scroller';
import style from './style.module.scss';
import classNames from 'classnames';
import styles from '../../../../pages/Scan/styles.module.scss';
import LabeledInput from '../../../../pages/Scan/Labeled';

const InvalidateModal = ({ form, tube }) => {
  const { Item } = Form;
  const { companies, companiesCount, areCompaniesLoading } = useSelector(
    state => state.customers,
  );

  console.log(tube);

  return (
    <Form form={form} layout="vertical">
      <Statistic
        title="Invalidate"
        groupSeparator=""
        value={tube?.tube_id || '–'}
        className={classNames(styles.rackStat, styles.ellipsis)}
      />
      <LabeledInput
        title={'Invalidation code'}
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
              options={companies}
              loading={areCompaniesLoading}
              dropdownStyle={{
                maxHeight: 200,
                overflowY: 'hidden',
                overflowX: 'scroll',
              }}
              showArrow
              showSearch
              optionFilterProp="label"
              listHeight={0}
              dropdownMatchSelectWidth={false}
            />
          </Item>
        }
      />
      <Statistic
        title="Reason"
        value={tube?.tube_id || '–'}
        className={classNames(styles.rackStat, styles.ellipsis)}
      />
    </Form>
  );
};

export default InvalidateModal;
