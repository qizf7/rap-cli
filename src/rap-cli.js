#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const program = require('commander');
const generateCode = require('./lib/generateCode');
const listActions = require('./lib/listActions');
const init = require('./lib/init');

let defaultConfig = {}
let rapRcPath = path.join(process.cwd(), './.raprc.js');
if (fs.existsSync(rapRcPath)) {
  defaultConfig = require(rapRcPath)
}

program
  .version('0.1.0');

program
  .command('init')
  .usage('<command> [options]')
  .description('init project(暂不可用)')
  .option('-f, --force', 'force init')
  .action(init);

program
  .command('generate')
  .alias('ge')
  .usage('<command> [options]')
  .description('generate request code with template')
  .option("--project <projectId>", "project id", defaultConfig.projectId)
  .option("--server <server>", "rap server", defaultConfig.server)

  .option("-t, --template <fileName>", "template file", './request-template')
  .option("-o, --output <fileName>", "output file or output directory")
  // .option("-a, --all", "generate request code by project")
  .option("-m, --module <moduleId>", "generate request code by moduleId")
  .option("-p, --page <pageId>", "generate request code by page")
  .option("-i, --interface <interfaceId>", "generate request code by interface")
  .action(generateCode);

program
  .command('list')
  .alias('ls')
  .usage('<command> [options]')
  .description('list interfacies')
  .option("--project <projectId>", "project id", defaultConfig.projectId)
  .option("--server <server>", "rap domain", defaultConfig.server)

  .option("-p, --page <pageId>", "list interface by pageId")
  .action(listActions);


program.on('command:*', function () {
  console.error('Invalid command: %s\nSee --help for a list of available commands.', program.args.join(' '));
  process.exit(1);
});

program.on('*', function () {
  console.error('Invalid command: %s\nSee --help for a list of available commands.', program.args.join(' '));
  process.exit(1);
});


program.parse(process.argv);

