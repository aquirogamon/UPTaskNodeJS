require('dotenv').config();

module.exports = {
    user_name: process.env.MAIL_USER,
    password: process.env.MAIL_PASSWORD,
    address: process.env.MAIL_ADDRESS,
    domain: process.env.MAIL_DOMAIN,
    port: process.env.MAIL_PORT
}