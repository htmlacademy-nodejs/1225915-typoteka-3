const fs = require(`fs`).promises;
const { getLogger } = require(`../../lib/logger`);

const logger = getLogger({ name: `api` });

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.trim().split(`\n`);
  } catch (err) {
    logger.error(err);
    return [];
  }
};

module.exports = {
  readContent,
};
