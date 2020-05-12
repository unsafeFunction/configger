import axiosClient from 'utils/axiosClient';

export const loadMessages = async query => {
  try {
    const conversations = await axiosClient.get('/conversations', {
      params: { ...query },
    });

    return conversations;
  } catch (error) {
    return error;
  }
};

export const loadConversationMessages = async query => {
  try {
    const messages = await axiosClient.get(
      `/conversation/${query.id}/messages`,
    );
    return messages;
  } catch (error) {
    return error;
  }
};

export const sendMessage = async body => {
  console.log(body);
  try {
    const messages = await axiosClient.post(`/conversation-messages`, {
      ...body,
    });
    return messages;
  } catch (error) {
    return error;
  }
};
