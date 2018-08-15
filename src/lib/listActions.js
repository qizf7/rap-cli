const colors = require('colors');
const ora = require('ora');
const Table = require('cli-table-zh');
const service = require('./service');
const enums = require('../enums');


function listActions(options) {
  const loading = ora('Loading...').start();
  service.queryModel(options.server, options.project)
    .then(({success, data, message}) => {
      loading.stop();
      if (!success) {
        console.log(message)
        return;
      }
      console.log('');
      console.log(colors.blue(`[ ${data.name} ${data.ver} ]`));
      console.log('');
      data.moduleList.forEach(module => {
        console.log(colors.yellow(`${module.name}`));
        module.pageList.forEach(page => {
          const pageTable = new Table({
            head: ['ID', 'Name', 'Method', 'URL', 'Description'],
          });
          console.log('');
          console.log(` ${colors.cyan(page.name)} | ${colors.cyan(page.id)}`);
          page.interfaceList.forEach(interface => {
            pageTable.push([
              interface.id,
              interface.name,
              enums.REQ_TYPE[interface.reqType],
              interface.reqUrl,
              interface.desc
            ]);
          })
          console.log(pageTable.toString());
        })
      })
    })
}

module.exports = listActions;
