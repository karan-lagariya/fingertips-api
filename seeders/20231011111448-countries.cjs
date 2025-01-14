/* eslint-disable no-await-in-loop */
/** @type {import('sequelize-cli').Migration} */

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

const rootFolder = __dirname;
const subFolder = 'sql';

const fullPath = path.join(rootFolder, subFolder, 'tbl_country.sql');

module.exports = {
    async up(queryInterface, Sequelize) {
        const sqlStatements = fs.readFileSync(fullPath, 'utf8').split(';');

        for (const statement of sqlStatements) {
            if (statement.trim()) {
                try {
                    // Execute the SQL statement
                    await queryInterface.sequelize.query(statement, {
                        type: Sequelize.QueryTypes.RAW,
                    });
                } catch (error) {
                    console.error('Error executing SQL statement:', statement);
                    console.error(error);
                }
            }
        }
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
        return queryInterface.bulkDelete('tbl_countries', null, {});
    },
};
