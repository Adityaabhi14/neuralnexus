const fs = require('fs').promises;
const path = require('path');

const getDataFilePath = (filename) => path.join(__dirname, '../data', filename);

// Safely ensure data directory and files exist
const ensureFileExists = async (filename, defaultData = []) => {
    const dir = path.join(__dirname, '../data');
    try {
        await fs.mkdir(dir, { recursive: true });
    } catch (e) {
        // Directory exists or other error, proceed
    }
    
    const filePath = getDataFilePath(filename);
    try {
        await fs.access(filePath);
    } catch (e) {
        await fs.writeFile(filePath, JSON.stringify(defaultData, null, 2));
    }
};

const readData = async (filename) => {
    await ensureFileExists(filename);
    try {
        const rawData = await fs.readFile(getDataFilePath(filename), 'utf8');
        return JSON.parse(rawData);
    } catch (error) {
        console.error(`Error reading ${filename}:`, error);
        return [];
    }
};

const writeData = async (filename, data) => {
    await ensureFileExists(filename);
    try {
        await fs.writeFile(getDataFilePath(filename), JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error(`Error writing to ${filename}:`, error);
        throw new Error('Database Commit Failure');
    }
};

module.exports = {
    readData,
    writeData
};
