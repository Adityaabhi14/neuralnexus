const fs = require('fs').promises;
const path = require('path');

// Simple in-memory mutex lock to prevent concurrent write race conditions
const locks = {};

const getLock = async (filename) => {
  while (locks[filename]) {
    await new Promise((resolve) => setTimeout(resolve, 10)); // wait 10ms
  }
  locks[filename] = true;
};

const releaseLock = (filename) => {
  locks[filename] = false;
};

const getFilePath = (filename) => path.join(__dirname, '..', 'data', filename);

const readData = async (filename) => {
  try {
    const filePath = getFilePath(filename);
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      await writeData(filename, []);
      return [];
    }
    console.error(`Error reading data from ${filename}:`, error);
    return [];
  }
};

const writeData = async (filename, data) => {
  await getLock(filename);
  try {
    const filePath = getFilePath(filename);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error(`Error writing data to ${filename}:`, error);
  } finally {
    releaseLock(filename);
  }
};

module.exports = {
  readData,
  writeData
};
