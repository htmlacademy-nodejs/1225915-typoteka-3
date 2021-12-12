const path = require(`path`);

const DEFAULT_PORT = 8080;
const PUBLIC_DIR = `public`;
const UPLOAD_DIR = `upload`;
const TEMPLATES_PATH = path.join(`templates`, `pages`);

module.exports = {
  DEFAULT_PORT,
  PUBLIC_DIR,
  UPLOAD_DIR,
  TEMPLATES_PATH,
};
