#!/usr/bin/env node
const axios = require('axios');
const yargs = require('yargs');
const ansiHtml = require('ansi-html');
const fs = require('fs').promises;
const { exec } = require('child_process');

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
    const response = await axios({
      method: req.toLowerCase(),
      url: url,
      responseType: 'arraybuffer',
    });
    return {
      data: response.data,
      contentType: response.headers['content-type'],
    };
  } catch (error) {
    return {
      error: `Error: ${error.message}`,
    };
  }
};

const displayContent = async (content, contentType) => {
  if (contentType && contentType.startsWith('text')) {
    const ansiHtmlContent = ansiHtml(content.toString());
    console.log(ansiHtmlContent);
  } else {
    console.log('Binary content, saving to file and opening in default app.');
    const filename = 'downloaded_file';
    await fs.writeFile(filename, content);
    exec(`start ${filename}`);
  }
};

const main = async () => {
  const { url, req } = argv;
  const { data, contentType, error } = await makeRequest(url, req);

  if (error) {
    console.error(error);
  } else {
    await displayContent(data, contentType);
  }
};

main();
