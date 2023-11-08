import { Router } from "express";
import { messagesManager } from "../DAO/mongodb/managers/messagesManager.js";
import { usersManager } from "../DAO/mongodb/managers/usersManager.js";
import { productsManager } from "../DAO/mongodb/managers/productsManager.js";
import { cartsManager } from "../DAO/mongodb/managers/cartsManager.js";

const router = Router();

router.get("/chat", async (req, res) => {
  if(!req.session.user){
    res.redirect(`/login`);
  }else{
  const messages = await messagesManager.findAll();
  const {username } = username;
  res.render("chat", { messages, username });
  }
});

router.get("/products", async (req, res) => {
  const products = await productsManager.findAggregation(req.query);
  res.render("products", { products: products });
});

router.get("/cart/:idCart", async (req, res) => {
  const {idCart} = req.params;
  const cartProducts = await cartsManager.findProductsInCart(idCart);
  res.render("cart", {idCart, products:cartProducts} );
});

router.get("/signup", (req, res) => {
  if(req.session.user){
    res.redirect(`/profile/${req.session.user.userId}`);
  }else{
    res.render("signup");
  }
});

router.get("/login", async (req, res) => {
  if(req.session.user){
    res.redirect(`/profile/${req.session.user.userId}`);
  }else{
    res.render("login");
  }
});

router.get("/profile/:idUser", async (req, res) => {
  if(!req.session.user){
    res.redirect(`/login`);
  }else{
  const { idUser } = req.params;
  const user = await usersManager.findById(idUser);
  const products = await productsManager.findAll();
  const { first_name, last_name, username } = user;
  res.render("profile", { first_name, last_name, username, products });
  }
});

export default router;