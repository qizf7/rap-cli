# rap-cli
基于RAP的开放API提供一些便利化的命令行工具。

## 开发背景
开发时频繁查看接口文档，编写请求代码，此部多为模板代码，书写麻烦，复制粘贴字段易出错。本着少写少出错原则，通过rap文档自动生成此部分代码。需要其他功能可以在issue中提出建议，或者提pr给我。

## 功能
- 通过命令行查看接口文档。
- 根据指定模板以模块、页面、接口为单位批量生成请求代码。

## 使用
- npm i rap-cli -g

Options:

    -V, --version          output the version number
    -h, --help             output usage information

  Commands:

    generate|ge [options]  generate request code with template
    list|ls [options]      list interfacies

### 配置文件
需要自己在项目目录下创建.raprc.js文件，否侧使用命令时需要指定--server和--project选项，可用配置项如下。
```
module.exports = {
  server: 'http://192.168.2.9:8080', // rap服务地址
  projectId: '218', // 默认项目id
}
```
### ls
在控制台列出当前项目所有接口，可通过选项-p指定页面，列出指定页面接口。

### generate
生成代码的命令，根据接口id、页面id、模块id和指定模板（默认模板为当前目录.request-template.js文件）生成请求代码文件。

#### 选项 -i
输出指定接口请求代码。
#### 选项 -p
输出指定页面请求代码。
#### 选项 -m
输出指定模块请求代码。

#### 选项 -o
- 当指定参数-i时，-o指定输出文件名，默认将请求代码输出到控制台。
- 当指定参数-p时，-o指定输出文件名，默认将使用页面名为文件名。
- 当指定参数-m时，-o指定输出文夹件名，默认将使用模块名为文件夹名。

#### 选项 -t
指定模板

使用lodash模板引擎，语法参考lodash。模板内可用参数参考[rap-openapi](https://github.com/thx/RAP/wiki/user_manual_cn#%E5%BC%80%E6%94%BEapi)。
```javascript
/**
  * <%= name %> <%= description %>
  * @see <%= domain %>/workspace/myWorkspace.do?projectId=<%= projectId %>#<%= id %><% _.forEach(requestParameterList, function recurseParams(parameter, prefix = '') { %>
  * @param <%= parameter.identifier %> {<%= parameter.dataType %>}  <%= parameter.name %> <%= parameter.remark %><% }) %>
  * <% _.forEach(responseParameterList, function recurseParams(parameter, prefix = '') { %>
  * @return <%= parameter.identifier %> {<%= parameter.dataType %>}  <%= parameter.name %> <%= parameter.remark %><% }) %>
  */
 export function <%= name %>(params) {
  return request({
    url: '<%= requestUrl %>',
    method: '<%= requestType %>',
    data: {<% _.forEach(requestParameterList, function(parameter) { %>
      <%= parameter.identifier %>: params.<%= parameter.identifier %>, <% }) %>
    }
  })
}
```

通过上面的模板生成的代码
```javascript
/**
  * 登录接口
  * @see http://domain.com/workspace/myWorkspace.do?projectId=111#111
  * @param code {string} 小程序登录获取的code
  * @param encryptedData {string} 加密数据
  * @param iv {string} 偏移量
  * @return code {number}  状态码 1微信会话失效 2加密串和偏移量错误
  * @return msg {string}  提醒消息
  * @return data {string}   返回的数据
  *
  */
exports.checkSession = function (params) {
  return request({
    url: '/api/login',
    method: 'POST',
    data: {
      code: params.code,
      encryptedData: params.encryptedData,
      iv: params.iv,
    }
  })
}

```


```
  rap-cli generate -i 1 -o api.js
  rap-cli generate -p 2 -o api.js
  rap-cli generate -m 3 -o api
```
三个命令分别将将 接口id为1、页面id为12、模块id为3 的接口请求代码输出到api.js。


## 计划
[ ] 增加本地缓存
[ ] 复杂请求&相应参数表示
[ ] 内容过长导致表格错位
[ ] 增加单元测试
[ ] 通过开放API修改接口mock数据，方便开发时修改rap mock服务返回数据。（TODO）
[ ] 根据项目接口文档，生成本地mock服务，方便无内网环境开发。（TODO）
[ ] 生成接口代码时查询单接口数据，避免因部分数据不可用造成所有接口代码无法生成

