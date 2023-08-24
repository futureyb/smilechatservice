const { PrismaClient } = require('@prisma/client')
const db = new PrismaClient()
db.$connect().catch(error => console.log("数据库连接失败",error))
module.exports = db