const parser = require('./utils/parser');
const {
  register,
  createConversation,
  getMessage,
  postMessage,
} = require('./utils/api');
const { init, number, string, team } = require('./utils/processor');

const getContent = ({ messages }) => {
  try {
    const data = parser(messages);

    if (data.type === 'init') {
      return init();
    } else if (data.type === 'number') {
      return number(data);
    } else if (data.type === 'string') {
      return string(data);
    } else if (data.type === 'team') {
      return team(data);
    } else if (data.type === 'bye') {
      return {
        content: 'Thanks, Bye',
      };
    }

    return {
      content: 'no',
    };
  } catch (error) {
    console.log(error);

    return null;
  }
};

(async () => {
  const user = await register({
    name: 'Lancy Goyal',
    email: 'i.lancygoyal@gmail.com',
  });

  if (!user) return;

  const conversation = await createConversation(user);

  if (!conversation) return;

  let messages = await getMessage(conversation);

  if (!messages) return;

  let result = await postMessage(conversation, getContent(messages));

  if (!result) return;

  while (result.correct) {
    messages = await getMessage(conversation);

    if (!messages) break;

    result = await postMessage(conversation, getContent(messages));
  }
})();
