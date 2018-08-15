const _ = require('lodash');
const fs = require('fs');
const colors = require('colors')
/**
 * max length
 * @param {*} arr
 */
exports.maxLength = function(arr) {
  let max = 0;
  for (let i = 0; i < arr.length; i++) {
    const element = arr[i];
    if (element.length > max) {
      max = element.length;
    }
  }
  return max;
}

/**
 * 查询module
 * @param {*}} modelJSON
 * @param {*} id
 */
exports.findModuleById = function(modelJSON, id) {
  const { moduleList } = modelJSON;
  for (let i = 0; i < moduleList.length; i++) {
    const module = moduleList[i];
    if (module.id === id) {
      return module;
    }
  }
}


/**
 * 查询页面
 * @param {*}} modelJSON
 * @param {*} id
 */
exports.findPageById = function(modelJSON, id) {
  const { moduleList } = modelJSON;
  for (let i = 0; i < moduleList.length; i++) {
    const module = moduleList[i];
    const { pageList } = module;
    for (let i = 0; i < pageList.length; i++) {
      const page = pageList[i];
      if (page.id === id) {
        return page;
      }
    }
  }
}

/**
 * 查询action
 * @param {*} modelJSON
 */
exports.findActionById = function(modelJSON, id) {
  const { moduleList } = modelJSON;
  for (let i = 0; i < moduleList.length; i++) {
    const module = moduleList[i];
    const { pageList } = module;
    for (let i = 0; i < pageList.length; i++) {
      const page = pageList[i];
      const { actionList } = page;
      for (let i = 0; i < actionList.length; i++) {
        const action = actionList[i];
        if (action.id === id) {
          return action;
        }
      }
    }
  }
}

/**
 * 获取模板
 */
exports.getTemplate = function(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        console.error(colors.red(`read template ${filePath} fail`))
        reject(err);
        return;
      };
      const compile =  _.template(data.toString());
      resolve(compile);
    })
  })
}


/**
 * trim @mock
 */

exports.trimMock = function (str) {
  return str.replace(/@mock=.*/, '')
}


