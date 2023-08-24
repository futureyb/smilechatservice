// const { PrismaClient } = require('@prisma/client')

// const prisma = new PrismaClient()


// const aa = async () => {
//     let  newUser = await prisma.userinfo.create({
//         data: {
//             nickName: '宝',
//             gender: 0,
//             createAt:new Date(),
//             email:'778009348@qq.com',
//             birthday:new Date('2000/01/02'),
//             phone:"18778189892",
//             signature:"爷奥耐我何",
//             header:"https://img0.baidu.com/it/u=4060770951,4069855872&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500",
//         }
//     })
//     console.log(newUser)
// }

// aa()


let express = require('express')
const exressWs = require('express-ws')
var cors = require('cors')
var router = require("./router/router")
var routerWs = require("./router/ws")
const cookieParser = require('cookie-parser')
const { getIp } = require("./utils/utils.js")
const app = express()
const port = 3001


app.use(cookieParser())

app.use(cors())
//websocket的中间件
app.use(routerWs)
//路由的中间件 
app.use(router)
exressWs(app)

//404页面
app.use((req, res, next) => {
    let err = new Error('Not Found')
    err.status = 404
    next(err)
})

//出现错误处理
app.use((err, req, res, next) => {
    console.log(err)
    res.status(err.status || 500)
    res.send(err.message)
})

app.listen(port, () => {
    console.log(`服务器开启中地址为：http://${getIp()}:${port}`)
})
