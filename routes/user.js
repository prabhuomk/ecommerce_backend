import {
  insertUser,
  getUser,
  updateUser,
  inserttoken,
  gettoken,
  deletetoken,
  inserttokens,
  gettokens,
  deletetokens,
  updateActiveStatus,
  AddItem,
  CheckCart,
  UpdateCart,
  GetCart,
  UpdatePrice,
  RemoveCart,
  UpdateDec,
  UpdateInc,
  EmptyCart,
  MyOrder,
  CancelOrder
} from "../helper/user.js";

import { getproduct, getOneproduct } from "../helper/admin.js";
import { createConnection } from "../index.js";
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { auth } from "../middleware/auth.js";
import { sendEmail } from "../middleware/mail.js";
import mongodb from "mongodb";
const router = express.Router();

//user signup router

router.route("/signup").post(async (request, response) => {
  const { email_id, firstname, lastname, password } = request.body;
  const client = await createConnection();
  const myUser = await getUser(client, { email_id: email_id });
  if (!myUser) {
    const hashedPassword = await genPassword(password);
    const isActive = "false";
    const pass = await insertUser(client, {
      email_id: email_id,
      firstname: firstname,
      lastname: lastname,
      password: hashedPassword,
      Account_Active: isActive,
    });
    const token = jwt.sign({ email_id: email_id }, process.env.REKEY);

    const store = await inserttokens(client, {
      email_id: email_id,
      token: token,
    });
    const link = `${process.env.BASE_URL}/account-activation/${email_id}/${token}`;
    const mail = await sendEmail(email_id, "Account Activation", link);
    console.log(hashedPassword, pass);
    response.send({
      message: "account activation link is send to your mail id",
    });
  } else {
    response.send({ message: "already same email_id exists" });
  }
});

router
  .route("/activate_account/:email_id/:token")
  .post(async (request, response) => {
    const email_id = request.params.email_id;
    const token = request.params.token;
    const client = await createConnection();
    const user = await gettokens(client, { token: token });
    if (!user) {
      response.send({ message: "invalid token" });
    } else {
      const updateStatus = "true";
      const updateuserActiveStatus = await updateActiveStatus(
        client,
        email_id,
        updateStatus
      );
      const deletemytokens = await deletetokens(client, { token: token });
      response.send({ message: "your account got activated" });
    }
  });

router.route("/login").post(async (request, response) => {
  const { email_id, password } = request.body;
  const client = await createConnection();
  const user = await getUser(client, { email_id: email_id });
  if (!user) {
    response.send({ message: "user not exist ,please sign up" });
  } else {
    if (user.Account_Active == "true") {
      console.log(user._id);

      const inDbStoredPassword = user.password;
      const isMatch = await bcrypt.compare(password, inDbStoredPassword);
      if (isMatch) {
        const token = jwt.sign({ id: user._id }, process.env.KEY);

        response.send({
          message: "successfully login",
          token: token,
          email_id: email_id,
        });
      } else {
        response.send({ message: "invalid login" });
      }
    } else {
      response.send({ message: "account not yet Activated" });
    }
  }
});

router.route("/myforgetpassword").post(async (request, response) => {
  const { email_id } = request.body;
  const client = await createConnection();
  const user = await getUser(client, { email_id });
  if (!user) {
    response.send({ message: "user not exist" });
  } else {
    const token = jwt.sign({ id: user._id }, process.env.REKEY);
    const expiryDate = Date.now() + 3600000;
    const store = await inserttoken(client, {
      tokenid: user._id,
      token: token,
      expiryDate: expiryDate,
    });
    const link = `${process.env.BASE_URL}/password-reset/${user._id}/${token}`;

    const mail = await sendEmail(user.email_id, "Password reset", link);
    response.send({
      message: "link has been send to your email_id for password change",
    });
  }
});

router.route("/resetpassword/:id/:token").post(async (request, response) => {
  const { password } = request.body;
  const id = request.params.id;
  const token = request.params.token;

  const client = await createConnection();
  const myForgetTokens = await gettoken(client, id);
  if (!myForgetTokens) {
    response.send({ message: "invalid token" });
  } else {
    if (Date.now() < myForgetTokens.expiryDate) {
      const hashedPassword = await genPassword(password);
      const updateuserpassword = await updateUser(client, id, hashedPassword);
      const deletetokens = await deletetoken(client, id);
      response.send({ message: "password got updated" });
    } else {
      response.send({ message: "link got expired" });
    }
  }
});

