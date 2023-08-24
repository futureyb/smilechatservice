// 加密分片

let fs = require('fs')

const crypto = require("crypto")


const encryptionShard = (videoPath) => {
    const videoFile = fs.readFileSync(videoPath);
    // 分片大小
    const chunkSize = 1 * 1024 * 1024; // 每个片段 10MB
    // 分片并加密
    let offset = 0;
    let chunkIndex = 0;
    while (offset < videoFile.length) {
        const chunk = videoFile.slice(offset, offset + chunkSize); // 分片
        const cipher = crypto.createCipher('aes192', 'secret'); // 创建加密器
        const encryptedChunk = Buffer.concat([cipher.update(chunk), cipher.final()]); // 加密
        fs.writeFileSync(`chunk${chunkIndex}.enc`, encryptedChunk); // 写入文件
        offset += chunkSize;
        chunkIndex += 1;
    }
}

module.exports = {
    encryptionShard
}