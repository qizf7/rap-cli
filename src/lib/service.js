const axios = require('axios');
const colors = require('colors');

axios.defaults.timeout = 10000;

axios.interceptors.response.use(
  response => {
    if (response.data.code === 200) {
      const data = (
        response.data.model ||
        response.data.modelJSON
      );
      return {
        success: true,
        data
      }
    } else {
      return {
        success: false,
        message: response.data.msg
      }
    }
  },
  error => {
    console.log(colors.red(`\n${error.message}`))
    return {
      success: false,
      message: error.message
    }
  }
)

/**
 * 查询所有接口
 */
exports.queryModel = function (server, projectId) {
  return axios.get(`${server}/api/queryModel.do`, {
    params: {
      projectId
    }
  })
}

/**
 * 查询所有接口数据
 */
exports.queryRAPModel = function (server, projectId) {
  return axios.get(`${server}/api/queryRAPModel.do`, {
    params: {
      projectId
    }
  })
}

exports.queryMock = function (server, projectId, relativePath) {
  return axios.get(`${server}/mockjs/${projectId}/${relativePath}`)
    .then((response) => {
      const { modelJSON, code, msg } = response.data;
      if (code === 200) {
        return modelJSON;
      } else {
        console.log(colors.red(msg));
      }
    })
}
