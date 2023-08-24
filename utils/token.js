const jwt = require('jsonwebtoken')
// token生成的密匙，根据自己需求定义
const jwtKey = '002580'
 
// token生成函数(jwtSign)，有效时间为一个小时
const jwtSign = (data) => {
  const token = jwt.sign(data, jwtKey, { expiresIn:  24 * 60 * 60 *1000 })
  return token
}
 
// token验证函数---解析token是否有效----其他请求方法
const jwtCheck = (req, res, next) => {
  //前端headers传来的token值:
  const token = req.headers.authorization
  jwt.verify(token, jwtKey, (err, data) => {
    console.log(err)
    if (err) {
      console.log('token失效了')
      res.send({
        message: '登录过期，请重新登录！',
        code: 201
      })
      return
    } else {
        console.log("token是",data)
      req.jwtInfo = data
      next()
    }
  })
}

const jwtCheckUtil = async (token)=>{
    let res = await jwt.verify(token, jwtKey, (err, data) => {
        console.log(err,data);
        if (err) {
          console.log('token失效了')
          return
        } else {
            return data
        }
      })
      return res
}
 
/*
    后台登录验证 : token
    token : token值
    jwtKey : 密钥
 */
const verifyToken = (token, jwtKey) => {
  return new Promise((resolve, reject) => {
    try {
      const info = jwt.verify(token, jwtKey)
      resolve(info)
    } catch (error) {
      console.log('后台报错了')
    }
  })
}
 
 
module.exports = {
  jwtSign,
  jwtCheck,
  verifyToken,
  jwtCheckUtil
}