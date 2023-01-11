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

const parser = (messages) => {
  const text1 = messages[0]?.text;

  const text2 = messages[1]?.text;

  const text = text2 || text1;

  const [ques, args] = cleanText(text);

  if (ques.includes('ready')) {
    return { type: 'init', operation: 'undefined', args, text };
  }

  if (ques.includes('numbers')) {
    const rslt = { type: 'number', operation: 'undefined', args, text };

    if (ques.includes('sum')) {
      return {
        ...rslt,
        operation: 'add',
      };
    }

    if (ques.includes('largest')) {
      return {
        ...rslt,
        operation: 'max',
      };
    }

    return {
      ...rslt,
    };
  }

  if (ques.includes('words')) {
    const rslt = { type: 'string', operation: 'undefined', args, text };

    if (ques.includes('even')) {
      return {
        ...rslt,
        operation: 'even',
      };
    }

    if (ques.includes('alphabetize')) {
      return {
        ...rslt,
        operation: 'sort_asc',
      };
    }

    return {
      ...rslt,
    };
  }

  if (ques.includes('team')) {
    const rslt = {
      type: 'team',
      operation: 'find',
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

    if (ques.includes('sports') && ques.includes('established')) {
      return {
        ...rslt,
        operation: 'find',
        args: {
          year: ques.replace(
            'what sports teams in the data set were established in ',
            '',
          ),
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
