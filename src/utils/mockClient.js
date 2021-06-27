import axios from 'axios';

const APIMock = axios.create({
  baseURL: process.env.REACT_APP_MOCK_URL,
});

export default APIMock;
