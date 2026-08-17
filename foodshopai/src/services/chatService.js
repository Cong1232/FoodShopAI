import axiosClient from './axiosClient';

const chatService = {
  sendMessage: (message) => {
    return axiosClient.post('/chat', { message });
  }
};

export default chatService;
