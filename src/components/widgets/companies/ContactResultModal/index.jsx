/* eslint-disable import/no-extraneous-dependencies */
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import 'emoji-mart/css/emoji-mart.css';
import {
  Input,
  Row,
  Col,
  Select,
  Typography,
  Switch,
  Form,
  Space,
  Button,
} from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import InfiniteScroll from 'react-infinite-scroller';
import debounce from 'lodash.debounce';
import styles from './styles.module.scss';
import style from '../../Customer/CustomerModal/style.module.scss';
import { constants } from '../../../../utils/constants';
import userActions from '../../../../redux/user/actions';
import actions from '../../../../redux/companies/actions';

const ContactResultModal = ({ form }) => {
  const { Item } = Form;
  const [page, setPage] = useState(0);
  const [searchName, setSearchName] = useState('');
  const dispatch = useDispatch();
  const { items: users, total, areUsersLoading } = useSelector(
    state => state.user,
  );

  const loadUsers = useCallback(({ page, search }) => {
    dispatch({
      type: userActions.LOAD_USERS_REQUEST,
      payload: {
        page,
        search,
      },
    });
  }, []);

  const loadPage = useCallback(
    page => {
      loadUsers({ page, search: searchName });
      setPage(page + 1);
    },
    [searchName],
  );

  useEffect(() => {
    page === 0 && loadPage(0);
  });

  const sendQuery = useCallback(query => {
    if (query || query === '') {
      loadUsers({ page: 1, search: query });
      setPage(1);
    }
  }, []);

  const delayedQuery = useCallback(
    debounce(q => sendQuery(q), 500),
    [],
  );

  const onChangeSearch = useCallback(value => {
    setSearchName(value);
    delayedQuery(value);
  }, []);

  return (
    <Form form={form} layout="vertical">
      <Item
        label="Users"
        name="users"
        rules={[
          {
            required: true,
            message: 'This field is required.',
          },
        ]}
      >
        <Select
          placeholder="Users"
          mode="multiple"
          size="middle"
          options={users.map(user => {
            return {
              label: `${user.first_name} ${user.last_name}`,
              value: user.id,
            };
          })}
          loading={areUsersLoading}
          showArrow
          onSearch={onChangeSearch}
          showSearch
          optionFilterProp="label"
          listHeight={0}
          dropdownMatchSelectWidth={false}
          dropdownRender={menu => (
            <div className={style.dropDown}>
              <InfiniteScroll
                pageStart={page}
                loadMore={() => loadPage(page)}
                dataLength={users.length}
                hasMore={!areUsersLoading && users.length < total}
                threshold={50}
                useWindow={false}
              >
                {menu}
              </InfiniteScroll>
            </div>
          )}
        />
      </Item>
    </Form>
  );
};

export default ContactResultModal;
