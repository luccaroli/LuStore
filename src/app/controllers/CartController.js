const Cart = require("../../lib/cart")
const LoadProductService = require("../services/LoadProductService")

module.exports = {
  async index(req, res) {
    try {

      let { cart } = req.session 

      cart = Cart.init(cart)
      
      return res.render("cart/index", { cart })


    } 
    
    catch (error) {
      console.error(error)
    }
  },
  async addOne(req, res) {
    // pegar o id do produto e o product 
    const { id } = req.params

    const product = await LoadProductService.load('product', { where: { id } })

    // pegar o carrinho da sessão 
    let { cart } = req.session

    // add the product in cart 
    cart = Cart.init(cart).addOne(product)

    // update the cart of session
    req.session.cart = cart 

    // come back the users for page cart
    return res.redirect('/cart')
  },
  removeOne(req, res) {
    // get id product 
    let { id } = req.params

    // get cart session
    let { cart } = req.session

    // if not cart, return 
    if (!cart) return res.redirect('/cart')

    // init the cart 
    cart = Cart.init(cart).removeOne(id)

    // update the cart session, removed one item 
    req.session.cart = cart 

    // redirect for page cart 
    return res.redirect('/cart')
  }, 
  delete(req, res) {
    let { id } = req.params
    let { cart } = req.session

    if (!cart) return

    cart = Cart.init(cart).delete(id)

    req.session.cart = cart
    return res.redirect('/cart')
  }
}
