import {getAdmin,insertAdmin,insertproduct,updateproduct,deleteproduct, getOneproduct }from "../helper/admin.js";
import {listbookproduct, listOneproduct,productUpdate,GetCart,OrderDelivered }from "../helper/user.js"
import {createConnection} from "../index.js";
import express, { request, response }  from 'express';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {auth} from "../middleware/auth.js"
import {sendEmail} from "../middleware/mail.js"
 
const router=express.Router();

router
.route("/signup")
.post(async (request,response)=>{
    
    const { admin_id,password }= request.body;
    const client=await createConnection();
    
    if(admin_id === "pk1" || admin_id==="pk2" || admin_id==="pk3" ){
    const user=await getAdmin(client,{admin_id:admin_id});
    if(user){
        response.send({message:"admin id already exist"})
    }
    else{
    const hashedPassword=await genPassword(password);
    const pass=await insertAdmin(client,{admin_id:admin_id,password:hashedPassword})
    response.send({message:"successfully signed up"});
    }
    }
    else
    {
        response.send({message:"enter a proper admin id"});
    }
    
});


router
.route("/login")
.post(async (request,response)=>{
    const { admin_id,password }= request.body;
    const client=await createConnection();
    const user=await getAdmin(client,{admin_id:admin_id});
    if(!user){
        response.send({message:"admin not exist ,please sign up"})
    }else{
    const inDbStoredPassword=user.password;
    const isMatch= await bcrypt.compare(password,inDbStoredPassword);
    if(isMatch){
        const token=jwt.sign({id:user._id},process.env.KEY)
    
        response.send({message:"successfully login",token:token});
    }
    else{
        response.send({message:"invalid login"});

    } 
}


});

router.route("/addproduct").post(auth,async (request,response)=>{
    const {img_src,product_name,product_price}=request.body;
   
    const client=await createConnection();
    const find=await getOneproduct(client,{product_name:product_name});
    if(find){
    const productList= await insertproduct(client,{img_src:img_src,product_name:product_name,product_price:Number(product_price)});
    
    response.send({message:"product got added"} );
    }
    else{
        response.send({message:"product name shoild be unique added"} );
    }
    
});



router.route("/allpendingproduct").get(auth,async(request,response)=>{
    const client=  await createConnection();
    const mybookedproduct =  await listbookproduct  (client,{product_status:"pending"});
    response.send(mybookedproduct);
});
router.route("/allcompletedproduct").get(auth,async(request,response)=>{
    const client=  await createConnection();
    const mybookedproduct =  await listbookproduct  (client,{product_status:"completed"});
    response.send(mybookedproduct);
});


router.route("/editproduct/:_id").post(auth,async (request,response)=>{
    const _id=request.params._id;
    const editdata=request.body;
    const client=await createConnection();
    const editList= await updateproduct(client,_id,editdata);
    response.send({message:"product got updated"} );
    
}).delete(auth,async(request,response)=>{
    const _id=request.params._id;
    
    const client = await createConnection();
    const data = await deleteproduct(client,_id);
    response.send({message:"deleted successfully"});
});

router.route("/productDone/:_id").post(auth,async(request,response)=>{
    
    const _id=request.params._id;
    const client= await createConnection();
    const check=await listOneproduct(client,_id);
    const usermail=check.email_id;
    const mail=  await sendEmail(usermail, "your bike product done",`collect your Vehicle from our product Station by Tomorrow evening 6:00PM
    By PK"s BIKE SERVICING`);
    const deletelist= await productUpdate(client,_id);
    response.send({message:"mail has been send to customer "})
    
})

router.route("/orderedlist").get(auth,async (request, response) => {
    
    const Order="true";
     const client = await createConnection();
     const cart = await GetCart(client, {Order});
     response.send(cart);
   })

   router.route("/deliveredlist").get(auth,async (request, response) => {
    
     const Order="delivery";
     const client = await createConnection();
     const cart = await GetCart(client, {Order});
     response.send(cart);
   })
   


   router.route("/cancelledlist").get(auth,async (request, response) => {
    
    const Order="cancel";
     const client = await createConnection();
     const cart = await GetCart(client, {Order});
     response.send(cart);
   })
   router.route("/delivery/:_id").get(async (request, response) => {
           const _id = request.params._id;

           const client = await createConnection();
           const cart = await OrderDelivered(client, _id );
           response.send({ message: "product delivered" });
       })




async function genPassword(password){
    
    const salt=await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt);
    return hashedPassword;
}


 export const adminRouter=router;