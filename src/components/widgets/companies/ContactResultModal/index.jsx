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
  Spin,
} from 'antd';
import {
  MinusCircleOutlined,
  PlusOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import InfiniteScroll from 'react-infinite-scroller';
import debounce from 'lodash.debounce';
import style from './styles.module.scss';
import { constants } from '../../../../utils/constants';
import userActions from '../../../../redux/user/actions';
import actions from '../../../../redux/companies/actions';
import { LoadingNode, NotFoundNode } from './components';

const ContactResultModal = ({ form, existUsers }) => {
  const { Item } = Form;
  const [page, setPage] = useState(1);
  const [formattedUsers, setFormattedUsers] = useState([]);
  const [searchName, setSearchName] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { items: users, total, areUsersLoading } = useSelector(
    state => state.user,
  );

  useEffect(() => {
    setFormattedUsers(
      users
        .filter(user => !existUsers.find(({ id }) => id === user.id))
        .map(user => {
          return {
            label: `${user.first_name} ${user.last_name}`,
            value: user.id,
          };
        }),
    );
    setLoading(false);
  }, [users]);

  const loadUsers = useCallback(({ page, search }) => {
    dispatch({
      type: userActions.LOAD_USERS_REQUEST,
      payload: {
        page,
        search,
      },
    });
  }, []);

  const loadPage = useCallback(() => {
    setLoading(true);
    setPage(page + 1);
    loadUsers({ page, search: searchName });
  }, [searchName, page]);

  const sendQuery = useCallback(query => {
    if (query) {
      loadUsers({ page: 1, search: query });
      setPage(1);
    }
  }, []);

  const delayedQuery = useCallback(
    debounce(q => sendQuery(q), 500),
    [],
  );

  const onChangeSearch = useCallback(value => {
    setLoading(true);
    setFormattedUsers([]);
    setSearchName(value);
    delayedQuery(value);
  }, []);

  const handleResetSearch = useCallback(() => {
    setSearchName(null);
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
          options={formattedUsers}
          onSearch={onChangeSearch}
          onSelect={handleResetSearch}
          showSearch
          filterOption={false}
          notFoundContent={isLoading ? <LoadingNode /> : <NotFoundNode />}
          onBlur={handleResetSearch}
          optionFilterProp="label"
          listHeight={0}
          open
          dropdownClassName={classNames({ [style.hide]: !searchName })}
          dropdownRender={menu => {
            return searchName ? (
              <div className={style.dropDown}>
                <InfiniteScroll
                  pageStart={1}
                  loadMore={loadPage}
                  dataLength={users.length}
                  hasMore={!isLoading && formattedUsers.length < total}
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
