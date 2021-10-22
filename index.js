import express from "express";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import {userRouter} from "./routes/user.js"
import {adminRouter} from "./routes/admin.js"
import cors from "cors"

dotenv.config();

const app =express();

const PORT=process.env.PORT;

app.use(express.json());

app.use(cors()); 

export async function createConnection(){
    const MONGO_URL=process.env.MONGO_URI;
    const client= new MongoClient(MONGO_URL);
    try{
        await client.connect();
        console.log("Server got sucessfully connected");
        return client;
    }
    catch(err){
        console.log(err);

    }
}


    


app.use('/user',userRouter);
app.use('/admin',adminRouter);


app.listen(PORT,()=>console.log("the server started",PORT));

app.get("/",(request,response)=>{
    response.send("welcome to PK's online Shopping ");
});
   




















