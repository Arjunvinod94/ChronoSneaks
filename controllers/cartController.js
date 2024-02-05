const Cart = require('../models/cartModel')
const User = require('../models/userModel')
const Product = require('../models/productModel')
const Address = require('../models/addressModel')

const loadshoppingCart = async(req,res)=>{
    try {
        const userData = await User.findById({ _id:req.session.user_id})
        const user_id = req.session.user_id
        const userCart = await Cart.findOne({_id: user_id}).populate(
            'cart.product_id'
        )
        const userCartCount = userCart && userCart.cart ? userCart.cart.length : 0;
        res.render('shoppingCart',{user: userData, userCart, userCartCount})

    } catch (error) {
        console.log(error.message);
    }
}



const userAddToCart = async (req, res) => {
    try {

        const product_id = req.params.productId;
        const product = await Product.findOne({ _id: product_id });

        const user_id = req.session.user_id

        if(user_id) {
            const existingCart = await Cart.findOne({_id: user_id})

            if(existingCart) {
                const existingProduct = existingCart.cart.find((item)=>{
                    item.product_id.equals(product_id)
                })

                if(existingProduct){
                    return res.status(200).json({
                        success: true,
                        redirectTo: '/home/cart',
                        message: 'Product already added',
                        cartCount: existingCart.cart.length,
                    })
                } else {
                    const updatedCart = await Cart.findOneAndUpdate(
                        {_id: user_id},
                        {
                            $push: {
                                cart: {
                                    product_id: product_id,
                                    quantity: 1,
                                    name: product.name,
                                    image: product.images[0],
                                    price: product.price,
                                },
                            },
                        },
                        {new: true}
                    )

                    const total_price = updatedCart.cart.reduce(
                        (total, item) => total + item.price,
                        0
                    )
                    await Cart.findOneAndUpdate(
                        {_id: user_id},
                        {$set: { total_price: total_price}}
                    )
                    // return res.status(200).json({
                    //     success: true,
                    //     total_price,
                    //     message: "Product added to cart",
                    //     redirectTo: "/shoppingCart",
                    //     cartCount: updatedCart.cart.length,
                    //   });
                    return res.redirect('/shoppingCart')
                }
            } else {

                const newCart = new Cart({
                    _id: user_id,
                    cart: [
                        {
                            product_id: product_id,
                            quantity: 1,
                            name: product.name,
                            image: product.images[0],
                            price: product.price,
                        },
                    ],
                    total_price: product.price,
                })
                const cartData = await newCart.save()

                // return res.status(200).json({
                //     success: true,
                //     message: "Product added to cart",
                //     redirectTo: "/home/cart",
                //     cartCount: newCart.cart.length,
                //   });
                return res.redirect('/shoppingCart')
            }
        } else {
             // Redirect if the user is not authenticated
                return res.status(301).json({
                    success: false,
                    message: "User not authenticated",
                    redirectTo: "/login",

                });
        }
    } catch (error) {
        console.error(error);
        // Handle internal server error
        return res.status(500).json({
          success: false,
          message: "Internal server error",
        });
      }
    };

    const deleteCartItem = async (req, res) => {
      try {
        const user_id = req.session.user_id;
        const cartItemIdToDelete = req.body.cartItemId;
    
        // Check if the user is authenticated
        if (!user_id) {
          return res.status(401).json({
            success: false,
            message: "User not authenticated",
            redirectTo: "/login",
          });
        }
    
        // Find the user's cart
        const userCart = await Cart.findOne({ _id: user_id });
    
        // Check if the cart exists
        if (!userCart) {
          return res.status(404).json({
            success: false,
            message: "Cart not found",
          });
        }
    
        // Find the index of the item to delete
        const itemIndexToDelete = userCart.cart.findIndex(
          (item) => item._id.toString() === cartItemIdToDelete
        );
    
        // Check if the item exists in the cart
        if (itemIndexToDelete === -1) {
          return res.status(404).json({
            success: false,
            message: "Item not found in the cart",
          });
        }
    
        // Remove the item from the cart array
        userCart.cart.splice(itemIndexToDelete, 1);
    
        // Update the total_price in the cart
        const total_price = userCart.cart.reduce(
          (total, item) => total + item.price,
          0
        );
    
        // Assign the updated total_price to userCart
        userCart.total_price = total_price;
    
        // Save the updated cart
        await userCart.save();
    
        return res.status(200).json({
          success: true,
          message: "Item removed from the cart",
          redirectTo: '/shoppingCart',
          total_price,
        });
      } catch (error) {
        console.error(error);
        // Handle internal server error
        return res.status(500).json({
          success: false,
          message: "Internal server error",
        });
      }
    };
    
const loadCheckout = async(req,res)=>{
  try {
    const userData = await User.findOne({_id: req.session.user_id})
    const userCart = await Cart.findOne({_id: req.session.user_id}).populate(
      'cart.product_id'
  )
  const userCartCount = userCart && userCart.cart ? userCart.cart.length : 0;
  const addressData = await Address.findOne({user_id: req.session.user_id})
  if(userCartCount > 0) {
    res.render('checkout',{user: userData, userCart, addressData})
  } else {
    res.redirect('/shoppingCart')
  }

  } catch (error) {
    console.log(error.message);
  }
}

const addAddress = async (req, res) => {
  try {
    const user_id = req.session.user_id
    const user = await User.findById({ _id: user_id })
    const userCart = await Cart.findOne({ _id: user_id })

    const addressObj = {
      name: req.body.name,
      address: req.body.address,
      city: req.body.city,
      state: req.body.state,
      country: req.body.country,
      zipcode: req.body.zipcode,
      mobile: req.body.mobile,
    
    }

    const data = await Address.findOne({user_id: user_id })
    if (data) {

      // var addAddress = []
      // for(let i=0; i<data.address.length; i++) {
      //   addAddress.push(data.address[i])
      // }
      // addAddress.push(req.body.address)
      // const updated_data = await Address.findOneAndUpdate(
      //   {user_id: user_id},
      //   {$set:{address: addAddress}}
      //   )

      //   res.render('checkout', { updated_data, user, userCart, addressData: data})
      //   console.log("address added to array");

      await Address.findOneAndUpdate(
        {user_id: user_id},
        {$push:{address: addressObj}}
      )
      res.redirect('/shoppingCart/checkout')

    } else {
      const address = new Address({
        user_id: user_id,
        // address: req.body.name + ", " + req.body.address + ", " + req.body.city + ", " + req.body.country + ", " + req.body.zipcode + ", " + req.body.mobile
        address: addressObj
      })
      const addressData = await address.save()

      res.redirect('/shoppingCart/checkout')
    }

  } catch (error) {
    res.status(400).send({ success: false, msg: error.message })
  }
}
      



module.exports = {
    loadshoppingCart,
    userAddToCart,
    deleteCartItem,
    loadCheckout,
    addAddress,
}