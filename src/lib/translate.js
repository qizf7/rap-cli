const axios = require('axios');
const colors = require('colors');
const config = require('../config');
const MD5 = require('../vendor/MD5');
const TIME_OUT = 10000;

const translateApiAxios = axios.create({
  timeout: TIME_OUT,
});

module.exports = function (query) {
  const salt = (new Date).getTime();
  const str1 = config.baiduTranslateAppID + query + salt + config.baiduTranslateSecret;
  const sign = MD5(str1);
  return translateApiAxios.get(`${config.baiduTranslateApi}`, {
    params: {
      q: query,
      from: 'zh',
      to: 'en',
      appid: config.baiduTranslateAppID,
      salt,
      sign,
    }
  })
    .then((response) => {
      return response.data.trans_result
    })
}


// $.ajax({
//     url: 'http://api.fanyi.baidu.com/api/trans/vip/translate',
//     type: 'get',
//     dataType: 'jsonp',
//     data: {
//         q: query,
//         appid: appid,
//         salt: salt,
//         from: from,
//         to: to,
//         sign: sign
//     },
//     success: function (data) {
//         console.log(data);
//     }
// });
