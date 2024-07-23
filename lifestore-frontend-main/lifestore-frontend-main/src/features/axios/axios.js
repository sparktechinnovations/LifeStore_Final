import axios from 'axios';

export default axios.create({
  baseURL: 'https://ao6xnis1tb.execute-api.ap-south-1.amazonaws.com/',
  // baseURL: 'http://localhost:8000/',
});

// test url = https://c2kioeastb.execute-api.ap-south-1.amazonaws.com/test
