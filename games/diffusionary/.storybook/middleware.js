// Proxy to make replicate api work in the browser w/ cors
const proxy = require('http-proxy-middleware');

const REPLICATE_API_TOKEN = process.env['NX_REPLICATE_API_TOKEN'];

module.exports = function expressMiddleware(router) {
  router.use(
    proxy.createProxyMiddleware(['/v1/predictions'], {
      secure: false,
      target: 'https://api.replicate.com',
      changeOrigin: true,
      onProxyReq(proxyReq, req) {
        proxyReq.setHeader('Authorization', `Token ${REPLICATE_API_TOKEN}`);
        proxyReq.setHeader('Host', `api.replicate.com`);
        proxyReq.removeHeader('origin');
      },
    })
  );
};
