#!/usr/bin/env node
const axios = require('axios');
const yargs = require('yargs');

const argv = yargs
  .options({
    'url': {
      demandOption: true,
      describe: 'The URL to make the request to.',
      type: 'string',
    },
    'req': {
      demandOption: true,
      describe: 'The type of HTTP request (GET or POST).',
      choices: ['get', 'post'],
      type: 'string',
    },
  })
  .usage('Usage: $0 --url <URL> --req <requestType>')
  .help('h')
  .alias('h', 'help')
  .argv;

const makeRequest = async (url, req) => {
  try {
    if (req.toLowerCase() === 'get') {
      const response = await axios.get(url);
      return response.data;
    } else if (req.toLowerCase() === 'post') {
      const response = await axios.post(url);
      return response.data;
    }
  } catch (error) {
    return `Error: ${error.message}`;
  }
};

const main = async () => {
  const { url, req } = argv;
  const response = await makeRequest(url, req);
  console.log(response);
};

main();
