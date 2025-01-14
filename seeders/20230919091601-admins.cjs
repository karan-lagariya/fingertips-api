/** @type {import('sequelize-cli').Migration} */

// eslint-disable-next-line import/no-import-module-exports
const crypto = require('crypto-js');
const GLOBALS = require('../app-config/constants-migration.cjs');

module.exports = {
    async up(queryInterface, Sequelize) {
        /**
         * Add seed commands here.
         *
         * Example:
         * await queryInterface.bulkInsert('People', [{
         *   name: 'John Doe',
         *   isBetaMember: false
         * }], {});
         */
        const SECRET = crypto.enc.Hex.parse(GLOBALS.KEY);
        const ADMIN_IV = crypto.enc.Hex.parse(GLOBALS.IV);

        return queryInterface.bulkInsert('tbl_admins', [
            {
                first_name: 'Super',
                last_name: 'Admin',
                email: 'admin@mail.com',
                password: crypto.AES.encrypt('12345678', SECRET, {iv: ADMIN_IV}).toString(),
                role: 1,
                status: 1,
                is_deleted: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                first_name: 'Super',
                last_name: 'Admin2',
                email: 'admin1@mail.com',
                password: crypto.AES.encrypt('12345678', SECRET, {iv: ADMIN_IV}).toString(),
                role: 1,
                status: 1,
                is_deleted: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
        return queryInterface.bulkDelete('tbl_admins', null, {});
    },
};
