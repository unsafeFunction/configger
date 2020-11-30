import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input, Select, Option } from 'antd';
import actions from 'redux/user/actions';
import InfiniteScroll from 'react-infinite-scroller';
// import 'antd/dist/antd.css';
import style from './style.module.scss';

const CustomerModal = ({ form, loadCompanies }) => {
  const { Item } = Form;
  const [page, setPage] = useState(0);
  const { companies, companiesCount, areCompaniesLoading } = useSelector(state => state.user);

  useEffect(() => {
    page === 0 && loadCompanies(0, () => setPage(1));
  })
 
  return (
    <Form 
        form={form}
        layout="vertical"
    >
        <Item
            label="Company"
            name="company"
            rules={[
                {
                required: true,
                message: 'Please select a company!',
                },
            ]}
        >
            <Select 
                placeholder="Company"
                options={companies}
                loading={areCompaniesLoading}  
                showArrow
                showSearch
                size='middle'
                listHeight={0}
                dropdownMatchSelectWidth={false}
                dropdownRender={menu => (
                    <div className={style.dropDown}>
                        <InfiniteScroll
                            pageStart={page}
                            loadMore={() => loadCompanies(page, () => setPage(page + 1))}
                            hasMore={!areCompaniesLoading && companies.length < companiesCount}
                            threshold={200}
                            useWindow={false}
                            className={'zhopa'}
                        >
                            { menu }
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
                message: 'Please input your first name!',
                },
            ]}
            >
            <Input placeholder="First name" className={style.formItem}/>
        </Item>
        <Item
            label="Last name"
            name="last_name"
            rules={[
                {
                required: true,
                message: 'Please input your last name!',
                },
            ]}
        >
            <Input placeholder="Last name" className={style.formItem}/>
        </Item>
        <Item
            label="Email"
            name="email"
            rules={[
                {
                required: true,
                message: 'Please input your Email!',
                },
            ]}
        >
            <Input placeholder="Email" className={style.formItem}/>
        </Item>
    </Form>
  );
};

export default CustomerModal;
