const process = require('process');

const setup = require('./lib/setup');
const generate = require('./lib/generate');

function printHelp() {
    console.log(`usage: netglyph <command>

where command can be one of:
setup     setup netglyph in this directory`);
    process.exit(1);
}

if (process.argv.length < 3) {
    printHelp();
}

switch (process.argv[2]) {
    case 'setup':
        setup();
        break;
    case 'generate':
        generate();
        break;
    default:
        printHelp();
}
