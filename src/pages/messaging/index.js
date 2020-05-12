import React, { useEffect, useCallback, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Picker from 'emoji-picker-react';
import { Helmet } from 'react-helmet';
import { Input, Button, Skeleton } from 'antd';
import Loader from 'components/layout/Loader';
import { Scrollbars } from 'react-custom-scrollbars';
import actions from 'redux/messages/actions';
import { SmileOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import useOnClickOutside from 'hooks/useClickOutside';

import style from './style.module.scss';

const AppsMessaging = () => {
  const dispatch = useDispatch();
  const conversations = useSelector(state => state.messages.all);
  const singleConversation = useSelector(
    state => state.messages.singleConversation,
  );
  const [isEmojiOpen, openEmojiPicker] = useState(false);
  const ref = useRef();

  console.log(singleConversation);
  useOnClickOutside(ref, () => openEmojiPicker());

  useEffect(() => {
    dispatch({
      type: actions.LOAD_MESSAGES_REQUEST,
      payload: {
        status: 'ACTIVE',
      },
    });
  }, []);

  const onConversationChange = useCallback(
    id => {
      dispatch({
        type: actions.LOAD_CONVERSATION_MESSAGES_REQUEST,
        payload: {
          id,
        },
      });
      dispatch({
        type: actions.SET_MESSAGE_DATA,
        payload: {
          name: 'id',
          value: id,
        },
      });
    },
    [dispatch],
  );

  const onMessageChange = useCallback(
    event => {
      const { name, value } = event.target;

      dispatch({
        type: actions.SET_MESSAGE_DATA,
        payload: {
          name,
          value,
        },
      });
    },
    [dispatch],
  );

  const sendMessage = useCallback(
    event => {
      const { name, value } = event.target;

      dispatch({
        type: actions.SEND_MESSAGE_REQUEST,
      });
    },
    [dispatch],
  );

  const onOpenEmojiPicker = useCallback(() => {
    openEmojiPicker(!isEmojiOpen);
  }, [isEmojiOpen]);

  return (
    <div>
      <Helmet title="Apps: Messaging" />
      <div className="row">
        <div className="col-12 col-md-4">
          <div className={style.dialogs}>
            <Scrollbars
              autoHide
              renderThumbVertical={({ ...props }) => (
                <div
                  {...props}
                  style={{
                    width: '5px',
                    borderRadius: 'inherit',
                    backgroundColor: 'rgba(195, 190, 220, 0.4)',
                    left: '1px',
                  }}
                />
              )}
            >
              {conversations.items.map((item, index) => (
                <div
                  role="presentation"
                  onClick={() => onConversationChange(item.id)}
                  key={item.id}
                  className={`${style.item} ${
                    index === 1 ? style.current : ''
                  } d-flex flex-nowrap align-items-center`}
                >
                  <div className="air__utils__avatar air__utils__avatar--size46 mr-3 flex-shrink-0">
                    <img
                      src="/resources/images/avatars/avatar.png"
                      alt="avatar"
                    />
                  </div>
                  <div className={`${style.info} flex-grow-1`}>
                    <div className="text-dark font-size-18 font-weight-bold text-truncate">
                      {item.customer.username}
                    </div>
                  </div>
                  <div
                    className={`${style.unread} flex-shrink-0 align-self-start`}
                  />
                </div>
              ))}
            </Scrollbars>
          </div>
        </div>
        <div className="col-12 col-md-8">
          <div className="card">
            <div className="card-header card-header-flex align-items-center">
              <div className="d-flex flex-column justify-content-center mr-auto">
                {singleConversation.isLoading ? (
                  <Skeleton.Input active />
                ) : (
                  <h5 className="mb-0 mr-2 font-size-18">
                    {singleConversation.customer.username}
                  </h5>
                )}
              </div>
              <div>
                <Button type="primary" ghost>
                  Close conversation
                </Button>
              </div>
            </div>
            <div className="card-body">
              <div className="height-400">
                <Scrollbars
                  autoHide
                  renderThumbVertical={({ ...props }) => (
                    <div
                      {...props}
                      style={{
                        width: '5px',
                        borderRadius: 'inherit',
                        backgroundColor: 'rgba(195, 190, 220, 0.4)',
                        left: '1px',
                      }}
                    />
                  )}
                >
                  <div className="d-flex flex-column justify-content-end height-100p">
                    {singleConversation.isLoading ? (
                      <Loader />
                    ) : (
                      singleConversation.messages.map(message => (
                        <div
                          key={message.id}
                          className={classNames(style.message, {
                            [style.answer]: message.authorType !== 'AGENT',
                          })}
                        >
                          <div className={style.messageContent}>
                            <div className="text-gray-4 font-size-12 text-uppercase">
                              {message.authorType === 'CUSTOMER'
                                ? message.authorName
                                : 'Agent'}
                            </div>
                            <div>{message.body}</div>
                          </div>
                          <div
                            className={`${style.messageAvatar} air__utils__avatar`}
                          >
                            <img
                              src="resources/images/avatars/avatar-2.png"
                              alt={message.authorName}
                            />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </Scrollbars>
              </div>
              <div className="pt-2 pb-2" />
              {isEmojiOpen && (
                <div className={style.pickerWrap}>
                  <Picker preload />
                </div>
              )}
              <div className="input-group mb-3">
                <Input
                  onChange={onMessageChange}
                  type="text"
                  name="body"
                  className="form-control"
                  placeholder="Send message..."
                />
                <div className="input-group-append">
                  <button
                    onClick={sendMessage}
                    className="btn btn-primary"
                    type="button"
                  >
                    <i className="fe fe-send align-middle" />
                  </button>
                </div>
              </div>
              <SmileOutlined onClick={onOpenEmojiPicker} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppsMessaging;
