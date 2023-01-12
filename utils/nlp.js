const { NlpManager } = require('node-nlp');

const manager = new NlpManager({
  languages: ['en'],
  forceNER: true,
  nlu: { log: false },
});

// Adds the utterances and intents for the NLP
manager.addDocument('en', 'are you ready to begin', 'init');
manager.addDocument(
  'en',
  'are you ready to continue to some word questions',
  'init',
);
manager.addDocument('en', 'are you ready to go', 'init');
manager.addDocument('en', 'sum of the following numbers', 'number.sum');
manager.addDocument('en', 'largest of the following numbers', 'number.max');
manager.addDocument(
  'en',
  'repeat only the words with an even number of letters',
  'string.even',
);
manager.addDocument('en', 'alphabetize the following words', 'string.sort_asc');
manager.addDocument('en', 'which of the following is a _ team', 'team.find');
manager.addDocument('en', 'which of the following is an _ team', 'team.find');
manager.addDocument(
  'en',
  'sports teams in the data set were established in',
  'team.find',
);

// Train also the NLG
manager.addAnswer('en', 'init', 'yes');
manager.addAnswer('en', 'number.sum', 'sum');
manager.addAnswer('en', 'number.max', 'max');
manager.addAnswer('en', 'string.even', 'even');
manager.addAnswer('en', 'string.sort_asc', 'sort_asc');
manager.addAnswer('en', 'team.find', 'find');

module.exports = manager;
