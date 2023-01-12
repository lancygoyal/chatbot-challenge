const manager = require('./nlp');

const cleanText = (msg) => {
  msg = msg.replace('.', '').replace('?', '');

  const [ques = '', args = ''] = msg.split(':');

  return [
    ques.toLowerCase(),
    args
      .trim()
      .split(',')
      .map((a) => a.trim()),
  ];
};

let nlpTrained = false;

const nlpInit = async () => {
  await manager.train();

  manager.save();

  nlpTrained = true;
};

const parser = async (messages) => {
  const text1 = messages[0]?.text;

  const text2 = messages[1]?.text;

  const text = text2 || text1;

  if (!nlpTrained) {
    await nlpInit();
  }

  const [ques, args] = cleanText(text);

  const response = await manager.process('en', text);

  if (response.intent.includes('init')) {
    return { type: 'boolean', operation: 'undefined', args: true, text };
  }

  if (response.intent.includes('number')) {
    return {
      type: 'number',
      operation: response.answer,
      args: response.sourceEntities.map(({ text }) => text),
      text,
    };
  }

  if (response.intent.includes('string')) {
    return { type: 'string', operation: response.answer, args, text };
  }

  if (response.intent.includes('team')) {
    console.log(response);

    const rslt = {
      type: 'team',
      operation: response.answer,
      args: {
        sport: ques
          .replace('which of the following is ', '')
          .replace('an ', '')
          .replace('a ', '')
          .replace(' team', ''),
        team: args,
      },
      text,
    };

    if (response.sourceEntities[1]?.entity === 'daterange') {
      return {
        ...rslt,
        args: {
          year: response.sourceEntities[0].text,
        },
      };
    }

    return {
      ...rslt,
    };
  }

  if (ques.includes('thank you')) {
    return { type: 'bye', operation: 'undefined', args, text };
  }

  return {
    type: 'undefined',
    operation: 'undefined',
    args,
    text,
  };
};

module.exports = parser;
