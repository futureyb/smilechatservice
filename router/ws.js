var express = require('express');
var expressWs = require('express-ws');
const WebSocket = require('ws');
const crypto = require('crypto')
let { jwtCheckUtil } = require("../utils/token")

var dbserver = require('../dao/dbserver');
const { log } = require('console');
var router = express.Router();
expressWs(router);

//心跳频率
const heartbeatInterval = 100000;

const clients = {}; // 存储连接的WebSocket客户端
router.ws('/socketTest', async function (ws, req) {    
    //获取token
    let token = req.headers['sec-websocket-protocol']
    //验证token
    let { _id } = await jwtCheckUtil(token)
    clients[_id] = ws
    //心跳连接
    const heartbeatTimer = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send('heartbeat');
        }
    }, heartbeatInterval);

    ws.on('message', function (msg) {
        //判断是否为心跳
        // if(msg === 'heartbeat') return 
        if (msg === 'heartbeat') return
        let { friendId, message, type } = JSON.parse(msg)
        dbserver.createChatMassAge(_id, friendId, message, type)
        if (clients[friendId]) {
            clients[friendId].send(msg)
        }
    })
    ws.on('close', () => {
        console.log(`WebSocket connection closed for user ${_id}`);

        clearInterval(heartbeatTimer)
        delete clients[_id]; // 从clients对象中移除断开的连接
    });
})

module.exports = router;