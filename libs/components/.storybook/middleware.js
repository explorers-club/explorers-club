// Proxy to make replicate api work in the browser w/ cors
const proxy = require('http-proxy-middleware');

module.exports = function expressMiddleware(router) {
  router.use(
    proxy.createProxyMiddleware(['/api'], {
      secure: false,
      target: 'http://localhost:3000',
      changeOrigin: true,
      onProxyReq(proxyReq, req) {
        proxyReq.setHeader('Host', `localhost:4400`);
        proxyReq.removeHeader('origin');
      },
    })
  );
};
