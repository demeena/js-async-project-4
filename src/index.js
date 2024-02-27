#!/usr/bin/env node
const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
const { program } = require('commander');


const convertUrlToFilename = (url) => {
    return url.replace(/^https?:\/\//, '').replace(/[^a-zA-Z0-9]/g, '-') + '.html';
};

const pageLoader = async (url, output = process.cwd()) => {
    try {
        const response = await axios.get(url);
        const filename = convertUrlToFilename(url);
        const filepath = path.join(output, filename);
        const dir = path.dirname(filepath);
        await fs.mkdir(dir, { recursive: true });
        await fs.writeFile(filepath, response.data);
        return filepath;
    } catch (error) {
        throw new Error(`Error downloading page: ${error.message}`);
    }
};

program
  .option('-o, --output <dir>', 'output dir', process.cwd());

program.parse(process.argv);

const options = program.opts();
const url = program.args[0]; // Получаем URL из аргументов командной строки

if (!url) {
    console.error('No URL provided');
    process.exit(1);
}

pageLoader(url, options.output)
  .then(filepath => console.log(`Page has been downloaded and saved to ${filepath}`))
  .catch(error => {
      console.error(`Error downloading page: ${error.message}`);
      process.exit(1);
  });

