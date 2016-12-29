const path = require('path');
const process = require('process');

const fse = require('fs-extra');

function setup() {
    const cwd = process.cwd();
    fse.copySync(path.join(__dirname, '..', 'skeleton'), cwd);
    console.log('Copied skeleton into ' + cwd);
    console.log('Please update the config.yaml file with the appropriate settings.');
}

module.exports = setup;
