const actions = {
  SET_MESSAGE_DATA: 'messages/SET_MESSAGE_DATA',
  LOAD_MESSAGES_REQUEST: 'messages/LOAD_MESSAGES_REQUEST',
  LOAD_MESSAGES_SUCCESS: 'messages/LOAD_MESSAGES_SUCCESS',
  LOAD_MESSAGES_FAILURE: 'messages/LOAD_MESSAGES_FAILURE',

  LOAD_CONVERSATION_MESSAGES_REQUEST:
    'messages/LOAD_CONVERSATION_MESSAGES_REQUEST',
  LOAD_CONVERSATION_MESSAGES_SUCCESS:
    'messages/LOAD_CONVERSATION_MESSAGES_SUCCESS',
  LOAD_CONVERSATION_MESSAGES_FAILURE:
    'messages/LOAD_CONVERSATION_MESSAGES_FAILURE',

  SEND_MESSAGE_REQUEST: 'messages/SEND_MESSAGE_REQUEST',
  SEND_MESSAGE_SUCCESS: 'messages/SEND_MESSAGE_SUCCESS',
  SEND_MESSAGE_FAILURE: 'messages/SEND_MESSAGE_FAILURE',
};

export default actions;
