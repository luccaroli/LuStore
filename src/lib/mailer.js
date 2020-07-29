const nodemailer = require('nodemailer')

module.exports = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "7246ce5f4e6542",
    pass: "4cc99751f4dfca"
  }
});