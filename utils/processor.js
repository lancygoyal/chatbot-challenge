const fs = require('fs');
const { parse } = require('csv-parse/sync');

const { isEven } = require('./misc');

const sportTeams = fs.readFileSync('./sports-teams.dat', 'utf8');

const yearsObj = parse(sportTeams, {
  columns: true,
  ltrim: true,
  rtrim: true,
  trim: true,
  skipEmptyLines: true,
  skipRecordsWithEmptyValues: true,
});

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

const init = () => {
  return {
    content: 'yes',
  };
};

const number = (data) => {
  if (data.operation === 'add') {
    const sum = data.args.reduce((partialSum, a) => partialSum + Number(a), 0);

    return {
      content: String(sum),
    };
  }

  if (data.operation === 'max') {
    const largest = Math.max(
      ...data.args.sort((a, b) => {
        return a - b;
      }),
    );

    return {
      content: String(largest),
    };
  }

  return {
    content: data.args.join(', '),
  };
};

const string = (data) => {
  if (data.operation === 'even') {
    const evenWords = data.args
      .reduce((acc, val) => {
        if (isEven(val)) {
          acc.push(val);
        }
        return acc;
      }, [])
      .join(',');

    return {
      content: evenWords,
    };
  }

  if (data.operation === 'sort_asc') {
    return {
      content: data.args
        .sort((a, b) => {
          return a.localeCompare(b);
        })
        .join(','),
    };
  }

  return {
    content: data.args.join(', '),
  };
};

const team = (data) => {
  if (data.args.sport && data.args.team) {
    let team = '';

    data.args.team.forEach((element) => {
      const teamObj = teamsObj[element] || sportsObj[element];

      if (teamObj['team league'].toLowerCase() === data.args.sport) {
        team = element;
      } else if (teamObj['sport'].toLowerCase() === data.args.sport) {
        team = element;
      }
    });

    return {
      content: team,
    };
  }

  if (data.args.year) {
    let teams = [];

    for (let index = 0; index < yearsObj.length; index++) {
      const element = yearsObj[index];
      if (element['year founded'] === data.args.year) {
        teams.push(element['# Team name']);
      }
    }

    return {
      content: teams.join(','),
    };
  }

  return {
    content: data.args.join(', '),
  };
};

module.exports = { init, number, string, team };
