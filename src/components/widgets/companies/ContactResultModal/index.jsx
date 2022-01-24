/* eslint-disable import/no-extraneous-dependencies */
import { Form, Select } from 'antd';
import classNames from 'classnames';
import TableFooter from 'components/layout/TableFooterLoader';
import debounce from 'lodash.debounce';
import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import customersActions from 'redux/customers/actions';
import { LoadingNode, NotFoundNode } from './components';
import styles from './styles.module.scss';

const ContactResultModal = ({ form, existUsers }) => {
  const { Item } = Form;
  const [page, setPage] = useState(1);
  const [formattedUsers, setFormattedUsers] = useState([]);
  const [searchName, setSearchName] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { items: users, total } = useSelector((state) => state.customers);

  useEffect(() => {
    setFormattedUsers(
      users
        .filter((user) => !existUsers.find(({ id }) => id === user.id))
        .map((user) => {
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
      type: customersActions.FETCH_CUSTOMERS_REQUEST,
      payload: {
        page,
        search,
      },
    });
  }, []);

  const loadPage = useCallback(() => {
    setLoading(true);
    setPage(page + 1);
    loadUsers({ page: page + 1, search: searchName });
  }, [searchName, page]);

  const sendQuery = useCallback(
    (query) => {
      if (query) {
        loadUsers({ page: 1, search: query });
        setPage(1);
      }
    },
    [loadUsers],
  );

  const delayedQuery = useMemo(() => debounce((q) => sendQuery(q), 500), [
    sendQuery,
  ]);

  useEffect(() => {
    return () => {
      delayedQuery.cancel();
    };
  }, [delayedQuery]);

  const onChangeSearch = useCallback((value) => {
    setLoading(true);
    setFormattedUsers([]);
    setSearchName(value);
    delayedQuery(value);
  }, []);

  const handleResetSearch = useCallback(() => {
    setSearchName(null);
  }, []);

  return (
    <Form form={form} layout="vertical" className={styles.contactResultModal}>
      <Item
        label="Results Contacts"
        name="results_contacts"
        className={styles.formItem}
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
          dropdownStyle={{
            maxHeight: 200,
            overflowY: 'hidden',
          }}
          notFoundContent={isLoading ? <LoadingNode /> : <NotFoundNode />}
          onBlur={handleResetSearch}
          optionFilterProp="label"
          listHeight={0}
          open
          dropdownClassName={classNames({ [styles.hide]: !searchName })}
          dropdownRender={(menu) => {
            return searchName ? (
              <div className={styles.dropDown}>
                {menu}
                <TableFooter
                  loading={isLoading}
                  disabled={users.length >= total}
                  loadMore={loadPage}
                />
              </div>
            ) : null;
          }}
        />
      </Item>
    </Form>
  );
};

export default ContactResultModal;
