module.exports = {
  "/activiti-app": {
    "target": "http://<aps-hostname>:<aps-port>",
    "secure": false,
    // "pathRewrite": {
    //   "^/activiti-app/activiti-app": ""
    // },
    "changeOrigin": true
  },
  "/alfresco": {
    "target": "http://<acs-hostname>:<acs-port>",
    "secure": false,
    // "pathRewrite": {
    //   "^/alfresco/alfresco": ""
    // },
    "changeOrigin": true,
    // workaround for REPO-2260
    onProxyRes: function (proxyRes, req, res) {
      const header = proxyRes.headers['www-authenticate'];
      if (header && header.startsWith('Basic')) {
          proxyRes.headers['www-authenticate'] = 'x' + header;
      }
    }
  },
};
