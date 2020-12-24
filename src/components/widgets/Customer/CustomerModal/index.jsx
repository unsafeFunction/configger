import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Form, Input, Select } from 'antd';
import InfiniteScroll from 'react-infinite-scroller';
import style from './style.module.scss';

const CustomerModal = ({ form, loadCompanies }) => {
  const { Item } = Form;
  const [page, setPage] = useState(0);
  const { companies, companiesCount, areCompaniesLoading } = useSelector(
    state => state.user,
  );

  const loadPage = page => {
    loadCompanies(page);
    setPage(page + 1);
  };

  useEffect(() => {
    page === 0 && loadPage(0);
  });

  return (
    <Form form={form} layout="vertical">
      <Item
        label="Companies"
        name="companies"
        rules={[
          {
            required: true,
            message: 'Please select at least one company!',
          },
        ]}
      >
        <Select
          placeholder="Companies"
          mode="multiple"
          size="middle"
          options={companies}
          loading={areCompaniesLoading}
          showArrow
          showSearch
          optionFilterProp="label"
          listHeight={0}
          dropdownMatchSelectWidth={false}
          dropdownRender={menu => (
            <div className={style.dropDown}>
              <InfiniteScroll
                pageStart={page}
                loadMore={() => loadPage(page)}
                hasMore={
                  !areCompaniesLoading && companies.length < companiesCount
                }
                threshold={200}
                useWindow={false}
              >
                {menu}
              </InfiniteScroll>
            </div>
          )}
        />
      </Item>
      <Item
        label="First name"
        name="first_name"
        rules={[
          {
            required: true,
            message: 'Please input first name!',
          },
        ]}
      >
        <Input placeholder="First name" className={style.formItem} />
      </Item>
      <Item
        label="Last name"
        name="last_name"
        rules={[
          {
            required: true,
            message: 'Please input last name!',
          },
        ]}
      >
        <Input placeholder="Last name" className={style.formItem} />
      </Item>
      <Item
        label="Email"
        name="email"
        rules={[
          {
            required: true,
            message: 'Please input Email!',
          },
        ]}
      >
        <Input placeholder="Email" className={style.formItem} />
      </Item>
    </Form>
  );
};

export default CustomerModal;
