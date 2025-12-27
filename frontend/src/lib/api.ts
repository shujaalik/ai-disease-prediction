import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const predictHeartDisease = async (data: any) => {
  console.log(data)
  const response = await api.post('/predict', data);
  console.log(response)
  return response.data;
};
