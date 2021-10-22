import mongodb from "mongodb";

// customer details

export async function insertUser(client, user) {
    const result = await client.db("online_shopping").collection("user").insertOne(user);
    console.log("successfully pass inserted", result);
    return result;
}

export async function getUser(client, filter) {
    const result = await client.db("online_shopping").collection("user").findOne(filter);
    console.log("successfully matched", result);
    return result;
}

export async function updateUser(client, _id,password) {
    const result = await client.db("online_shopping").collection("user").updateOne({ _id:new mongodb.ObjectId(_id) },{$set:{password:password}});
    console.log("successfully new password updated", result);
    return result;
}

export async function updateActiveStatus(client,email_id,updateStatus) {
    const result = await client.db("online_shopping").collection("user").updateOne({ email_id:email_id },{$set:{Account_Active:updateStatus}});
    console.log("successfully new password updated", result);
    return result;
}
// tokens for verify the account activation

export async function inserttokens(client, user) {
    const result = await client.db("online_shopping").collection("tokens_a").insertOne(user);
    console.log("successfully pass inserted", result);
    return result;
}

export async function gettokens(client, filter) {
    const result = await client.db("online_shopping").collection("tokens_a").findOne(filter);
    console.log("successfully matched", result);
    return result;
}


export async function deletetokens(client,token){
    const results= await client.db("online_shopping").collection("tokens_a").deleteOne(token);
    console.log("successfully token is deleted",results);
    return results;
}

// tokens for forgetpassword verifications

export async function inserttoken(client, user) {
    const result = await client.db("online_shopping").collection("tokens_l").insertOne(user);
    console.log("successfully pass inserted", result);
    return result;
}

export async function gettoken(client, tokenid) {
    const result = await client.db("online_shopping").collection("tokens_l").findOne({tokenid:new mongodb.ObjectId(tokenid)});
    console.log("successfully matched", result);
    return result;
}


export async function deletetoken(client,tokenid){
    const results= await client.db("online_shopping").collection("tokens_l").deleteOne({tokenid:new mongodb.ObjectId(tokenid)});
    console.log("successfully token is deleted",results);
    return results;
}


export async function bookproduct(client, user) {
    const result = await client.db("online_shopping").collection("booked_data").insertOne(user);
    console.log("successfully booked", result);
    return result;
}

export async function listbookproduct(client, user) {
    const result = await client.db("online_shopping").collection("booked_data").find(user).toArray();
    console.log("successfully matched", result);
    return result;
}
export async function listOneproduct(client, _id) {
    const result = await client.db("online_shopping").collection("booked_data").findOne({ _id:new mongodb.ObjectId(_id)});
    console.log("successfully matched", result);
    return result;
}
export async function productUpdate(client, _id) {
    const result = await client.db("online_shopping").collection("booked_data").updateOne({ _id:new mongodb.ObjectId(_id)},{$set:{product_status:"completed"}});
    console.log("successfully deleted", result);
    return result;
}





export async function AddItem(client, user) {
    const result = await client.db("online_shopping").collection("cartlist").insertOne(user);
    console.log("successfully product got added to cart", result);
    return result;
}
export async function CheckCart(client, user) {
    const result = await client.db("online_shopping").collection("cartlist").findOne(user);
    console.log("successfully matched", result);
    return result;
}
export async function GetCart(client, user) {
    const result = await client.db("online_shopping").collection("cartlist").find(user).toArray();
    console.log("successfully matched", result);
    return result;
}
export async function UpdateCart(client,_id) {
    const result = await client.db("online_shopping").collection("cartlist").updateOne({ _id:new mongodb.ObjectId(_id)},{ $inc: { quantity: 1 }});
   console.log("successfully updated",result);
    return result;

}

export async function OrderDelivered(client,_id) {
    const result = await client.db("online_shopping").collection("cartlist").updateOne({ _id:new mongodb.ObjectId(_id)},{ $set: { Order: "delivery" }});
   console.log("successfully updated",result);
    return result;

}

export async function MyOrder(client,email_id,Order,address,Mode_Payment,Payment_id) {
    const result = await client.db("online_shopping").collection("cartlist").updateMany({email_id:email_id},{ $set: { Order:Order,address:address,Mode_Payment:Mode_Payment,Payment_id:Payment_id }});
   console.log("successfully updated",result);
    return result;

}
export async function CancelOrder(client,_id) {
    const result = await client.db("online_shopping").collection("cartlist").updateOne({ _id:new mongodb.ObjectId(_id)},{ $set: { Order: "cancel" }});
   console.log("successfully updated",result);
    return result;

}


export async function UpdateInc(client,_id) {
    const result = await client.db("online_shopping").collection("cartlist").updateOne({ _id:new mongodb.ObjectId(_id)},{ $inc: { quantity: 1 }});
   console.log("successfully updated",result);
    return result;

}
export async function UpdateDec(client,_id) {
    const result = await client.db("online_shopping").collection("cartlist").updateOne({ _id:new mongodb.ObjectId(_id)},{ $inc: { quantity: -1 }});
   console.log("successfully updated",result);
    return result;

}

export async function UpdatePrice(client,_id,total) {
    const result = await client.db("online_shopping").collection("cartlist").updateOne({ _id:new mongodb.ObjectId(_id)},{ $set: {product_price:total }});
   console.log("successfully updated",result);
    return result;
}

export async function RemoveCart(client,_id){
    const results= await client.db("online_shopping").collection("cartlist").deleteOne({_id:new mongodb.ObjectId(_id)});
    console.log("successfully  deleted",results);
    return results;
}

export async function EmptyCart(client,user){
    const results= await client.db("online_shopping").collection("cartlist").deleteMany(user);
    console.log("successfully  deleted",results);
    return results;
}