import { createProxyMiddleware } from 'http-proxy-middleware'

export default createProxyMiddleware({
    changeOrigin: false,
    secure: false,
    target: process.env.API_URL,
    pathRewrite: function (path, req) { return path.replace('/api', '/swaps') }
})
