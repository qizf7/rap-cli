const fs = require('fs');
const path = require('path');
const ora = require('ora');
const colors = require('colors');
const utils = require('./utils')
const service = require('./service');
const enums = require('../enums');

let modelJSON = JSON.stringify({});
let compileAction = () => {};

function preProcessAction(action) {
  action.requestType = enums.REQ_TYPE[action.requestType];
  utils.trimParameterMock(action.requestParameterList);
  utils.trimParameterMock(action.responseParameterList);
  return action;
}

function generateCodeByInterface(options) {
  if (options.output && fs.existsSync(options.output)) {
    console.log(colors.red(`file ${colors.blue(output)} is exist, please remove or use other file generate module codes.`))
    return;
  }

  const action = utils.findActionById(modelJSON, parseInt(options.interface));

  if (!action) {
    console.error(colors.red(`cannot found interface with id ${colors.blue(options.interface)}`))
    return;
  }
  return new Promise((resolve, reject) => {
    let code = compileAction({
      domain: options.server,
      ...preProcessAction(action)
    });
    resolve(code);
    if (options.output) {
      fs.writeFile(options.output, code, err => {
        if (err) {
          reject(err)
        }
      })
    } else if (options.interface) {
      console.log(code);
    }
  });
}

function generateCodeByPage(options) {
  const page = utils.findPageById(modelJSON, parseInt(options.page));
  if (!page) {
    console.error(colors.red(`cannot found page with id ${colors.blue(options.page)}`))
    return
  }
  let output = options.output || `${page.name}.js`;
  if (output && fs.existsSync(output)) {
    console.log(colors.red(`file ${colors.blue(output)} is exist, please remove or use other file generate module codes.`))
    return
  }
  const interfaceCodes = page.actionList.map((action) => {
    return compileAction(preProcessAction(action));
  })
  fs.writeFile(output, interfaceCodes.join(''), err => {
    if (err) {
      console.error(err)
    }
  })
}

function generateCodeByModule(options) {
  const module = utils.findModuleById(modelJSON, parseInt(options.module));
  if (module) {
  } else {
    console.error(colors.red(`cannot found module with id ${colors.blue(options.module)}`))
  }
  let output = options.output || module.name;
  if (fs.existsSync(output)) {
    console.log(colors.red(`directory ${colors.blue(output)} is exist, please remove or use other directory.`))
    return
  }

  fs.mkdirSync(output);
  const pageList = module.pageList;
  pageList.forEach((page) => {
     generateCodeByPage({
       ...options,
       page: page.id,
       output: path.join(output, `${page.name}.js`)
     });
  })
}


function generateCodeByProject(project, template, output) {
  if (fs.existsSync(output)) {
    console.log(colors.red(`directory ${colors.blue(output)} is exist, please remove or use other directory.`))
    return
  }
  fs.mkdirSync(output);
  const moduleList = project.moduleList;
  Promise.all(moduleList.map((module) => {
    return generateCodeByModule(module, template, path.join(output, module.name));
  }))
    .then(() => {
      console.log(colors.green('code generate success...'))
    })
}

async function generateCode(options) {
  const loading = ora('Loading...').start();
  const {success, data} = await service.queryRAPModel(options.server, options.project);
  loading.stop();
  compileAction = await utils.getTemplate(options.template);
  if (!success) {
    return;
  }
  modelJSON = data;
  // 删除单引号前的\
  modelJSON = modelJSON.replace(/(\\(?='))/g, '');
  // 水平制表符替换为空格
  modelJSON = modelJSON.replace(/\u0009/g, ' ');
  modelJSON = JSON.parse(modelJSON);

  // fs.writeFile('modalJson.json', JSON.stringify(modelJSON, null, 2), err => {
  //   if (err) {
  //     reject(err)
  //   }
  // })
  if (options.interface) {
    generateCodeByInterface(options)
  }
  if (options.page) {
    generateCodeByPage(options)
  }
  if (options.module) {
    generateCodeByModule(options)
  }
  if (options.all) {
    output = output || modelJSON.name;
    generateCodeByProject(modelJSON, template, output);
  }

}

module.exports = generateCode;
