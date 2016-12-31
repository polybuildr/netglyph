'use strict';
const fs = require('fs');
const process = require('process');
const path = require('path');

const yaml = require('js-yaml');

function loadConfig() {
    return yaml.safeLoad(fs.readFileSync(path.join(process.cwd(), 'config.yaml'), 'utf8'));
}

module.exports = loadConfig;
