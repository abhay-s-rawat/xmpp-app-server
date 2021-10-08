require('dotenv').config();
const mysql = require("mariadb");
// Pooling is recommended for bigger projects
function createPool(count) {
    return mysql.createPool({
        connectionLimit: count,
        host: process.env.DB_HOST,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        timezone: process.env.DB_TIMEZONE,
    });
}
function endPool() {
    pool.end(function (err) {
        if (err) {
            return console.log(err.message);
        }
    });
}
const pool = createPool(10);

module.exports = {
    searchDB: async function (userJID) { // This function will search the Database for values
        let conn;
        var result = {};
        result.hasError = false;
        try {
            conn = await pool.getConnection();
            const res = await conn.query('CALL getNotficationTokenByJID(?)', [userJID]);
            if (conn) conn.end();
            if (res[0][0] != null) {
                result.notification_token = res[0][0].notification_token;
                result.device_type = res[0][0].device_type;
                result.hasError = false;
            }
            else result.hasError = true;
        } catch (err) {
            result.hasError = true;
            console.log(err);
        } finally {
            console.log(result);
            return result;
        }
    },
    saveToDB: async function (userJID, notification_token, device_type) { // This function updates database will new tokens, If user doesn't exists it will create new.
        let conn;
        var success = false;
        try {
            conn = await pool.getConnection();
            const res = await conn.query('CALL updateNotificationToken(?, ?, ?)', [userJID, notification_token, device_type]);
            if (conn) conn.end();
            if (res.affectedRows > 0) {
                success = true;
            }
        } catch (err) {
            success = false;
            console.log(err);
        } finally {
            return success;
        }
    },
};