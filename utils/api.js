const axios = require('axios');

const BASE_URL = 'https://code-challenge.us1.sandbox-rivaltech.io';

const register = async (body) => {
  try {
    const { data } = await axios({
      method: 'post',
      url: `${BASE_URL}/challenge-register`,
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify(body),
    });

    console.log(data);

    return data;
  } catch (error) {
    console.log(error);

    return null;
  }
};

const createConversation = async (body) => {
  try {
    const { data } = await axios({
      method: 'post',
      url: `${BASE_URL}/challenge-conversation`,
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify(body),
    });

    console.log(data);

    return data;
  } catch (error) {
    console.log(error);

    return null;
  }
};

const getMessage = async (params) => {
  try {
    const { data } = await axios({
      method: 'get',
      url: `${BASE_URL}/challenge-behaviour/${params.conversation_id}`,
    });

    console.log(data);

    return data;
  } catch (error) {
    console.log(error);

    return null;
  }
};

const postMessage = async (params, body) => {
  try {
    console.log('postMessage', body);

    const { data } = await axios({
      method: 'post',
      url: `${BASE_URL}/challenge-behaviour/${params.conversation_id}`,
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify(body),
    });

    console.log(data);

    return data;
  } catch (error) {
    // console.log(error);

    return null;
  }
};

module.exports = { register, createConversation, getMessage, postMessage };
