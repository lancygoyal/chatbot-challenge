const fs = require('fs');
const { parse } = require('csv-parse/sync');
const axios = require('axios');

const BASE_URL = 'https://code-challenge.us1.sandbox-rivaltech.io';

const sportTeams = fs.readFileSync('./sports-teams.dat', 'utf8');

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

const cleanText = (msg, replacer) => {
  return msg
    .replace(replacer, '')
    .split(':')[1]
    .trim()
    .split(',')
    .map((a) => a.trim());
};

const isEven = (str) => !(str.length % 2);

const parseMessage = ({ messages }) => {
  try {
    const text1 = messages[0]?.text;

    const text2 = messages[1]?.text;

    const text = text2 || text1;

    if (text.includes('ready')) {
      return {
        content: 'yes',
      };
    } else if (text.includes('numbers') && text.includes('sum')) {
      const sum = cleanText(text, '?').reduce(
        (partialSum, a) => partialSum + Number(a),
        0,
      );

      return {
        content: String(sum),
      };
    } else if (text.includes('numbers') && text.includes('largest')) {
      const largest = Math.max(
        ...cleanText(text, '?').sort((a, b) => {
          return a - b;
        }),
      );

      return {
        content: String(largest),
      };
    } else if (text.includes('words') && text.includes('even')) {
      const evenWords = (strArr) => {
        return strArr
          .reduce((acc, val) => {
            if (isEven(val)) {
              acc.push(val);
            }
            return acc;
          }, [])
          .join(',');
      };

      return {
        content: evenWords(cleanText(text, '.')),
      };
    } else if (text.includes('words') && text.includes('alphabetize')) {
      return {
        content: cleanText(text, '.')
          .sort((a, b) => {
            return a.localeCompare(b);
          })
          .join(','),
      };
    } else if (
      text.includes('sports') &&
      text.includes('teams') &&
      text.includes('established')
    ) {
      const selector = text
        .replace('What sports teams in the data set were established in ', '')
        .replace('?', '');

      const yearsObj = parse(sportTeams, {
        columns: true,
        ltrim: true,
        rtrim: true,
        trim: true,
        skipEmptyLines: true,
        skipRecordsWithEmptyValues: true,
      });

      let teams = [];

      for (let index = 0; index < yearsObj.length; index++) {
        const element = yearsObj[index];
        if (element['year founded'] === selector) {
          teams.push(element['# Team name']);
        }
      }

      return {
        content: teams.join(','),
      };
    } else if (text.includes('team')) {
      const selector = text
        .split(':')[0]
        .replace('Which of the following is ', '')
        .replace('an ', '')
        .replace('a ', '')
        .replace(' team', '');

      const teams = cleanText(text, '?');

      const teamsObj = parse(sportTeams, {
        columns: true,
        ltrim: true,
        rtrim: true,
        trim: true,
        skipEmptyLines: true,
        skipRecordsWithEmptyValues: true,
        objname: '# Team name',
      });

      const sportsObj = parse(sportTeams, {
        columns: true,
        ltrim: true,
        rtrim: true,
        trim: true,
        skipEmptyLines: true,
        skipRecordsWithEmptyValues: true,
        objname: 'sport',
      });

      let team = '';

      teams.forEach((element) => {
        const teamObj = teamsObj[element] || sportsObj[element];

        if (teamObj['team league'] === selector) {
          team = element;
        } else if (teamObj['sport'] === selector) {
          team = element;
        }
      });

      return {
        content: team,
      };
    }

    return {
      content: 'yes',
    };
  } catch (error) {
    console.log(error);

    return null;
  }
};

(async () => {
  const user = await register({
    name: 'Lancy Goyal',
    email: 'lancy@goyal.com',
  });

  if (!user) return;

  const conversation = await createConversation(user);

  if (!conversation) return;

  let messages = await getMessage(conversation);

  if (!messages) return;

  let result = await postMessage(conversation, parseMessage(messages));

  if (!result) return;

  while (result.correct) {
    messages = await getMessage(conversation);

    if (!messages) break;

    result = await postMessage(conversation, parseMessage(messages));
  }
})();
