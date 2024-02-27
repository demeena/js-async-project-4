const nock = require('nock');
const fs = require('fs').promises;
const os = require('os');
const path = require('path');
const pageLoader = require('../src/index');

test('page-loader', async () => {
    const url = 'https://ru.hexlet.io/courses';
    const expectedFilename = 'ru-hexlet-io-courses.html';
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'page-loader-'));

    nock('https://ru.hexlet.io')
        .get('/courses')
        .reply(200, 'mocked response');

    const filepath = await pageLoader(url, tempDir);
    const content = await fs.readFile(filepath, 'utf-8');

    expect(filepath).toBe(path.join(tempDir, expectedFilename));
    expect(content).toBe('mocked response');
});
