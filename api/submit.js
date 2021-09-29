import {createProxyMiddleware} from 'http-proxy-middleware'
import modifyResponse from 'node-http-proxy-json';

export default createProxyMiddleware({
    changeOrigin: false,
    secure: false,
    target: process.env.API_URL,
    router: function (req) {
        if (!isJson(req)) {
            return process.env.BRIDGE_URL
        }
        return process.env.API_URL
    },
    pathRewrite: function (path, req) {
        if (!isJson(req)) {
            return path.replace('/api', '')
        }
        return path.replace('/api/submit', '/swaps/assign')
    },
    onProxyReq(proxyReq, req, res) {
        if (!isJson(req) || !req.method || req.method.toLowerCase() !== "get") {
            return
        }
        if (req.body) delete req.body
        let body = {};
        body.tx = req.query.tx
        body.uuid = req.query.uuid
        body = JSON.stringify(body)
        proxyReq.method = "POST"
        proxyReq.setHeader('content-type', 'application/json')
        proxyReq.setHeader('content-length', body.length)
        proxyReq.write(body)
        proxyReq.end()
    },
    onProxyRes: function (proxyRes, req, res) {
        if (!isJson(req)) {
            return
        }
        const jsonRes = {
            success: proxyRes.statusCode === 200,
            url: process.env.BRIDGE_URL + `/operation/${req.query.uuid}`
        }
        if (!jsonRes.success) {
            jsonRes.error = "Failed to submit transaction"
        }
        delete proxyRes.headers['content-length'];
        modifyResponse(res, proxyRes.headers['content-encoding'], function (body) {
            return jsonRes;
        });
    }
})

function isJson(req) {
    const contentType = req.headers["content-type"]
    return contentType && contentType.toLowerCase() === "application/json"
}