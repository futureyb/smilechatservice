const Mock = require('mockjs');



// 生成7位数字
// const generateSevenDigitNumber = () => {
//   const template = {
//     'nickName': "@cname",
//     'gender|1': [0,1,2],
//     'createAt': '@date()',
//     'email':'@email',
//     'birthday':'@date()',
//     'phone': /^1[0-9]{10}$/,
//     'signature': Mock.Random.csentence(5, 15),
//     'header':Mock.Random.image('200x200', Mock.Random.color()
//     , '@cname')

//   };
//   const result = Mock.mock({
//     'userList|10':[template]
//   });
//   return result
// };

let randomAccount = ()=> Mock.Random.integer(1000000000, 9999999999).toString()

const generateSevenDigitNumber = () => {
  const template = {
    "account": /^\d{10}$/,
    "password":/^\d{10}$/
  };
  const result = Mock.mock({
    'userList|10':[template]
  });
  return result
};

// 生成并输出7位数数字
const {userList} = generateSevenDigitNumber();
// console.log(userList);


const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()
 const aa = async () => {

        userList.forEach(async (item) => {
          
            console.log(item)
            let  newUser = await prisma.userlogin.create({
                data: {
                    ...item
                }
            })
        });
        
    }
    aa()
    



// const aa = async () => {

//     userList.forEach(async (item) => {
//         item.createAt = new Date(item.createAt)
//         item.birthday = new Date(item.birthday)
//         console.log(item)
//         let  newUser = await prisma.userinfo.create({
//             data: {
//                 ...item
//             }
//         })
//     });
    
// }

// aa()

