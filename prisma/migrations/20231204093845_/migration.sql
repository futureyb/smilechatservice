-- CreateTable
CREATE TABLE `relation` (
    `_id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `friendId` INTEGER NOT NULL,
    `applyId` INTEGER NOT NULL,
    `createAt` DATETIME(3) NOT NULL,
    `state` INTEGER NOT NULL,

    INDEX `relation_userId_fkey`(`userId`),
    PRIMARY KEY (`_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `userinfo` (
    `_id` INTEGER NOT NULL AUTO_INCREMENT,
    `nickName` VARCHAR(191) NOT NULL DEFAULT '宝子',
    `gender` INTEGER NOT NULL DEFAULT 0,
    `createAt` DATETIME(3) NOT NULL,
    `email` VARCHAR(191) NOT NULL DEFAULT '',
    `birthday` DATETIME(3) NOT NULL,
    `phone` VARCHAR(191) NOT NULL DEFAULT '',
    `signature` VARCHAR(191) NOT NULL DEFAULT '',
    `header` TEXT NOT NULL DEFAULT 'https://img0.baidu.com/it/u=3002413858,2200807329&fm=253&app=138&size=w931&n=0&f=JPEG&fmt=auto?sec=1700758800&t=7e4944fcd5004a41827a60fbcac95bfd',

    PRIMARY KEY (`_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `userlogin` (
    `_id` INTEGER NOT NULL AUTO_INCREMENT,
    `account` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `userInfoId` INTEGER NULL,

    UNIQUE INDEX `userlogin_account_key`(`account`),
    PRIMARY KEY (`_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `chatmassage` (
    `_id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `friendId` INTEGER NOT NULL,
    `message` TEXT NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `createAt` DATETIME(3) NOT NULL,
    `message_state` INTEGER NOT NULL,

    PRIMARY KEY (`_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `numberPool` (
    `_id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(191) NOT NULL,
    `isPretty` INTEGER NOT NULL DEFAULT 0,
    `signIn` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `relation` ADD CONSTRAINT `relation_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `userinfo`(`_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `userlogin` ADD CONSTRAINT `userLogin_userInfoId_fkey` FOREIGN KEY (`userInfoId`) REFERENCES `userinfo`(`_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chatmassage` ADD CONSTRAINT `Chatmassage_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `userinfo`(`_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
