import mongodb from "mongodb";

// admin details
export async function insertAdmin(client, user) {
    const result = await client.db("online_shopping").collection("admin").insertOne(user);
    console.log("successfully pass inserted", result);
    return result;
}





export async function getAdmin(client, filter) {
    const result = await client.db("online_shopping").collection("admin").findOne(filter);
    console.log("successfully matched", result);
    return result;
}

export async function insertproduct(client, user) {
    const result = await client.db("online_shopping").collection("product_list").insertOne(user);
    console.log("successfully product inserted", result);
    return result;
}

export async function getproduct(client,filter) {
    const result = await client.db("online_shopping").collection("product_list").find(filter).toArray();
    console.log("successfully matched", result);
    return result;
}

export async function getPrice(client,user) {
    const result = await client.db("online_shopping").collection("product_list").findOne(user);
    console.log("successfully matched", result);
    return result;
}


export async function getOneproduct(client,user) {
    const result = await client.db("online_shopping").collection("product_list").findOne(user);
    console.log("successfully matched", result);
    return result;
}

export async function updateproduct(client, _id,editList) {
    const result = await client.db("online_shopping").collection("product_list").updateOne({ _id:new mongodb.ObjectId(_id) },{$set:editList});
    console.log("successfully updated", result);
    return result;
}

export async function Price(client, _id,product_price) {
    console.log(product_price);
    const result = await client.db("online_shopping").collection("product_list").updateOne({ _id:new mongodb.ObjectId(_id) },{
        $toInt: product_price
     });
    console.log("successfully updated", result);
    return result;
}
export async function deleteproduct(client, _id) {
    const result = await client.db("online_shopping").collection("product_list").deleteOne({ _id:new mongodb.ObjectId(_id)});
    console.log("successfully deleted", result);
    return result;
}


