var express = require('express')
var Router = express.Router()
var bodyParser = require('body-parser')
var dbserver = require('../dao/dbserver')
let routerData = require("../data/router")
let userData = require("../data/user")
let fs = require('fs')
let path = require('path')
let crypto = require("crypto")
let { jwtCheck } = require("../utils/token")

let { encryptVideo } = require("../utils/files")
const { log } = require('console')
Router.use(bodyParser.urlencoded({ extended: true }))
Router.use(bodyParser.json())

const videoPath = path.join(__dirname, "../assect/bzh.mp4"); // 视频文件路径
// const fileSize = fs.statSync(filePath).size; // 获取视频文件大小


Router.get('/video', async (req, res) => { // 定义路由，处理客户端请求
    // 获取视频文件的状态
    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;

    // 生成一个随机的加密密钥
    const algorithm = 'aes-256-cbc';
    const password = 'my-secret-password';
    const key = crypto.scryptSync(password, 'salt', 32);
    const iv = crypto.randomBytes(16);

    // 使用加密密钥加密视频文件
    const cipher = crypto.createCipheriv('aes-256-cbc', key,iv);
    const input = fs.createReadStream(videoPath);
    const output = fs.createWriteStream(`${videoPath}.enc`);

    input.pipe(cipher).pipe(output);

    // 设置视频的 Content-Type 和 Content-Length
    res.setHeader('Content-Type', 'video/mp4');
    res.setHeader('Content-Length', fileSize);

    // 创建可读流并将其发送给客户端
    const stream = fs.createReadStream(`${videoPath}.enc`);
    stream.pipe(res);

});

Router.post('/login', async (req, res) => {
    console.log(123)
    let { account, password } = req.body
    let response_data = await dbserver.login(account, password)
    res.send(response_data)
})

Router.get('/router', async (req, res) => {
    let { uid } = req.query
    console.log(uid) 
    if (uid) {
        const userInfo = userData.filter(item => item.id == uid)[0]
        if (userInfo) {
            let autoRouteList = []
            userInfo.auth.map(rid => {
                routerData.map((route) => {
                    if (route.id == rid) {
                        autoRouteList.push(route)
                    }
                })
            })
            res.status(200).send({
                data: autoRouteList,
                msg: '成功'
            })
        } else {
            res.status(200).send({
                data: null,
                msg: "没有找到路由"
            })
        }
    } else {
        res.status(200).send({
            data: null,
            msg: 'no uid'
        })
    }
})

Router.get('/getUserInfo',jwtCheck, async (req, res) => {
    let jwtInfo = req.jwtInfo
    if(jwtInfo){
        let {_id} = jwtInfo
        let response_data = await dbserver.getUserInfo(_id)
        res.send(response_data)
    }
})

//获取好友列表
Router.get("/getfriends",jwtCheck,async (req, res) => {
    let jwtInfo = req.jwtInfo
    if(jwtInfo){
        let {_id} = jwtInfo
        let response_data = await dbserver.getUserFriends(_id)
        res.send(response_data)
    }

})

// 获取好友的聊天记录
Router.get("/getChatMassAge",jwtCheck,async (req, res) => {
    let jwtInfo = req.jwtInfo
    let {friendId} = req.query
    if(jwtInfo){
        let {_id} = jwtInfo
        let response_data = await dbserver.getUserFriendsChatMsg(_id,friendId)
        res.send(response_data)
    }

})

// 获取好友的聊天记录
Router.post("/sendChatMassAge",jwtCheck,async (req, res) => {
    let jwtInfo = req.jwtInfo
    let {friendId,message,type} = req.body
    console.log("传参", req.query,req.params,req.body)
    if(jwtInfo){
        let {_id} = jwtInfo
        let response_data = await dbserver.createChatMassAge(_id,friendId,message,type)
        res.send(response_data)
    }

})



module.exports = Router