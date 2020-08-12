const crypto = require('crypto')
const User = require("../models/User")
const mailer = require("../../lib/mailer")
const { hash } = require('bcryptjs')

module.exports = {
  loginForm(req, res) {
    return res.render("session/login")
  },

  login(req, res) {
    req.session.userId = req.user.id

    return res.redirect("/users")
  },

  logout(req, res) {
    req.session.destroy()
    return res.redirect("/")
  },
  forgotForm(req, res) {
    return res.render("session/forgot-password")

  },
  async forgot(req, res) {
    const user = req.user


    // token 
    const token = crypto.randomBytes(20).toString("hex")

    // expiração do token 
    let now = new Date()
    now = now.setHours(now.setHours() + 1)

    await User.update(user.id, {
      reset_token: token,
      reset_token_expires: now
    }) 

    // email com link de redefinição
    await mailer.sendMail({
      to: user.email,
      from: 'no-reply@lustore.com',
      subject: 'Recuperação de senha',
      html: ` <h2>Olá, vamos ajudar você a recuperar sua senha</h2>
        <p>Click no link abaixo para recuperar sua senha</p>
        <p> 
          <a href="http://localhost:3000/users/password-reset?token=${token}" targent="_blank">
            Redefinir Senha
          </a>
        </p>
        `,
    })
    // avisar que o email foi enviado 
    return res.render("session/forgot-password", {
      success: "Verifique seu email para resetar sua senha!"
    })


  },
  resetForm(req, res) {
    return res.render("session/password-reset", { token: req.query.token })
  },
  async reset(req, res) {
    const user = req.user
    const { password, token } = req.body

    try {
      // criar novo hash de senha 
      const newPassword = await hash(password, 8)

      // atualiza o usuário 
      await User.update(user.id, {
        password: newPassword,
        reset_token: "",
        reset_token_expires: ""
      })

      // avisa o usuário que ele tem uma nova senha 
      return res.render("session/login", {
        user: req.body,
        success: "Senha atualizada! Faça seu login."
      })

    } catch(err) {
      return res.render("session/password-reset", {
        user: req.body,
        token,
        error: "Erro inesperado, tente novamente!"
      })
    }
  }
}