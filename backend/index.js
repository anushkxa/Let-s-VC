import express from "express";
import {createServer} from "node:http";
import dotenv from "dotenv";
import {Server} from "socket.io";
dotenv.config();
import {connectToSocket } from "./src/controllers/socketManager.js";
import mongoose from "mongoose";

import cors from "cors";
const app =express();
app.use(cors());
app.use(express.json({limit:"40kb"}));
app.use(express.urlencoded({limit:"40kb",extended:true}));
const server = createServer(app);
const io = connectToSocket(server);

app.set("port",(process.env.PORT || 8000));
const url = process.env.MONGO_URL;


server.listen(app.get("port"),()=>{
    console.log("working");
    mongoose.connect(url);
    console.log("DB connected");
} )

app.get("/",(req,res)=>{
    res.json({"Working":"yess"});
})
