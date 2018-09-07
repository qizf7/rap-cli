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