//to get the list of all product
router.route("/listofproduct").get(auth, async (request, response) => {
  try {
    const _id = request.params._id;
    const client = await createConnection();
    const myproduct = await getproduct(client, _id);
    response.send(myproduct);
  } catch (error) {
    response.send(error);
  }
});

// to get the product based on _id
router.route("/productlist/:_id").get(auth, async (request, response) => {
  const _id = request.params._id;
  const client = await createConnection();
  const myproduct = await getOneproduct(client, {_id:new mongodb.ObjectId(_id)});
  response.send(myproduct);
});

router.route("/mycart/:email").get(auth,async (request, response) => {
 const email_id=request.params.email;
 const Order="false";
  const client = await createConnection();
  const cart = await GetCart(client, {email_id,Order});
  response.send(cart);
}).delete( async (request, response) => {
const email_id=request.params.email;
 const Order="false";
  const client = await createConnection();
  const cart=await  EmptyCart(client,{email_id,Order});
  response.send({ message: " cart is Empty" });
 
});


router.route("/addtocart").post(auth, async (request, response) => {
  const { email_id, product_name, product_price, quantity } = request.body;
  const Order="false";
  const client = await createConnection();
  const finddata = await CheckCart(client, { email_id, product_name ,Order});
  console.log(finddata);
  if (finddata) {
    const _id = finddata._id;
    
    const updatecart = await UpdateCart(client, _id);
    const getprice=await CheckCart(client,{ _id:new mongodb.ObjectId(_id)})
    const quant=getprice.quantity;
    const myproduct = await getOneproduct(client, {product_name:product_name});
    const price=myproduct.product_price;
    const total=price*quant;
    const upddate= await UpdatePrice(client,_id,total);

    response.send({ message: "successfully added to cart" });
  } else {
    const cartItem = await AddItem(client, {
      email_id,
      product_name,
      product_price,
      quantity,
      Order
    });
    response.send({ message: "successfully added to cart" });
  }
});


router.route("/incrementcart").post(auth, async (request, response) => {
  const { email_id, product_name } = request.body;
  const Order="false";
  const client = await createConnection();
  const finddata = await CheckCart(client, { email_id, product_name,Order });

  const _id = finddata._id;
  const updatecart = await UpdateInc(client, _id);
    const getprice=await CheckCart(client,{ _id:new mongodb.ObjectId(_id)});
  
    const quant=getprice.quantity;
    const myproduct = await getOneproduct(client, {product_name:product_name});
    const price=myproduct.product_price;
    const total=price*quant;
    const upddate= await UpdatePrice(client,_id,total);
    
    response.send({ message: "successfully added to cart" });
 
});

router.route("/decrementcart").post(auth, async (request, response) => {
  const { email_id, product_name } = request.body;
  const Order="false";
  const client = await createConnection();
  const finddata = await CheckCart(client, { email_id, product_name,Order });
  const _id = finddata._id;
  const updatecart = await UpdateDec(client, _id);
  const getprice=await CheckCart(client,{ _id:new mongodb.ObjectId(_id)});
    const quant=getprice.quantity;
    const myproduct = await getOneproduct(client, {product_name:product_name});
    const price=myproduct.product_price;
    const total=price*quant;
    const upddate= await UpdatePrice(client,_id,total);
    
    response.send({ message: "successfully removed from cart" });
 
});
router.route("/cart/:_id").delete( async (request, response) => {
  const _id = request.params._id;
  const client = await createConnection();
  const cart=await RemoveCart(client,_id);
  response.send({ message: "successfully removed from cart " });
 
});



router.route("/myorder/:email").post(auth, async (request, response) => {
  const email_id=request.params.email;
  const { address,Mode_Payment,Payment_id } = request.body;
  const Order="true";
  const client = await createConnection();
  const updatecart = await MyOrder(client,email_id,Order,address,Mode_Payment,Payment_id);
  response.send({ message: "successfully order placed" });
  
});

router.route("/order/:email").get(auth,async (request, response) => {
  const email_id=request.params.email;
  const Order="true";
   const client = await createConnection();
   const cart = await GetCart(client, {email_id,Order});
   response.send(cart);
 })

 router.route("/cancel/:_id").post( async (request, response) => {
  const _id = request.params._id;
  const client = await createConnection();
  const cart=await CancelOrder(client,_id);
  response.send({ message: "successfully order cancel " });
 
});





async function genPassword(password) {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}

export const userRouter = router;
