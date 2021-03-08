const nodemailer = require("nodemailer");
const pug = require("pug");
const juice = require("juice");
const { htmlToText } = require('html-to-text');
const util = require("util");
const configEmail = require("../config/email");

let transport = nodemailer.createTransport({
    host: configEmail.domain,
    port: configEmail.port,
    auth: {
        user: configEmail.user_name,
        pass: configEmail.password,
    },
});

let generarHTML = (archivo, opciones = {}) => {
    const html = pug.renderFile(`${__dirname}/../views/emails/${archivo}.pug`, opciones);
    return juice(html)
}

exports.enviar = async (opciones) => {
    const html = generarHTML(opciones.archivo, opciones);
    const text = htmlToText(html);
    let opcionesEmail = {
        from: 'UpTask <np-reply@uptask.com>',
        to: opciones.usuario.email,
        subject: opciones.subject,
        text,
        html
    }
    const enviarEmail = util.promisify(transport.sendMail, transport);
    return enviarEmail.call(transport, opcionesEmail)
}