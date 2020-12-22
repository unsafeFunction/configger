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

const ContactResultModal = ({ form, existUsers }) => {
  const { Item } = Form;
  const [page, setPage] = useState(1);
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

  const sendQuery = useCallback(query => {
    if (query) {
      loadUsers({ page: 1, search: query });
      setPage(2);
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

  const handleResetSearch = useCallback(() => {
    setSearchName('');
  }, []);

  return (
    <Form form={form} layout="vertical">
      <Item
        label="Results Contacts"
        name="results_contacts"
        rules={[
          {
            required: true,
            message: 'This field is required.',
          },
        ]}
      >
        <Select
          placeholder="Results Contacts"
          mode="multiple"
          size="middle"
          options={users
            .filter(user => !existUsers.find(({ id }) => id === user.id))
            .map(user => {
              return {
                label: `${user.first_name} ${user.last_name}`,
                value: user.id,
              };
            })}
          loading={areUsersLoading}
          onSearch={onChangeSearch}
          onSelect={handleResetSearch}
          showSearch
          filterOption={false}
          onBlur={handleResetSearch}
          optionFilterProp="label"
          listHeight={0}
          open
          dropdownClassName={classNames({ [style.hide]: !searchName.length })}
          dropdownRender={menu => {
            return searchName.length ? (
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
            ) : null;
          }}
        />
      </Item>
    </Form>
  );
};

export default ContactResultModal;
