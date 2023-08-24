const db = require("../config/db");
const { jwtSign } = require('../utils/token')
const { formatDate } = require('../utils/utils')
exports.login = async (
    account, password
) => {
    const user_login = await db.userlogin.findFirst({
        where: {
            account,
            password,
        }
    });
    if (user_login) {
        const user = await db.userinfo.findUnique({
            where: {
                id: user_login.id
            }
        });
        if (user_login) return {
            code: 200, token: jwtSign({ _id: user.id }), msg: '登录成功'
        }
        return {
            code: 204,
            msg: '未注册'
        }
    } else {
        return {
            code: 201,
            token: null,
            msg: '你未注册'
        }
    }
};

exports.getUserInfo = async (id) => {
    console.log(id)
    const user_login = await db.userinfo.findUnique({
        where: {
            id
        }
    });
    return {
        code: 200,
        data: user_login
    }
}


//获取好友列表
exports.getUserFriends = async (id, friend_id) => {
    //获取关系表的好友
    const user_relation = await db.relation.findMany({
        where: {
            userId: id,
            state: 0
        }
    });
    const friendIds = user_relation.map(item => item.friendId)
    const friends = await db.userinfo.findMany({
        where: { id: { in: friendIds } },
        
    })


    //获取与好友的未读条数
    const updatedFriendsList = await Promise.all(
        friends.map(async friend => {
            const unreadMessageCount = await db.chatmassage.count({
                where: {
                    friendId: friend.id,
                    message_state: 0
                }
            });

            // 在现有好友对象的基础上添加未读消息数量属性
            return {
                ...friend,
                unreadMessageCount: unreadMessageCount
            };
        })
    );
    

    console.log("111", updatedFriendsList)


    return {
        code: 200,
        data: updatedFriendsList
    }
}

// 获取与好友的聊天记录
exports.getUserFriendsChatMsg = async (id, friendId) => {
    friendId = Number(friendId)
    const chat_massage = await db.chatmassage.findMany({
        where: {
            OR: [{
                userId: friendId,
                friendId: id
            }, {
                friendId: friendId,
                userId: id,
            }]
        },
        include: {
            userinfo: true
        },
        orderBy: {
            createAt: 'asc'           // Order by creation time
        }
    });
    if (chat_massage.length != 0) {
        chat_massage.forEach(item => {
            item.createAt = formatDate("yyyy-MM-dd hh:mm:ss", item.createAt)
        })
    }

    // console.log(chat_massage)
    return {
        code: 200,
        data: chat_massage
    }
}

//创建聊天记录
exports.createChatMassAge = async (id, friendId, message, type) => {
    const newMessage = await db.Chatmassage.create({
        data: {
            userId: id,
            friendId: friendId,
            message,
            type,
            createAt: new Date(),
            message_state: 0,
            ConversationId: 1
        }
    })
    return {
        code: 200,
        data: newMessage
    }
}