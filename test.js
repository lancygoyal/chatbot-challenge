const manager = require('./utils/nlp');

(async () => {
  await manager.train();

  manager.save();

  const response = await manager.process(
    'en',
    'Which of the following is an NHL team: Toronto Argonauts, Montreal Canadiens, Vancouver Whitecaps FC?',
  );

  console.log(response);
})();
